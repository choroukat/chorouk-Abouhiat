import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import { PROCEDURES_DATA, searchProcedures } from './src/data/procedures.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security Middleware: Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed for Vite SPA dev and client bundle
    crossOriginEmbedderPolicy: false,
  })
);

// Security Middleware: CORS Allowlist
const rawCorsOrigins = process.env.CORS_ALLOWED_ORIGINS || '';
const allowedOrigins = rawCorsOrigins
  ? rawCorsOrigins.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.APP_URL].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS request blocked by security policy'));
    },
    credentials: true,
  })
);

// Rate Limiting per IP
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Limite de requêtes atteinte. Veuillez patienter quelques minutes avant de réessayer.',
  },
});

app.use('/api/', apiRateLimiter);

// Body limit strictly set to 6 MB
app.use(express.json({ limit: '6mb' }));

// Request Timeout Middleware (30s)
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(30000, () => {
    if (!res.headersSent) {
      res.status(504).json({ error: 'Délai d’attente dépassé (Request timeout).' });
    }
  });
  next();
});

// Server-side Gemini initialization per guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
const rawModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
// Automatically upgrade deprecated gemini-2.5-flash to gemini-3.8-flash
const modelName = rawModel.includes('2.5') ? 'gemini-3.8-flash' : rawModel;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Moroccan Administrative Procedure Aliases & Keyword Boosters (Phase 2 RAG)
const MOROCCAN_KEYWORD_ALIASES: Record<string, string[]> = {
  proc_univ_inscription: ['fac', 'lafac', 'jami3a', 'universite', 'inscri', 'تسجيل', 'جامعة', 'لافاك', 'كلية', 'الكلية', 'انتقال', 'bac', 'باك'],
  proc_stage_pfe: ['stage', 'pfe', 'convention', 'rapport', 'تدريب', 'سطاج', 'كونفونسيون', 'شركة', 'مقاولة'],
  proc_minhaty: ['bourse', 'minhaty', 'rsu', 'flous', 'منحة', 'منحتي', 'سجل اجتماعي', 'الدعم', 'فلوس'],
  proc_cnie_carte_nationale: ['cin', 'cnie', 'carte', 'بطاقة', 'لاكارت', 'بطاقة وطنية', 'لاكارط', 'تجديد لاكارط', 'ضيعت لاكارط'],
  proc_passeport_biometrique: ['passeport', 'paspor', 'passport', 'جواز', 'باسبور', 'فيزا', 'سفر', 'جواز سفر'],
  proc_permis_conduire: ['permis', 'conduire', 'سياقة', 'بيرمي', 'رخصة السياقة', 'نارسا', 'narsa', 'سياقه'],
  proc_attestation_scolarite: ['scolarite', 'attestation', 'releve', 'شهادة مدرسية', 'بيان النقط', 'شواهد', 'نقط'],
  proc_legalisation_copies: ['legalisation', 'mouqata3a', 'mouqataa', 'moqata3a', 'tas-hih', 'tas7i7', 'توقيع', 'مقاطعة', 'تصحيح', 'تصحيح الإمضاء', 'مصادقة', 'عقد ازدياد'],
  proc_ofppt_inscription: ['ofppt', 'ista', 'ita', 'takwine', 'تكوين', 'تكوين مهني', 'مكتب التكوين', 'ستا'],
  proc_amo_tadamon: ['amo', 'cnss', 'tadamon', 'tadamoun', 'ramed', 'تغطية', 'تغطية صحية', 'تضامن', 'كنوس', 'رميد'],
  proc_logement_onousc: ['cite', 'onousc', 'logement', 'حي جامعي', 'سكن جامعي', 'أونوسك', 'بيت'],
  proc_retrait_diplome: ['diplome', 'diplom', 'retrait', 'سحب الدبلوم', 'شهادة الإجازة', 'سحب الباك', 'كرطونة'],
};

// Advanced RAG Retrieval for Moroccan administrative procedures
function retrieveRelevantProcedures(userQuery: string) {
  const queryLower = userQuery.toLowerCase().trim();
  const searchResults = searchProcedures(userQuery);

  // Scored matching
  const scored = PROCEDURES_DATA.map((p) => {
    let score = 0;
    const aliases = MOROCCAN_KEYWORD_ALIASES[p.id] || [];

    // Search index score
    const inSearchIdx = searchResults.findIndex((sr) => sr.id === p.id);
    if (inSearchIdx >= 0) {
      score += Math.max(15, 60 - inSearchIdx * 6);
    }

    const queryWords = queryLower.split(/[\s.,!?،_\-/]+/).filter(Boolean);

    // Direct tag match with word boundary check
    if (
      p.tags.some((t) => {
        const tagLower = t.toLowerCase();
        if (tagLower.length <= 4) {
          return queryWords.includes(tagLower);
        }
        return queryWords.some((w) => w === tagLower || (w.length > 5 && w.includes(tagLower)));
      })
    ) {
      score += 25;
    }

    // Direct alias match (including short acronyms like fac, cin, pfe, amo, bac)
    for (const alias of aliases) {
      const aliasLower = alias.toLowerCase();
      if (aliasLower.length <= 4) {
        if (queryWords.includes(aliasLower)) {
          score += 35;
        }
      } else {
        const regex = new RegExp(`(^|[\\s.,!?،_\\-/])${aliasLower}([\\s.,!?،_\\-/]|$)`, 'i');
        if (regex.test(queryLower) || queryWords.some((w) => w.includes(aliasLower))) {
          score += 35;
        }
      }
    }

    // Direct slug match
    if (queryLower.includes(p.slug)) {
      score += 50;
    }

    return { procedure: p, score };
  });

  const matched = scored
    .filter((item) => item.score >= 20)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.procedure);

  return matched;
}

// Zod Validation Schemas
const assistantSchema = z.object({
  message: z.string().min(1, 'Le message est obligatoire').max(2000, 'Message trop long'),
  history: z
    .array(
      z.object({
        sender: z.enum(['user', 'assistant']),
        text: z.string().max(3000),
      })
    )
    .optional(),
  language: z.enum(['darija', 'ar', 'fr']).optional().default('darija'),
});

const ocrScanSchema = z.object({
  imageBase64: z.string().min(20, 'Données image manquantes').max(8 * 1024 * 1024, 'Fichier trop lourd'),
  mimeType: z
    .string()
    .regex(/^image\/(jpeg|png|webp|heic)$|^application\/pdf$/)
    .optional()
    .default('image/jpeg'),
});

const generateDemandeSchema = z.object({
  type: z.enum([
    'stage',
    'inscription',
    'attestation',
    'diplome',
    'releve',
    'transfert',
    'administrative',
  ]),
  language: z.enum(['fr', 'ar']).default('fr'),
  fullName: z.string().min(2, 'Le nom complet est obligatoire').max(100),
  cinNumber: z.string().min(2, 'Le numéro CIN est obligatoire').max(30),
  cneOrMassar: z.string().max(30).optional().default(''),
  universityOrCompany: z.string().min(2, 'Le destinataire est obligatoire').max(150),
  phone: z.string().max(30).optional().default(''),
  email: z.string().max(100).optional().default(''),
  city: z.string().max(60).optional().default('Maroc'),
  notes: z.string().max(1000).optional().default(''),
});

const explainDocSchema = z.object({
  documentName: z.string().min(2, 'Nom du document obligatoire').max(120),
  language: z.enum(['darija', 'ar', 'fr']).optional().default('darija'),
});

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'Wach Nqder? 🇲🇦',
    version: '1.0.0',
    hasGeminiKey: Boolean(apiKey),
    model: modelName,
    timestamp: new Date().toISOString(),
  });
});

// 2. Procedures catalog
app.get('/api/procedures', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const category = (req.query.category as string) || 'all';
  const results = searchProcedures(query, category);
  res.json({ procedures: results, total: results.length });
});

// 3. AI Assistant endpoint (RAG architecture with Gemini Flash)
app.post('/api/assistant', async (req: Request, res: Response) => {
  try {
    const parseResult = assistantSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Paramètres invalides',
        details: parseResult.error.format(),
      });
    }

    const { message, history = [], language } = parseResult.data;

    if (!ai) {
      return res.status(503).json({
        error:
          'Service d’intelligence artificielle non configuré. Veuillez définir la clé GEMINI_API_KEY dans votre environnement.',
      });
    }

    // RAG step: Retrieve relevant Moroccan administrative procedures
    const retrievedProcedures = retrieveRelevantProcedures(message);
    const topProcedure = retrievedProcedures[0];

    const proceduresContext = retrievedProcedures.length > 0
      ? retrievedProcedures
          .map(
            (p) => `
Procedure: ${p.title.fr} / ${p.title.ar} / ${p.title.darija}
Catégorie: ${p.category}
Description: ${p.description.fr}
Documents requis:
${p.requiredDocuments.map((d) => `- ${d.name.fr} (${d.copies} copie(s)) [${d.notes?.fr || ''}]`).join('\n')}
Lieu de dépôt: ${p.location.fr}
Frais: ${p.feesMAD} DH
Rendez-vous obligatoire: ${p.appointmentRequired ? 'OUI (' + (p.appointmentUrl || '') + ')' : 'NON'}
Statut de vérification: ${p.verificationStatus}
Dernière vérification officielle: ${p.userVerificationDate || p.lastVerifiedDate}
Source officielle: ${p.officialSource} (${p.officialSourceUrl})
`
          )
          .join('\n---\n')
      : 'Aucune procédure spécifique trouvée dans la base de données pour cette requête.';

    const systemPrompt = `
You are "Wach Nqder?" (واش نقدر؟) 🇲🇦, the premier Moroccan smart mobile administrative assistant.
You specialize in Moroccan administrative procedures, university enrollments, internships (PFE / Stage), national identity (CNIE), passport, Minhaty scholarship, OFPPT, AMO Tadamon, and civil documents (Al Mouqata'a).

CORE RULES:
1. Language: The user's active interface language is "${language}".
   - If the user talks to you in Moroccan Darija (Arabic script or Arabizi/Latin letters like "bghit ndfe3 l fac chno khasni?"), reply warmly and naturally in Moroccan Darija!
   - If in Arabic, reply in clear, helpful Arabic.
   - If in French, reply in professional and approachable French.
2. Tone: Warm, helpful, encouraging, and accurate (e.g. using "أكيد ❤️", "مرحبا بك", "باش نعطيك اللائحة الصحيحة").
3. Anti-Hallucination & Anti-Prompt-Injection:
   - Use ONLY verified Moroccan administrative facts from the provided context below.
   - NEVER invent official administrative requirements.
   - If no relevant procedure is found in the context and you do not have verified official Moroccan requirements, clearly state: "ما عنديش معلومة رسمية مؤكدة بخصوص هذا الإجراء حالياً، يرجى مراجعة الإدارة المختصة أو بوابة idarati.ma." / "Je ne dispose pas d'informations officielles vérifiées pour cette démarche spécifique. Veuillez consulter l'administration concernée ou idarati.ma."
   - Always mention the official source (${topProcedure ? topProcedure.officialSource : 'Portail Idarati.ma'}) and the warning: "⚠️ Cette information peut changer. Vérifiez toujours la dernière annonce officielle."
4. STRUCTURED CHECKLIST:
   - If and only if a clear procedure is matched, output a structured JSON checklist block formatted like this:
   :::CHECKLIST_START:::
   {
     "procedureId": "${topProcedure?.id || 'proc_custom'}",
     "title": "${topProcedure ? topProcedure.title.fr : 'Documents nécessaires'}",
     "documents": ${JSON.stringify(topProcedure?.requiredDocuments.map((d) => `${d.name.fr} (${d.copies} copie${d.copies > 1 ? 's' : ''})`) || [])}
   }
   :::CHECKLIST_END:::

VERIFIED MOROCCAN PROCEDURES KNOWLEDGE BASE CONTEXT:
${proceduresContext}
`;

    // Prevent prompt injection: send the last 6 turns as structured conversation history
    const lastSixTurns = history.slice(-6);
    const contents: any[] = lastSixTurns.map((turn) => ({
      role: turn.sender === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text }],
    }));

    // Add current user message as last turn
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let rawText = '';
    if (ai) {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI response timeout')), 8000)
        );
        const aiCall = ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.3,
          },
        });
        const response: any = await Promise.race([aiCall, timeoutPromise]);
        rawText = response.text || '';
      } catch (callError) {
        console.warn('Gemini call timed out or failed, generating verified direct synthesis:', callError);
      }
    }

    if (!rawText.trim()) {
      if (topProcedure) {
        const procTitle =
          language === 'darija'
            ? topProcedure.title.darija
            : language === 'ar'
            ? topProcedure.title.ar
            : topProcedure.title.fr;
        const procLoc =
          language === 'darija'
            ? topProcedure.location.darija
            : language === 'ar'
            ? topProcedure.location.ar
            : topProcedure.location.fr;
        const docsList = topProcedure.requiredDocuments
          .map((d) => {
            const name =
              language === 'darija'
                ? d.name.darija
                : language === 'ar'
                ? d.name.ar
                : d.name.fr;
            return `• ${name} (${d.copies} copie${d.copies > 1 ? 's' : ''})`;
          })
          .join('\n');

        if (language === 'darija') {
          rawText = `مرحبا بك! بخصوص **${procTitle}**، هاهما الوثائق والشروط الرسمية المؤكدة:\n\n📄 **الوثائق المطلوبة:**\n${docsList}\n\n🏢 **مكان الإيداع:** ${procLoc}\n💰 **الواجبات / الرسوم:** ${topProcedure.feesMAD === 0 ? 'فابور (مجاني)' : `${topProcedure.feesMAD} درهم`}\n📅 **الموعد الإلكتروني:** ${topProcedure.appointmentRequired ? 'ضروري تحجز موعد مسبق' : 'بدون موعد'}\n\nتقدر تزيد هاد اللائحة للمتابعة فمساحة الوثائق باش تبقى مراقب شنو وجدتي!`;
        } else if (language === 'ar') {
          rawText = `مرحباً بك! فيما يخص مسطرة **${procTitle}**، إليك المعلومات والوثائق الرسمية المؤكدة:\n\n📄 **الوثائق المطلوبة:**\n${docsList}\n\n🏢 **مكان الإيداع:** ${procLoc}\n💰 **الرسوم:** ${topProcedure.feesMAD === 0 ? 'مجاني (0 درهم)' : `${topProcedure.feesMAD} درهم`}\n📅 **الموعد الإلكتروني:** ${topProcedure.appointmentRequired ? 'إلزامي عبر المنصة' : 'بدون موعد مسبق'}\n\nيمكنك إضافة هذه القائمة إلى مساحتك لتتبع تقدم جمع الملف.`;
        } else {
          rawText = `Bonjour ! Concernant la démarche **${procTitle}**, voici les exigences officielles vérifiées :\n\n📄 **Documents requis :**\n${docsList}\n\n🏢 **Lieu de dépôt :** ${procLoc}\n💰 **Frais :** ${topProcedure.feesMAD === 0 ? 'Gratuit (0 DH)' : `${topProcedure.feesMAD} DH`}\n📅 **Rendez-vous :** ${topProcedure.appointmentRequired ? 'Obligatoire en ligne' : 'Sans rendez-vous'}\n\nVous pouvez ajouter cette checklist à votre espace pour suivre la préparation de votre dossier.`;
        }
      } else {
        if (language === 'darija') {
          rawText = `ما كايناش معلومة رسمية مؤكدة بخصوص هذا الطلب حالياً. يرجى مراجعة الإدارة المختصة أو بوابة idarati.ma الرسمية.`;
        } else if (language === 'ar') {
          rawText = `لا تتوفر معلومات رسمية مؤكدة بشأن هذا الإجراء حالياً. يرجى مراجعة الإدارة المختصة أو زيارة بوابة idarati.ma.`;
        } else {
          rawText = `Je ne dispose pas d'informations officielles vérifiées pour cette démarche spécifique. Veuillez consulter l'administration concernée ou le portail idarati.ma.`;
        }
      }
    }

    let checklistData: any = null;
    let cleanReply = rawText;

    // Parse :::CHECKLIST_START::: block
    const match = rawText.match(/:::CHECKLIST_START:::([\s\S]*?):::CHECKLIST_END:::/);
    if (match && match[1]) {
      try {
        checklistData = JSON.parse(match[1].trim());
        cleanReply = rawText.replace(/:::CHECKLIST_START:::[\s\S]*?:::CHECKLIST_END:::/, '').trim();
      } catch (e) {
        console.error('Failed to parse checklist JSON', e);
      }
    }

    if (!checklistData && topProcedure && retrievedProcedures.length > 0) {
      checklistData = {
        procedureId: topProcedure.id,
        title: topProcedure.title.fr,
        documents: topProcedure.requiredDocuments.map((d) => `${d.name.fr} (${d.copies}x)`),
      };
    }

    res.json({
      reply: cleanReply,
      relatedProcedure: topProcedure || null,
      suggestedChecklist: checklistData,
      sources: topProcedure
        ? [
            {
              name: topProcedure.officialSource,
              url: topProcedure.officialSourceUrl,
              lastVerifiedDate: topProcedure.userVerificationDate || topProcedure.lastVerifiedDate,
            },
          ]
        : [],
      warningNotice: '⚠️ Cette information peut changer. Vérifiez toujours la dernière annonce officielle.',
    });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error);
    res.status(500).json({
      error: 'Erreur lors du traitement de votre demande par l’assistant IA.',
      details: error?.message || 'Server error',
    });
  }
});

// 4. OCR Document Scanner endpoint (Strictly no fake fallbacks)
app.post('/api/ocr-scan', async (req: Request, res: Response) => {
  try {
    const parseResult = ocrScanSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Données de document invalides pour le scan.',
        details: parseResult.error.format(),
      });
    }

    const { imageBase64, mimeType } = parseResult.data;

    if (!ai) {
      return res.status(503).json({
        error:
          'Service OCR non configuré. Veuillez définir la clé GEMINI_API_KEY dans votre environnement pour activer le scan optique.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `
You are an expert Moroccan administrative document scanner and OCR engine.
Analyze this uploaded Moroccan document (e.g. Carte Nationale d'Identité CNIE, Diplôme de Baccalauréat, Relevé de notes, Attestation de scolarité, Passeport, etc.).
Extract all printed and handwritten text accurately.
Identify the document type (one of: 'cin', 'diploma', 'attestation', 'releve', 'birth_cert', or 'other').
Extract key fields if present: fullName, cinNumber, birthDate, institution, validity.
Return strictly valid JSON in this format:
{
  "docType": "cin",
  "extractedText": "exact full text found...",
  "extractedDetails": {
    "fullName": "...",
    "cinNumber": "...",
    "birthDate": "...",
    "institution": "...",
    "validity": "..."
  },
  "confidence": 0.95
}
`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ocr-scan:', error);
    res.status(500).json({
      error: 'Erreur lors de l’analyse OCR du document.',
      details: error?.message || 'Server error',
    });
  }
});

// Official Moroccan Administrative Letter Templates (Loi 55-19 & Standard Administrative Protocol)
function generateOfficialMoroccanDemandeTemplate(data: {
  type: string;
  language: 'fr' | 'ar';
  fullName: string;
  cinNumber: string;
  cneOrMassar?: string;
  universityOrCompany: string;
  phone?: string;
  email?: string;
  city: string;
  notes?: string;
}): { content: string; title: string } {
  const today = new Date().toLocaleDateString(data.language === 'ar' ? 'ar-MA' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const city = data.city || (data.language === 'ar' ? 'المغرب' : 'Maroc');

  if (data.language === 'ar') {
    let subject = 'طلب إداري';
    let body = '';

    switch (data.type) {
      case 'stage':
        subject = 'طلب اجتياز تدريب مهني في مقاولة (Stage PFE)';
        body = `يشرفني أن ألتمس من سيادتكم بكل احترام الموافقة على طلبي لاجتياز تدريب مهني بمؤسستكم الموقرة.\n\nويهدف هذا التدريب إلى تعميق مداركي التطبيقية والميدانية وربط التكوين النظري بالواقع العملي، مع التزامي التام بالنظام الداخلي وحفظ السر المهني للمؤسسة.`;
        break;
      case 'inscription':
        subject = 'طلب التسجيل الجامعي / استعطاف للتسجيل';
        body = `يشرفني أن ألتمس من سيادتكم الموقرة قبول تسجيلي بالمؤسسة برسم الموسم الجامعي الحالي.\n\nوأحيطكم علماً بأني حاصل على الشواهد المطلوبة وأبدي رغبة أكيدة في متابعة دراستي بكل انضباط وجدية.`;
        break;
      case 'attestation':
        subject = 'طلب الحصول على شهادة مدرسية وكشف النقط';
        body = `يشرفني أن ألتمس من سيادتكم تسليمي شهادة مدرسية وكشف النقط الخاص بمساري الدراسي برسم السنة الجارية، وذلك للإدلاء بها في ملف إداري خاص.`;
        break;
      case 'diplome':
        subject = 'طلب سحب شهادة التخرج الأصلية (الديبلوم)';
        body = `يشرفني أن ألتمس من سيادتكم تمكيني من سحب شهادة التخرج الأصلية بعد أن أتممت بنجاح جميع متطلبات التكوين وأبرأت ذمتي الإدارية والمكتبية.`;
        break;
      case 'releve':
        subject = 'طلب كشف النقط الرسمي';
        body = `يشرفني أن ألتمس من سيادتكم الموقرة تمكيني من نسخة رسمية من كشف النقط للسنوات الدراسية المقضاة بمؤسستكم.`;
        break;
      case 'transfert':
        subject = 'طلب الانتقال الإداري والجامعي';
        body = `يشرفني أن ألتمس من سيادتكم الموافقة على طلبي للانتقال إلى مؤسستكم لمتابعة مساري الأكاديمي، نظراً لظروف الإقامة والمحيط العائلي.`;
        break;
      default:
        subject = 'طلب إداري عام';
        body = `يشرفني أن ألتمس من سيادتكم الموقرة النظر بعين العناية في هذا الطلب الإداري، الرامي إلى تسوية المعاملة الإدارية المعنية وفق القوانين الجاري بها العمل.`;
        break;
    }

    const notesParagraph = data.notes?.trim() ? `\n\nملاحظات إضافية:\n${data.notes.trim()}` : '';

    const content = `${city} في: ${today}

من المعني بالأمر:
الاسم والنسب: ${data.fullName}
رقم البطاقة الوطنية: ${data.cinNumber}
${data.cneOrMassar ? `رمز مسار / الرقم الوطني: ${data.cneOrMassar}` : ''}
الهاتف: ${data.phone || 'غير محدد'}
البريد الإلكتروني: ${data.email || 'غير محدد'}

إلى السيد(ة) المسؤول(ة) عن:
${data.universityOrCompany}

الموضوع: ${subject}

سلام تام بوجود مولانا الإمام المؤيد بالله،

وبعد،
${body}${notesParagraph}

وفي انتظار موافقتكم الكريمة وتفضلكم بقبول طلبي، تقبلوا فائق عبارات التقدير والاحترام.

والسلام.

إمضاء المعني بالأمر:
${data.fullName}`;

    return {
      content,
      title: `${subject} - ${data.fullName}`,
    };
  } else {
    // French Official Administrative Standard
    let subject = 'DEMANDE ADMINISTRATIVE';
    let body = '';

    switch (data.type) {
      case 'stage':
        subject = "DEMANDE DE STAGE D'INITIATION / PFE";
        body = `J'ai l'honneur de solliciter votre haute bienveillance de bien vouloir m'accorder un stage au sein de votre honorable structure.\n\nCe stage me permettra de consolider mes acquis théoriques par une immersion concrète sur le terrain, tout en m'engageant à respecter rigoureusement le règlement intérieur et la confidentialité de vos activités.`;
        break;
      case 'inscription':
        subject = "DEMANDE D'INSCRIPTION UNIVERSITAIRE";
        body = `J'ai l'honneur de solliciter votre haute bienveillance de bien vouloir autoriser mon inscription au sein de votre établissement pour l'année académique en cours.\n\nTitulaire des diplômes requis, je souhaite vivement intégrer votre formation afin d'y poursuivre mon parcours d'études avec assiduité.`;
        break;
      case 'attestation':
        subject = "DEMANDE D'ATTESTATION DE SCOLARITÉ ET RELEVÉ DE NOTES";
        body = `J'ai l'honneur de solliciter votre haute bienveillance de bien vouloir me délivrer une attestation de scolarité ainsi qu'un relevé de notes officiel, nécessaires pour la constitution de mon dossier administratif.`;
        break;
      case 'diplome':
        subject = 'DEMANDE DE RETRAIT DU DIPLÔME ORIGINAL';
        body = `J'ai l'honneur de solliciter votre haute bienveillance de bien vouloir m'autoriser à retirer l'original de mon diplôme, ayant validé l'ensemble des modules requis et accompli les formalités de quitus nécessaires.`;
        break;
      case 'releve':
        subject = 'DEMANDE DE RELEVÉ DE NOTES OFFICIEL';
        body = `J'ai l'honneur de vous demander la délivrance d'un relevé de notes officiel certifiant les résultats obtenus au cours de mon cycle de formation au sein de votre établissement.`;
        break;
      case 'transfert':
        subject = 'DEMANDE DE TRANSFERT UNIVERSITAIRE';
        body = `J'ai l'honneur de solliciter votre haute bienveillance de bien vouloir accepter mon dossier de transfert vers votre établissement, afin de poursuivre mon cursus académique dans les meilleures conditions.`;
        break;
      default:
        subject = 'DEMANDE ADMINISTRATIVE';
        body = `J'ai l'honneur de solliciter votre haute bienveillance d'examiner favorablement ma présente requête administrative, conformément aux procédures et règlements en vigueur.`;
        break;
    }

    const notesParagraph = data.notes?.trim() ? `\n\nPrécisions complémentaires :\n${data.notes.trim()}` : '';

    const content = `Fait à ${city}, le ${today}

Demandeur :
${data.fullName}
CNIE : ${data.cinNumber}
${data.cneOrMassar ? `CNE / Massar : ${data.cneOrMassar}` : ''}
Tél : ${data.phone || 'Non renseigné'}
Email : ${data.email || 'Non renseigné'}

À l'attention de la Direction :
${data.universityOrCompany}

OBJET : ${subject}

Madame, Monsieur le Directeur,

${body}${notesParagraph}

Dans l'attente d'une suite favorable à ma requête, je vous prie d'agréer, Madame, Monsieur le Directeur, l'expression de ma très haute considération.

Signature :
${data.fullName}`;

    return {
      content,
      title: `${subject} - ${data.fullName}`,
    };
  }
}

// 5. Official Moroccan Demande Generator endpoint (Phase 3)
app.post('/api/generate-demande', async (req: Request, res: Response) => {
  try {
    const parseResult = generateDemandeSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Champs de formulaire invalides',
        details: parseResult.error.format(),
      });
    }

    const {
      type,
      language,
      fullName,
      cinNumber,
      cneOrMassar,
      universityOrCompany,
      phone,
      email,
      city,
      notes,
    } = parseResult.data;

    // If Gemini is not configured, immediately use official Moroccan legal template
    if (!ai) {
      const template = generateOfficialMoroccanDemandeTemplate({
        type,
        language,
        fullName,
        cinNumber,
        cneOrMassar,
        universityOrCompany,
        phone,
        email,
        city,
        notes,
      });
      return res.json(template);
    }

    const todayDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-MA' : 'fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const prompt = `
Generate a formal, highly professional administrative letter ("Demande administrative") according to official Moroccan standards.
Type of request: ${type}
Target recipient: ${universityOrCompany}
Applicant: ${fullName}
CIN: ${cinNumber}
CNE/Massar: ${cneOrMassar || 'N/A'}
Phone: ${phone || 'N/A'}
Email: ${email || 'N/A'}
City: ${city}
Date: ${todayDate}
Additional context/notes: ${notes}
Language: ${language === 'ar' ? 'Official administrative Arabic (اللغة العربية الإدارية الفصحى المعمول بها في المغرب)' : 'Official administrative French (Français administratif formel du Maroc)'}

Make sure to format it with clear headers, proper salutations ("سلام تام بوجود مولانا الإمام" if Arabic, "J'ai l'honneur de solliciter votre haute bienveillance" if French), structured body paragraphs, polite closing formula, and placeholder for signature.
Do NOT output Markdown asterisks or bold markers inside the letter body text.
`;

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.2,
        },
      });

      res.json({
        content: response.text || '',
        title: `Demande de ${type} - ${fullName}`,
      });
    } catch (aiError) {
      console.warn('Gemini API call failed, falling back to official legal template:', aiError);
      const fallbackTemplate = generateOfficialMoroccanDemandeTemplate({
        type,
        language,
        fullName,
        cinNumber,
        cneOrMassar,
        universityOrCompany,
        phone,
        email,
        city,
        notes,
      });
      res.json(fallbackTemplate);
    }
  } catch (error: any) {
    console.error('Error in /api/generate-demande:', error);
    res.status(500).json({
      error: 'Erreur lors de la rédaction de la demande.',
      details: error?.message || 'Server error',
    });
  }
});

// 6. Document Explainer endpoint (Strictly no fake fallbacks)
app.post('/api/explain-doc', async (req: Request, res: Response) => {
  try {
    const parseResult = explainDocSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Nom de document invalide',
        details: parseResult.error.format(),
      });
    }

    const { documentName, language } = parseResult.data;

    if (!ai) {
      return res.status(503).json({
        error: 'Service d’explication non disponible sans clé GEMINI_API_KEY.',
      });
    }

    const prompt = `
Explain the following Moroccan administrative document in clear, simple terms:
Document: "${documentName}"
Language: "${language}" (Moroccan Darija, Arabic, or French).

Provide a structured explanation covering:
1. What it is (ماهيتها)
2. Why it is needed / Purpose (علاش كتصلح)
3. Where to get it (فين كتصاوب)
4. Who issues it (شكون كيعطيها)
5. Typical validity & cost in Morocco (المدة والمصاريف)
Keep it conversational, friendly, and practical.
`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.2,
      },
    });

    res.json({ explanation: response.text || '' });
  } catch (error: any) {
    console.error('Error in /api/explain-doc:', error);
    res.status(500).json({
      error: 'Erreur lors de l’explication du document.',
      details: error?.message || 'Server error',
    });
  }
});

// Global error handler for JSON parse errors and CORS
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Le fichier transmis dépasse la limite autorisée de 6 Mo.' });
  }
  if (err?.message === 'CORS request blocked by security policy') {
    return res.status(403).json({ error: 'Origine non autorisée par la politique de sécurité CORS.' });
  }
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Start Express server and mount Vite in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🇲🇦 Wach Nqder? Server running on http://0.0.0.0:${PORT} [Model: ${modelName}]`);
  });
}

startServer();
