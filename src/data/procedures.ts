import { Procedure } from '../types';

export const PROCEDURES_DATA: Procedure[] = [
  {
    id: 'proc_univ_inscription',
    slug: 'inscription-universitaire-faculte',
    category: 'education',
    title: {
      fr: 'Inscription Universitaire (Facultés & Accès Ouvert)',
      ar: 'التسجيل الجامعي في الكليات ذات الاستقطاب المفتوح',
      darija: 'التسجيل في لافاك (الجامعة المغربية)',
    },
    description: {
      fr: "Procédure d'inscription officielle pour les bacheliers dans les facultés marocaines (FSJES, Faculté des Sciences, Faculté des Lettres).",
      ar: 'إجراءات التسجيل الرسمي لحاملي شهادة البكالوريا في الكليات المغربية المفتوحة.',
      darija: 'كيفاش تقيد ف لافاك مورا الباك، والوراق لي خاصينك باش تدفع للجامعة.',
    },
    requiredDocuments: [
      {
        id: 'doc_bac_original',
        name: {
          fr: 'Diplôme original du Baccalauréat',
          ar: 'شهادة البكالوريا الأصلية',
          darija: 'شهادة الباكالوريا الأصلية (الكرطونة)',
        },
        copies: 1,
        notes: {
          fr: 'Requis pour validation définitive',
          ar: 'مطلوبة للتأكيد النهائي',
          darija: 'ضرورية للتسجيل النهائي وماكيرجعوهاش حتى تكمل القراية',
        },
        commonIssuers: ['Académie Régionale AREF', 'Lycée'],
      },
      {
        id: 'doc_bac_copies',
        name: {
          fr: 'Copies certifiées conformes du Baccalauréat',
          ar: 'نسخ مصادق عليها من شهادة البكالوريا',
          darija: 'فوتوكوبي ديال الباك مصادق عليهم',
        },
        copies: 4,
        notes: {
          fr: 'Selon la faculté (parfois 2 à 4 copies)',
          ar: 'بين 2 و4 نسخ حسب الكلية',
          darija: 'دير 4 فوتوكوبيات باش تهنا',
        },
      },
      {
        id: 'doc_cin_copies',
        name: {
          fr: 'Copies de la Carte Nationale (CNIE)',
          ar: 'نسخ من البطاقة الوطنية للتعريف',
          darija: 'فوتوكوبي ديال لاكارط ناسيونال',
        },
        copies: 3,
        notes: {
          fr: 'CNIE en cours de validité',
          ar: 'بطاقة صالحة وغير منتهية',
          darija: 'تكون لاكارط مازال صالحة',
        },
      },
      {
        id: 'doc_photos_identite',
        name: {
          fr: "Photos d'identité récentes",
          ar: 'صور فوتوغرافية حديثة',
          darija: 'تصاور صغار بحال ديال الباسبور',
        },
        copies: 4,
        notes: {
          fr: "Format officiel 35x45mm avec nom et CNE au verso",
          ar: 'مقاس رسمي مع كتابة الاسم ورقم مسار بالخلف',
          darija: 'كتب سميتك ورقم مسار مورا التصاور',
        },
      },
      {
        id: 'doc_recu_preinscription',
        name: {
          fr: 'Reçu de préinscription en ligne',
          ar: 'وصل التسجيل القبلي عبر المنصة الإلكترونية',
          darija: 'الروصي ديال التسجيل القبلي فالأنترنت',
        },
        copies: 2,
        notes: {
          fr: 'Téléchargé depuis la plateforme de votre université',
          ar: 'يتم تحميله من موقع الجامعة',
          darija: 'تيليشارجيه من سيت لافاك',
        },
      },
      {
        id: 'doc_dossier_medical',
        name: {
          fr: 'Dossier médical scolaire',
          ar: 'الملف الصحي المدرسي',
          darija: 'الملف الطبي من السبيطار أو الليسي',
        },
        copies: 1,
        notes: {
          fr: "Délivré par le lycée d'origine ou centre de santé",
          ar: 'يسلم من الثانوية الأصلية أو المركز الصحي',
          darija: 'كتربحو من الليسي ديالك',
        },
      },
    ],
    eligibility: {
      fr: 'Être titulaire du Baccalauréat marocain ou diplôme équivalent reconnu.',
      ar: 'الحصول على شهادة البكالوريا المغربية أو ما يعادلها المعترف به.',
      darija: 'خاص تكون خديتي الباك المغربي أو شهادة معادلة.',
    },
    steps: [
      {
        fr: 'Effectuer la pré-candidature sur le portail numérique de votre université (ex: Université Hassan II, Mohammed V, Cadi Ayyad).',
        ar: 'القيام بالتسجيل القبلي عبر البوابة الرقمية للجامعة التابع لها إقليمك.',
        darija: 'دير التسجيل القبلي فالسيت ديال الجامعة لي تابع ليها إقليمك.',
      },
      {
        fr: 'Imprimer le reçu de préinscription avec le code-barres.',
        ar: 'طباعة وصل التسجيل القبلي المتضمن لرمز التأكيد.',
        darija: 'طبع الروصي لي فيه الكود بار.',
      },
      {
        fr: 'Rassemblez les documents du dossier physique et déposez-les au service de scolarité de la faculté.',
        ar: 'جمع الوثائق المطلوبة وإيداع الملف حضورياً بمصلحة الشؤون الطلابية للكلية.',
        darija: 'جمع الوراق وديهم لمصلحة الشؤون الطلابية ف لافاك.',
      },
      {
        fr: "Récupérer l'attestation d'inscription provisoire et la carte d'étudiant.",
        ar: 'استلام شهادة التسجيل المؤقتة وبطاقة الطالب.',
        darija: 'خد شهادة التسجيل المؤقتة وبطاقة الطالب ديالك.',
      },
    ],
    location: {
      fr: 'Service de scolarité de la faculté concernée dans votre ville.',
      ar: 'مصلحة الشؤون الطلابية بالكلية المعنية في مدينتك.',
      darija: 'مصلحة الشؤون الطلابية (Scolarité) فالكلية فمدينتك.',
    },
    appointmentRequired: false,
    feesMAD: 0,
    deadline: {
      fr: 'Généralement entre le 1er et le 25 septembre de chaque année universitaire.',
      ar: 'عادة بين 1 و25 شتنبر من كل موسم جامعي.',
      darija: 'غالبا ما بين 1 و25 شتنبر فكل عام.',
    },
    officialSource: 'Ministère de l’Enseignement Supérieur, de la Recherche Scientifique et de l’Innovation',
    officialSourceUrl: 'https://www.enssup.gov.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-09-01',
    tags: ['جامعة', 'fac', 'licence', 'bac', 'etudiant', 'inscription', 'etudes'],
  },
  {
    id: 'proc_stage_pfe',
    slug: 'demande-convention-stage-pfe',
    category: 'internship',
    title: {
      fr: 'Convention et Demande de Stage (Stage d’initiation / PFE)',
      ar: 'اتفاقية وطلب التدريب المهني في مقاولة (PFE / Stage)',
      darija: 'وراق وكونفونسيون ديال السطاج فشركة (Stage / PFE)',
    },
    description: {
      fr: "Démarches pour obtenir votre convention tripartite de stage et préparer votre demande officielle pour postuler auprès d'une entreprise.",
      ar: 'إجراءات الحصول على اتفاقية التدريب الثلاثية وإعداد طلب التدريب الرسمي للشركات والمؤسسات.',
      darija: 'كيفاش تاخد الكونفونسيون من الجامعة وشنو خاصك باش تدفع للسطاج فشركة.',
    },
    requiredDocuments: [
      {
        id: 'doc_demande_stage',
        name: {
          fr: 'Demande manuscrite ou imprimée de stage signée',
          ar: 'طلب خطي أو مطبوع لاجتياز تدريب مهني',
          darija: 'طلب خطي أو مطبوع ديال السطاج (Demande de stage)',
        },
        copies: 1,
        notes: {
          fr: 'Peut être générée automatiquement via Wach Nqder',
          ar: 'يمكن توليدها مباشرة عبر التطبيق',
          darija: 'تقدر تصاوبها بنيشان من هاد التطبيق وتيليشارجيها PDF',
        },
      },
      {
        id: 'doc_convention_tripartite',
        name: {
          fr: 'Convention de stage tripartite (en 3 exemplaires)',
          ar: 'اتفاقية التدريب الثلاثية (3 نسخ أصلية)',
          darija: 'كونفونسيون ديال السطاج فـ 3 نسخ',
        },
        copies: 3,
        notes: {
          fr: "Signée par l'étudiant, l'établissement et l'entreprise d'accueil",
          ar: 'موقعة ومختومة من الطالب، المؤسسة، والشركة المستقبلة',
          darija: 'كتسينيها نتا والمدرسة والشركة لي عاتستقبلك',
        },
        commonIssuers: ['Université', 'École (ENSA/EST/ENCG)', 'OFPPT'],
      },
      {
        id: 'doc_assurance_responsabilite',
        name: {
          fr: 'Attestation d’assurance responsabilité civile pour stage',
          ar: 'شهادة التأمين ضد حوادث الشغل والمسؤولية المدنية',
          darija: 'شهادة التأمين المدرسي للسطاج (Assurance)',
        },
        copies: 1,
        notes: {
          fr: "Fournie par l'assurance scolaire ou souscrite auprès d'une agence",
          ar: 'تسلم من التأمين المدرسي للجامعة أو وكالة تأمين',
          darija: 'كتعطيها ليك المدرسة مع التأمين السنوي',
        },
      },
      {
        id: 'doc_cv_etudiant',
        name: {
          fr: 'Curriculum Vitae (CV) actualisé',
          ar: 'السيرة الذاتية المحينة للطالب',
          darija: 'السيرة الذاتية ديالك (CV)',
        },
        copies: 1,
      },
      {
        id: 'doc_carte_etudiant_copy',
        name: {
          fr: 'Copie de la carte d’étudiant ou attestation de scolarité',
          ar: 'نسخة من بطاقة الطالب أو شهادة المتابعة الدراسية',
          darija: 'فوتوكوبي كارط ديوديون أو شهادة القراية',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Étudiant régulièrement inscrit dans un établissement d’enseignement supérieur ou de formation professionnelle.',
      ar: 'طالب مسجل بصفة نظامية في مؤسسة تعليم عالي أو تكوين مهني بالمغرب.',
      darija: 'تكون طالب كتقرا فشي لافاك، مدرسة عليا أو لوفبيبيطي.',
    },
    steps: [
      {
        fr: 'Rédiger et envoyer votre demande de stage + CV à l’entreprise ciblée.',
        ar: 'صياغة وإرسال طلب التدريب والسيرة الذاتية إلى المؤسسة أو الشركة.',
        darija: 'صيفط الطلب والـ CV للشركة لي باغي دير فيها السطاج.',
      },
      {
        fr: 'Après accord de l’entreprise, retirer le modèle officiel de convention auprès de votre administration.',
        ar: 'بعد قبول الشركة، سحب نموذج الاتفاقية من إدارة مؤسستك التعليمية.',
        darija: 'ملي يجاوبوك بالقبول، خود الكونفونسيون من الإدارة.',
      },
      {
        fr: 'Faire signer et tamponner la convention par l’entreprise, puis par la direction de votre école.',
        ar: 'توقيع وختم الاتفاقية من مسؤولي الشركة ثم إدارة كليتك.',
        darija: 'خلي الشركة تسيني وتكاشي، ومن بعد سيني فالمدرسة.',
      },
      {
        fr: 'Conserver votre exemplaire officiel tout au long de la période de stage.',
        ar: 'الاحتفاظ بنسختك الأصلية طيلة مدة التدريب الميداني.',
        darija: 'خبي نسختك معاك طول مدة السطاج كضمانة قانونية وتأمينية.',
      },
    ],
    location: {
      fr: 'Administration de votre établissement et entreprise d’accueil.',
      ar: 'إدارة مؤسستك التعليمية والشركة المعنية.',
      darija: 'الإدارة ديال مدرستك والشركة المستقبلة.',
    },
    appointmentRequired: false,
    feesMAD: 0,
    officialSource: 'Guide de l’Étudiant et Référentiel des Stages en Entreprise',
    officialSourceUrl: 'https://www.enssup.gov.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-03-15',
    tags: ['stage', 'pfe', 'travail', 'convention', 'entreprise', 'etudiant', 'سطاج'],
  },
  {
    id: 'proc_minhaty',
    slug: 'bourse-etudes-superieures-minhaty',
    category: 'scholarships',
    title: {
      fr: 'Bourse d’Enseignement Supérieur (Portail Minhaty - منحتي)',
      ar: 'منحة التعليم العالي للطلبة الجدد (بوابة منحتي)',
      darija: 'منحة التعليم العالي (منحتي minhaty.ma)',
    },
    description: {
      fr: 'Procédure dématérialisée d’octroi des bourses d’études universitaires pour les bacheliers marocains selon les critères sociaux du RSU.',
      ar: 'مسطرة الاستفادة من المنحة الدراسية الجامعية لحاملي البكالوريا عبر المنصة الإلكترونية وفق معايير السجل الاجتماعي الموحد.',
      darija: 'كيفاش تدفع لمنحتي من الأنترنت وشنو الشروط باش تخرج ليك المنحة الجامعية.',
    },
    requiredDocuments: [
      {
        id: 'doc_cnie_candidat',
        name: {
          fr: 'Numéro de Carte Nationale (CNIE) du candidat',
          ar: 'رقم البطاقة الوطنية للتعريف الإلكترونية للمترشح',
          darija: 'نمرة لاكارط ناسيونال ديالك',
        },
        copies: 1,
      },
      {
        id: 'doc_code_massar',
        name: {
          fr: 'Code MASSAR de l’élève',
          ar: 'رمز مسار الخاص بالتلميذ(ة)',
          darija: 'كود مسار ديالك (الحرف و 9 أرقام)',
        },
        copies: 1,
      },
      {
        id: 'doc_rsu_id',
        name: {
          fr: 'Identifiant Digital Civil et Social (IDCS / RSU)',
          ar: 'المعرف الرقمي المدني والاجتماعي للأسرة بالسجل الاجتماعي الموحد',
          darija: 'المعرف الرقمي ديال الدار فالسجل الاجتماعي الموحد (RSU)',
        },
        copies: 1,
        notes: {
          fr: 'La famille doit être enregistrée au RSU avec un score inférieur au seuil fixé',
          ar: 'يجب تسجيل الأسرة مسبقاً في السجل الاجتماعي الموحد والحصول على عتبة مقبولة',
          darija: 'خاص الأسرة تكون مقيدة فالسجل الموحد RSU والعتبة موافقة',
        },
      },
      {
        id: 'doc_declaration_revenus',
        name: {
          fr: 'Renseignements sur le revenu des parents (DGI)',
          ar: 'معلومات الدخل السنوي للأبوين المحينة لدى مصالح الضرائب',
          darija: 'معلومات الدخل السنوي للوالدين لي مسجلة عند الضرائب',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Candidats titulaires du Baccalauréat marocain de l’année en cours, âgés de moins de 26 ans, avec score d’éligibilité RSU vérifié.',
      ar: 'المترشحون الحاصلون على بكالوريا السنة الجارية، سن أقل من 26 سنة، ومطابقة عتبة السجل الاجتماعي الموحد.',
      darija: 'تكون شاد الباك فهاد العام، عمرك قل من 26 عام، وعندك تنقيط موافق فالسجل الاجتماعي RSU.',
    },
    steps: [
      {
        fr: 'Vérifier l’inscription de votre foyer au Registre Social Unifié (RSU) sur rsu.ma.',
        ar: 'التأكد من تسجيل الأسرة في السجل الاجتماعي الموحد عبر rsu.ma.',
        darija: 'تأكد بلي الوالدين والعائلة مسجلين فـ rsu.ma.',
      },
      {
        fr: 'Accéder au portail officiel minhaty.ma durant la période d’ouverture annuelle (mai - juillet).',
        ar: 'الدخول إلى بوابة minhaty.ma خلال فترة الترشيح الرسمية السنوية.',
        darija: 'دخل لموقع minhaty.ma فالفترة لي كتفتح فيها البوابة.',
      },
      {
        fr: 'Renseigner le code Massar, numéro CNIE, et valider les informations familiales.',
        ar: 'إدخال رمز مسار ورقم البطاقة الوطنية وتأكيد البيانات الأسرية.',
        darija: 'عمر كود مسار ولاكارط ناسيونال وفاليدي المعطيات.',
      },
      {
        fr: 'Conserver le récépissé de dépôt électronique et suivre le résultat de la commission.',
        ar: 'تحميل وطباعة وصل إيداع الطلب وتتبع النتائج لاحقاً.',
        darija: 'سجل وطبع وصل الطلب وبقى تبع النتيجة ملي يخرجو اللوائح.',
      },
    ],
    location: {
      fr: 'Procédure 100% en ligne sur minhaty.ma / Commissions provinciales des préfectures.',
      ar: 'إجراء رقمي 100% عبر minhaty.ma واللجان الإقليمية بالعمالات.',
      darija: 'العملية رقمية 100% من السيت minhaty.ma وتتبع فالعمالة.',
    },
    appointmentRequired: false,
    feesMAD: 0,
    deadline: {
      fr: 'Généralement fin juillet de l’année d’obtention du Baccalauréat.',
      ar: 'أواخر شهر يوليوز من سنة نيل شهادة البكالوريا.',
      darija: 'أواخر شهر 7 فالعام لي خديتي فيه الباك.',
    },
    officialSource: 'Ministère de l’Enseignement Supérieur & Commission Nationale des Bourses',
    officialSourceUrl: 'https://www.minhaty.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-05-10',
    tags: ['منحة', 'minhaty', 'bourse', 'argent', 'etudes', 'rsu', 'aide'],
  },
  {
    id: 'proc_cnie_carte_nationale',
    slug: 'carte-nationale-identite-electronique-cnie',
    category: 'identity',
    title: {
      fr: 'Carte d’Identité Nationale Électronique (CNIE 2ème Génération)',
      ar: 'البطاقة الوطنية للتعريف الإلكترونية (الجيل الثاني)',
      darija: 'لاكارط ناسيونال الإلكترونية (CNIE)',
    },
    description: {
      fr: 'Émission ou renouvellement de la CNIE biométrique marocaine auprès des services de la Sûreté Nationale (DGSN).',
      ar: 'إجراءات إنجاز أو تجديد البطاقة الوطنية للتعريف الإلكترونية لدى مصالح الأمن الوطني.',
      darija: 'كيفاش تصاوب أو تجدد لاكارط ناسيونال الجديدة، والوراق والرونديفو فـ cnie.ma.',
    },
    requiredDocuments: [
      {
        id: 'doc_cnie_acte_naissance',
        name: {
          fr: 'Extrait d’acte de naissance récent (-3 mois) ou Livret d’état civil',
          ar: 'عقد ازدياد حديث العهد (أقل من 3 أشهر) أو نسخة من الدفتر العائلي',
          darija: 'عقد ازدياد (حالة مدنية) ما فايتش 3 شهور أو الدفتر العائلي',
        },
        copies: 1,
        notes: {
          fr: 'Non requis si vos données sont déjà synchronisées via le RNP',
          ar: 'معفى منها إذا كانت المعطيات مدمجة في السجل الوطني للسكان',
          darija: 'معفي منها يلا كانت بياناتك مسجلة فالـ RNP',
        },
        commonIssuers: ['Bureau d’état civil', 'Watiqa.ma'],
      },
      {
        id: 'doc_cnie_residence',
        name: {
          fr: 'Certificat de résidence délivré par la police ou gendarmerie',
          ar: 'شهادة السكنى مسلمة من مصالح الشرطة أو الدرك الملكي',
          darija: 'شهادة السكنى من الكوميسارية أو الجوندارم (أو البوليس)',
        },
        copies: 1,
        notes: {
          fr: 'Valable 3 mois, basée sur quittance eau/électricité ou certificat administratif',
          ar: 'صالحة لـ 3 أشهر بناء على وصل الماء والكهرباء أو عقد الكراء',
          darija: 'كتصاوبها بفاكتورة الضو/الما أو عقد الكراء',
        },
        commonIssuers: ['Sûreté Nationale', 'Gendarmerie Royale'],
      },
      {
        id: 'doc_cnie_photos',
        name: {
          fr: 'Deux (2) photos d’identité réglementaires récentes',
          ar: 'صورتان فوتوغرافيتان حديثتان تستوفيان المعايير',
          darija: '2 تصاور صغار بمعايير لاكارط الجديدة (خلفية رمادية فاتحة)',
        },
        copies: 2,
        notes: {
          fr: 'Format 35x45mm, fond uni gris clair ou bleu clair, sans reflets',
          ar: 'مقاس 35x45 ملم بخلفية فاتحة موحدة',
          darija: 'بلا نضاضر شمسية ولا ابتسامة',
        },
      },
      {
        id: 'doc_cnie_timbre',
        name: {
          fr: 'Quittance de paiement du timbre fiscal (75 DH)',
          ar: 'توصيل أداء واجبات التمبر المالي (75 درهماً)',
          darija: 'تمبر ديال 75 درهم (أو توصيل الخلاص من البنك/الأنترنت)',
        },
        copies: 1,
        notes: {
          fr: 'Acheté dans un bureau de tabac ou payé dématérialisé',
          ar: 'يؤدى مباشرة أو عبر منافذ الأداء المعتمدة',
          darija: '75 درهم للبطاقة العادية',
        },
      },
      {
        id: 'doc_cnie_ancienne',
        name: {
          fr: 'Ancienne CNIE (en cas de renouvellement)',
          ar: 'البطاقة الوطنية القديمة (في حالة التجديد)',
          darija: 'لاكارط القديمة ديالك يلا كنتي عاتجددها',
        },
        copies: 1,
        isOptional: true,
        notes: {
          fr: 'Ou déclaration de perte/vol délivrée par le commissariat si perdue',
          ar: 'أو شهادة التصريح بالضياع في حالة الضياع أو السرقة',
          darija: 'أو شهادة الضياع من الكوميسارية يلا تجلات ليك',
        },
      },
    ],
    eligibility: {
      fr: 'Tout citoyen marocain dès l’âge de 16 ans révolus (obligatoire), ou dès la naissance (facultatif).',
      ar: 'كل مواطن مغربي يبلغ 16 سنة فما فوق (إلزامية)، أو منذ الولادة بطلب الولي.',
      darija: 'أي مواطن مغربي كمل 16 عام (ضرورية)، أو قل يلا بغاو الوالدين.',
    },
    steps: [
      {
        fr: 'Prendre rendez-vous obligatoire sur le portail officiel de la DGSN : cnie.ma.',
        ar: 'حجز موعد مسبق وإلزامي عبر بوابة الأمن الوطني cnie.ma.',
        darija: 'حجز رونديفو إجباري فالسيت الرسمي ديال البوليس cnie.ma.',
      },
      {
        fr: 'Remplir le formulaire préliminaire en ligne et imprimer le récapitulatif avec l’heure du RDV.',
        ar: 'ملء الاستمارة الإلكترونية وطباعة وصل الموعد المحدد.',
        darija: 'عمر الاستمارة وطبع ورقة الرونديفو بالساعة والتاريخ.',
      },
      {
        fr: 'Se présenter au centre d’enregistrement des données d’identité (commissariat ou centre dédié) avec le dossier complet.',
        ar: 'الحضور لمركز تسجيل المعطيات التعريفية (التابل لمحل السكنى) بالملف كاملاً لأخذ البصمات والصورة.',
        darija: 'سير للكوميسارية أو المركز بالملف كامل، ياخدو ليك البصمات والتصويرة الرقمية.',
      },
      {
        fr: 'Récupérer le récépissé de dépôt et retirer la nouvelle carte sous 10 à 15 jours.',
        ar: 'أخذ وصل الإيداع وتسلم البطاقة بعد 10 إلى 15 يوماً.',
        darija: 'خد الروصي، ومن بعد 10 حتى 15 يوم سير خود لاكارط الجديدة.',
      },
    ],
    location: {
      fr: 'Centre d’enregistrement des données identitaires (Sûreté Nationale de votre district de résidence).',
      ar: 'مركز تسجيل المعطيات التعريفية التابع للأمن الوطني بمحل الإقامة.',
      darija: 'مركز تسجيل المعطيات التعريفية بالدائرة الأمنية لي ساكن فيها.',
    },
    appointmentRequired: true,
    appointmentUrl: 'https://www.cnie.ma',
    feesMAD: 75,
    officialSource: 'Direction Générale de la Sûreté Nationale (DGSN)',
    officialSourceUrl: 'https://www.cnie.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-02-01',
    tags: ['cnie', 'carte', 'identite', 'dgsn', 'police', 'لاكارط', 'بطاقة'],
  },
  {
    id: 'proc_passeport_biometrique',
    slug: 'passeport-biometrique-marocain',
    category: 'identity',
    title: {
      fr: 'Passeport Biométrique Marocain',
      ar: 'جواز السفر البيومتري المغربي',
      darija: 'الباسبور البيومتري المغربي',
    },
    description: {
      fr: 'Procédure officielle d’obtention ou renouvellement du passeport biométrique pour citoyens marocains résidents au Maroc ou à l’étranger.',
      ar: 'مسطرة الحصول على جواز السفر البيومتري أو تجديده للمواطنين المغاربة.',
      darija: 'شنو خاصك باش تصاوب باسبور جديد أو تجددو، والتنبر الإلكتروني فـ passeport.ma.',
    },
    requiredDocuments: [
      {
        id: 'doc_pass_formulaire',
        name: {
          fr: 'Formulaire de demande de passeport imprimé et signé',
          ar: 'استمارة طلب جواز السفر معبأة وموقعة عبر الموقع',
          darija: 'استمارة الباسبور مطبوعة ومسينيّة من سيت passeport.ma',
        },
        copies: 1,
        notes: {
          fr: 'Téléchargeable après saisie sur passeport.ma',
          ar: 'يتم استخراجها مباشرة من البوابة الرسمية',
          darija: 'كتعمرها فالأنترنت وتطبعها',
        },
      },
      {
        id: 'doc_pass_cnie_copy',
        name: {
          fr: 'Photocopie recto-verso de la CNIE valide',
          ar: 'نسخة من البطاقة الوطنية للتعريف الإلكترونية سارية الصلاحية',
          darija: 'فوتوكوبي ديال لاكارط ناسيونال تكون صالحة',
        },
        copies: 1,
      },
      {
        id: 'doc_pass_photos',
        name: {
          fr: 'Deux (2) photos d’identité officielles récentes pour passeport',
          ar: 'صورتان فوتوغرافيتان حديثتان وفق المعايير الدولية للجوازات',
          darija: '2 تصاور صغار بحجم 35x45 ملم مخصصين للباسبور',
        },
        copies: 2,
        notes: {
          fr: 'Format ICAO 35x45mm, fond uni gris clair, visage centré sans reflet',
          ar: 'معايير إيكاو العالمية بخلفية موحدة',
          darija: 'قول للمصور يصاوبهم ليك بمعايير الباسبور',
        },
      },
      {
        id: 'doc_pass_timbre_elec',
        name: {
          fr: 'Timbre fiscal dématérialisé (500 DH pour adultes)',
          ar: 'التمبر الإلكتروني بقيمة 500 درهم للراشدين (300 درهم للقاصرين)',
          darija: 'تمبر إلكتروني 500 درهم (أو 300 درهم للقاصرين قل من 18 عام)',
        },
        copies: 1,
        notes: {
          fr: 'Acheté par carte bancaire ou agences de paiement Cash Plus / Barid / etc.',
          ar: 'يقتنى عبر البطاقة البنكية أو نقاط القرب المعتمدة',
          darija: 'كتشريه بالكارط بنكير فالأنترنت أو من كاش بلوس وتوصل بكود 16 رقم',
        },
      },
      {
        id: 'doc_pass_ancien',
        name: {
          fr: 'Ancien passeport (si renouvellement)',
          ar: 'جواز السفر القديم (في حالة التجديد)',
          darija: 'الباسبور القديم يلا كنتي عاتجددو',
        },
        copies: 1,
        isOptional: true,
      },
    ],
    eligibility: {
      fr: 'Tout citoyen marocain sans condition d’âge.',
      ar: 'أي مواطن مغربي بدون شرط السن (بموافقة الولي الشرعي للقاصرين).',
      darija: 'أي مواطن مغربي (وللقاصرين خاص موافقة الوالي/الأب).',
    },
    steps: [
      {
        fr: 'Acheter le timbre électronique de 500 DH sur le portail ou via les agences de proximité (vous recevrez un code SMS de 16 chiffres).',
        ar: 'اقتناء التمبر الإلكتروني (500 درهم) والحصول على الرمز السري المتكون من 16 رقماً عبر SMS.',
        darija: 'شري التمبر الإلكتروني (500 درهم) وتوصل بكود الـ 16 رقم فالميساج.',
      },
      {
        fr: 'Remplir le formulaire officiel sur www.passeport.ma et associer le code du timbre électronique.',
        ar: 'تعبئة استمارة الطلب على موقع passeport.ma وربطها برقم التمبر الإلكتروني.',
        darija: 'دخل لموقع passeport.ma، عمر المعلومات ودخل كود التمبر.',
      },
      {
        fr: 'Déposer le dossier complet auprès de l’annexe administrative (Al Mouqata’a) ou caïdat de votre résidence.',
        ar: 'إيداع الملف بالملحقة الإدارية (المقاطعة أو القيادة) التابع لها مقر سكناك.',
        darija: 'دي الملف كامل للمقاطعة أو القيادة لي ساكن فالدائرة ديالها.',
      },
      {
        fr: 'Retirer votre passeport biométrique après notification SMS (délai moyen de 4 à 8 jours ouvrables).',
        ar: 'استلام الجواز بعد التوصل برسالة SMS تؤكد جهوزيته (بين 4 و 8 أيام).',
        darija: 'ملي يوصلك ميساج بلي الباسبور وجد، سير تسلمو من المقاطعة.',
      },
    ],
    location: {
      fr: 'Annexe Administrative (Al Mouqata’a) ou Caïdat de votre domicile.',
      ar: 'الملحقة الإدارية (المقاطعة) أو القيادة التابع لها محل السكنى.',
      darija: 'الملحقة الإدارية (المقاطعة) أو القيادة لي تابعة لداركم.',
    },
    appointmentRequired: false,
    appointmentUrl: 'https://www.passeport.ma',
    feesMAD: 500,
    officialSource: 'Ministère de l’Intérieur - Royaume du Maroc',
    officialSourceUrl: 'https://www.passeport.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-01-10',
    tags: ['passeport', 'voyage', 'visa', 'mouqata3a', 'interieur', 'باسبور', 'سفر'],
  },
  {
    id: 'proc_permis_conduire',
    slug: 'permis-de-conduire-categorie-b',
    category: 'transport',
    title: {
      fr: 'Permis de Conduire (Catégorie B - Véhicules Légers)',
      ar: 'رخصة السياقة من صنف (ب) - السيارات الخفيفة',
      darija: 'بيرمي د السياقة الصنف B (السيارات)',
    },
    description: {
      fr: 'Dossier et étapes officielles d’inscription auprès d’une auto-école agréée et examen théorique/pratique géré par la NARSA.',
      ar: 'إجراءات التسجيل في مدرسة تعليم السياقة واجتياز الامتحانات النظرية والتطبيقية تحت إشراف الوكالة الوطنية للسلامة الطرقية (نارسا).',
      darija: 'شنو خاصك باش دوز البيرمي د الطوموبيل B، الوراق والفيزيتة والتكلفة.',
    },
    requiredDocuments: [
      {
        id: 'doc_permis_certif_medical',
        name: {
          fr: 'Certificat médical d’aptitude physique et visuelle (-3 mois)',
          ar: 'شهادة طبية للأهلية البدنية والبصرية (أقل من 3 أشهر)',
          darija: 'الفيزيتة ديال الطبيب المعتمد د البيرمي (شوف والصحة)',
        },
        copies: 1,
        notes: {
          fr: 'Délivré par un médecin agréé par la NARSA',
          ar: 'مسلمة من طبيب معتمد لدى وكالة نارسا',
          darija: 'كتكون من طبيب معتمد عند نارسا (NARSA)',
        },
      },
      {
        id: 'doc_permis_cnie',
        name: {
          fr: 'Copie certifiée de la CNIE valide',
          ar: 'نسخة مطابقة للأصل من البطاقة الوطنية',
          darija: 'فوتوكوبي د لاكارط ناسيونال صالحة',
        },
        copies: 2,
      },
      {
        id: 'doc_permis_photos',
        name: {
          fr: 'Trois (3) photos d’identité récentes fond bleu clair',
          ar: '3 صور فوتوغرافية حديثة بخلفية زرقاء فاتحة',
          darija: '3 تصاور د البيرمي بالخلفية الزرقا الفاتحة',
        },
        copies: 3,
      },
      {
        id: 'doc_permis_quittance_frais',
        name: {
          fr: 'Quittance de paiement des droits d’examen et timbre (450 DH)',
          ar: 'توصيل أداء واجبات الامتحان ورسم التمبر (450 درهماً)',
          darija: 'خلاص واجبات الامتحان والتمبر (450 درهم للدولة)',
        },
        copies: 1,
        notes: {
          fr: 'Frais d’inscription à l’auto-école en sus selon contrat officiel',
          ar: 'إضافة لواجبات التكوين بمؤسسة تعليم السياقة',
          darija: 'زائد ثمن التكوين د الأوتو-إيكول حسب العقد',
        },
      },
    ],
    eligibility: {
      fr: 'Avoir au moins 18 ans révolus le jour du dépôt du dossier.',
      ar: 'بلوغ سن 18 سنة كاملة على الأقل يوم إيداع الملف.',
      darija: 'تكون كملتي 18 عام نيشان نهار كتدفع الملف.',
    },
    steps: [
      {
        fr: 'Passer la visite médicale chez un médecin agréé et récupérer le certificat officiel.',
        ar: 'إجراء الفحص الطبي لدى طبيب معتمد واستلام الشهادة الطبية.',
        darija: 'دوز الفحص الطبي عند طبيب معتمد وتاخد الشهادة.',
      },
      {
        fr: 'Signer le contrat de formation avec une auto-école agréée par la NARSA.',
        ar: 'توقيع عقد التكوين الرسمي مع مؤسسة معتمدة لتعليم السياقة.',
        darija: 'سيني العقد الرسمي مع أوتو-إيكول معتمدة من نارسا.',
      },
      {
        fr: 'Suivre les 20h de formation théorique sur la plateforme nationale et réussir l’examen théorique sur ordinateur (banque de 1000 questions NARSA).',
        ar: 'إتمام 20 ساعة من التكوين النظري واجتياز الامتحان النظري بالمنصة الرقمية الموحدة.',
        darija: 'كمل سوايع الكود ونجح فالامتحان النظري فالبيسي بالسيستيم الجديد.',
      },
      {
        fr: 'Suivre la formation pratique (20h) et réussir l’épreuve pratique de conduite.',
        ar: 'استكمال حصص السياقة التطبيقية والنجاح في الامتحان التطبيقي.',
        darija: 'دير السوايع التطبيقية ونجح فالامتحان ديال الكرواسة والصوغان فالطريق.',
      },
    ],
    location: {
      fr: 'Auto-école agréée et centre d’immatriculation NARSA de votre province.',
      ar: 'مؤسسة تعليم السياقة ومركز تسجيل السيارات التابع لوكالة نارسا.',
      darija: 'مدرسة تعليم السياقة ومركز تسجيل السيارات (NARSA) فإقليمك.',
    },
    appointmentRequired: true,
    feesMAD: 450,
    officialSource: 'Agence Nationale de la Sécurité Routière (NARSA)',
    officialSourceUrl: 'https://narsa.gov.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-01-20',
    tags: ['permis', 'voiture', 'narsa', 'conduire', 'transport', 'auto-ecole', 'بيرمي'],
  },
  {
    id: 'proc_attestation_scolarite',
    slug: 'attestation-scolarite-releve-notes',
    category: 'documents',
    title: {
      fr: 'Attestation de Scolarité et Relevé de Notes Officiel',
      ar: 'شهادة المتابعة الدراسية وبيان النقط الرسمي',
      darija: 'شهادة القراية (Attestation de scolarité) وكشف النقط',
    },
    description: {
      fr: 'Procédure pour demander une attestation de scolarité en cours ou un relevé de notes certifié auprès des universités et lycées au Maroc.',
      ar: 'طريقة طلب شهادة مدرسية أو جامعية وبيان كشف النقط الرسمي لأغراض المنحة، التدريب، أو التأشيرة.',
      darija: 'كيفاش تطلب شهادة القراية وبيان النقط من لافاك أو الليسي باش تدفع للمنحة أو السطاج أو الفيزا.',
    },
    requiredDocuments: [
      {
        id: 'doc_carte_etudiant_active',
        name: {
          fr: 'Carte d’étudiant de l’année universitaire en cours',
          ar: 'بطاقة الطالب للموسم الجامعي الحالي',
          darija: 'كارط ديوديون ديال هاد العام',
        },
        copies: 1,
      },
      {
        id: 'doc_recu_inscription_annee',
        name: {
          fr: 'Reçu d’inscription ou de réinscription',
          ar: 'وصل التسجيل أو إعادة التسجيل السنوي',
          darija: 'الروصي د القيد فهاد العام',
        },
        copies: 1,
      },
      {
        id: 'doc_cnie_demandeur',
        name: {
          fr: 'Copie de la Carte Nationale d’Identité (CNIE)',
          ar: 'نسخة من البطاقة الوطنية للتعريف',
          darija: 'فوتوكوبي لاكارط ناسيونال',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Étudiant ou élève régulièrement inscrit pour l’année scolaire en cours.',
      ar: 'طالب أو تلميذ مسجل بصفة نظامية خلال الموسم الجاري.',
      darija: 'طالب أو تلميذ مقيد بشكل رسمي فهاد العام الدراسي.',
    },
    steps: [
      {
        fr: 'Faire la demande via l’Espace Numérique de Travail (ENT / Apogée) de votre faculté ou au guichet du service de scolarité.',
        ar: 'تقديم الطلب عبر الفضاء الرقمي للطالب (ENT) أو مباشرة بشباك الشؤون الطلابية.',
        darija: 'دير الطلب فالسيت ENT ديال لافاك أو سير للشباك د السكولاريتي.',
      },
      {
        fr: 'Présenter votre carte d’étudiant et CNIE pour confirmation d’identité.',
        ar: 'الإدلاء ببطاقة الطالب والبطاقة الوطنية للتثبت.',
        darija: 'وري الكارط ديوديون ولاكارط ناسيونال باش يطبعوها ليك.',
      },
      {
        fr: 'Retirer le document tamponné et signé sous 24h à 48h ouvrables.',
        ar: 'تسلم الشهادة موقعة ومختومة في غضون 24 إلى 48 ساعة.',
        darija: 'كتسلمها مسينيّة ومكاشية فـ 24 حتى 48 ساعة.',
      },
    ],
    location: {
      fr: 'Service de scolarité de votre faculté ou administration du lycée.',
      ar: 'مصلحة الشؤون الطلابية بالكلية أو إدارة الثانوية.',
      darija: 'شؤون الطلاب (Scolarité) بالكلية أو إدارة المؤسسة.',
    },
    appointmentRequired: false,
    feesMAD: 0,
    officialSource: 'Règlement Intérieur des Établissements Universitaires Publics',
    officialSourceUrl: 'https://www.enssup.gov.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-02-15',
    tags: ['attestation', 'scolarite', 'notes', 'releve', 'faculte', 'etudiant', 'شهادة'],
  },
  {
    id: 'proc_legalisation_copies',
    slug: 'legalisation-signature-certification-conforme',
    category: 'administration',
    title: {
      fr: 'Légalisation de Signature et Certification Conforme (Al Mouqata’a)',
      ar: 'تصحيح الإمضاء والإشهاد بمطابقة النسخ لأصولها (المقاطعة)',
      darija: 'إيزاليزاسيون فالمقاطعة (تصحيح الإمضاء والنسخ المطابقة)',
    },
    description: {
      fr: 'Règles actualisées de la Loi 55-19 sur la simplification administrative au Maroc pour la légalisation et suppression de copies conformes injustifiées.',
      ar: 'المقتضيات المحينة للقانون 55-19 لتبسيط الإجراءات والمساطر الإدارية وتصحيح الإمضاء ومطابقة النسخ.',
      darija: 'شنو التغييرات الجديدة د القانون 55-19 فالمقاطعة، وشنو الإجراءات باش تسيني شي وثيقة رسمية.',
    },
    requiredDocuments: [
      {
        id: 'doc_legal_original',
        name: {
          fr: 'Document original à signer ou document original dont on veut certifier la copie',
          ar: 'الوثيقة الأصلية المراد توقيعها أو مطابقة نسخها',
          darija: 'الوثيقة الأصلية لي باغي تسينيها قدام الموظف أو تكوبيها',
        },
        copies: 1,
        notes: {
          fr: 'Ne pas signer à l’avance : signature impérative devant l’officier',
          ar: 'يمنع التوقيع المسبق: يوقع بحضور ضابط الحالة المدنية أو الموظف المفوض',
          darija: 'ماتسينيش فالدار: خاصك تسيني قدام الموظف فالمقاطعة',
        },
      },
      {
        id: 'doc_legal_cnie',
        name: {
          fr: 'Carte d’Identité Nationale Électronique (CNIE) originale en cours de validité',
          ar: 'البطاقة الوطنية للتعريف الإلكترونية الأصلية سارية الصلاحية',
          darija: 'لاكارط ناسيونال الأصلية وتكون صالحة',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Toute personne physique capable signataire du document.',
      ar: 'كل شخص ذاتي مؤهل قانونياً لتوقيع الالتزام أو العقد.',
      darija: 'أي مواطن قادر قانونياً يوقع على الالتزام أو الوثيقة.',
    },
    steps: [
      {
        fr: 'Rappel Loi 55-19 : Les administrations publiques ne peuvent plus exiger la légalisation pour les dossiers où elle n’est pas expressément prévue par la loi (Idarati.ma).',
        ar: 'تذكير بالقانون 55-19: لا يحق للإدارات العمومية فرض تصحيح الإمضاء إلا في الحالات المنصوص عليها قانوناً.',
        darija: 'تذكير بالقانون 55-19: الإدارات مبقاتش تقدر تطلب ليك إيزاليزي فالوراق العادية إلا يلا كان قانون صريح.',
      },
      {
        fr: 'Se présenter à n’importe quelle annexe administrative (Al Mouqata’a) au Maroc sans condition de rattachement géographique.',
        ar: 'التوجه إلى أي ملحقة إدارية (مقاطعة) بالمغرب بغض النظر عن مقر السكنى (تم إلغاء القيد الجغرافي).',
        darija: 'سير لأي مقاطعة فالمغرب بغيتي، مبقاش مشكل تسكن فبلاصة وتمشي لمدينة أخرى.',
      },
      {
        fr: 'Signer en direct devant l’agent communal après vérification de votre identité.',
        ar: 'التوقيع المباشر أمام الموظف المختص بعد التحقق من الهوية.',
        darija: 'سيني نيشان قدام الموظف ملي يتأكد من لاكارط ديالك.',
      },
      {
        fr: 'Payer le timbre d’état civil (2 DH par signature) et enregistrement au registre dématérialisé.',
        ar: 'أداء الرسم الجبائي (درهمان لكل توقيع) والتسجيل في السجل الرقمي.',
        darija: 'خلص درهمين (2 دراهم) على كل سينياتور وتاخد الورقة مكاشية.',
      },
    ],
    location: {
      fr: 'Toutes les annexes administratives (Mouqata’at) ou bureaux communaux au Maroc.',
      ar: 'جميع الملحقات الإدارية (المقاطعات) أو مكاتب الجماعات الترابية بالمغرب.',
      darija: 'أي مقاطعة إدارية أو جماعة فالمغرب كامل.',
    },
    appointmentRequired: false,
    feesMAD: 2,
    officialSource: 'Portail National des Procédures et Formalités Administratives (Idarati)',
    officialSourceUrl: 'https://www.idarati.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-01-05',
    tags: ['mouqata3a', 'legalisation', 'idarati', 'loi5519', 'signature', 'مقاطعة', 'ايغاليزاسيون'],
  },
  {
    id: 'proc_ofppt_inscription',
    slug: 'inscription-formation-professionnelle-ofppt',
    category: 'education',
    title: {
      fr: 'Inscription en Formation Professionnelle (OFPPT / ISTA / ITA)',
      ar: 'التسجيل في التكوين المهني (مكتب التكوين المهني وإنعاش الشغل OFPPT)',
      darija: 'التسجيل فالسطاج ولا فورماسيون فـ OFPPT / ISTA',
    },
    description: {
      fr: 'Guide officiel pour postuler aux filières Technicien Spécialisé (TS), Technicien (T), Qualification (Q) et Spécialisation dans les instituts de l’OFPPT.',
      ar: 'دليل التسجيل في التكوين المهني لأسلاك التقني المتخصص والتقني والتأهيل عبر المنصة الموحدة takwine.ofppt.ma.',
      darija: 'كيفاش تقيد فالتكوين المهني لوفبيبيطي، الشروط والشعب لي كاينين والوثائق.',
    },
    requiredDocuments: [
      {
        id: 'doc_ofppt_dossier_web',
        name: {
          fr: 'Formulaire de préinscription imprimé depuis takwine.ofppt.ma',
          ar: 'استمارة التسجيل القبلي مطبوعة من الموقع الرسمي',
          darija: 'استمارة التسجيل مطبوعة من سيت takwine.ofppt.ma',
        },
        copies: 1,
      },
      {
        id: 'doc_ofppt_bac_ou_certif',
        name: {
          fr: 'Copie certifiée conforme du Baccalauréat (ou certificat de scolarité de 2ème année Bac)',
          ar: 'نسخة مصادق عليها من البكالوريا (أو شهادة مدرسية لمستوى البكالوريا بالنسبة لسلك التقني)',
          darija: 'فوتوكوبي مصادق عليها ديال الباك (أو شهادة القراية د النيفو باك)',
        },
        copies: 2,
      },
      {
        id: 'doc_ofppt_releve_notes',
        name: {
          fr: 'Relevé de notes officiel du Baccalauréat',
          ar: 'بيان النقط الرسمي للبكالوريا (الامتحان الوطني والجهوي)',
          darija: 'كشف النقط ديال الباك (الوطني والجهوي)',
        },
        copies: 1,
      },
      {
        id: 'doc_ofppt_cnie',
        name: {
          fr: 'Copie de la Carte Nationale (CNIE)',
          ar: 'نسخة من البطاقة الوطنية للتعريف الإلكترونية',
          darija: 'فوتوكوبي ديال لاكارط ناسيونال',
        },
        copies: 2,
      },
      {
        id: 'doc_ofppt_photos',
        name: {
          fr: 'Deux (2) photos d’identité récentes',
          ar: 'صورتان شمسيتان حديثتان للمترشح',
          darija: '2 تصاور صغار بحجم رسمي',
        },
        copies: 2,
      },
      {
        id: 'doc_ofppt_frais_dossier',
        name: {
          fr: 'Frais de dossier de candidature (50 DH)',
          ar: 'واجبات دراسة الملف واختبار الانتقاء (50 درهماً)',
          darija: 'مصاريف الملف (50 درهم تؤدى عبر القنوات المعتمدة)',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Niveau Technicien Spécialisé : titulaire du Baccalauréat. Niveau Technicien : niveau 2ème année Bac achevée. Âge maximal généralement 30 ans.',
      ar: 'سلك التقني المتخصص: حاملو شهادة البكالوريا. سلك التقني: مستوى الثانية باك كاملة. السن الأقصى عموماً 30 سنة.',
      darija: 'تقني متخصص (TS): خاص يكون عندك الباك. تقني (T): خاص تكون كملتي القراية د التانية باك. العمر قل من 30 عام.',
    },
    steps: [
      {
        fr: 'Créer un compte et sélectionner 3 filières par ordre de préférence sur takwine.ofppt.ma.',
        ar: 'إنشاء حساب واختيار 3 شعب حسب الأفضلية عبر موقع takwine.ofppt.ma.',
        darija: 'دير كونط فالسيت وعزل 3 ديال الشعب لي عجبوك بالترتيب.',
      },
      {
        fr: 'Payer les frais de dossier de 50 DH en ligne ou auprès d’un point de proximité.',
        ar: 'أداء 50 درهماً لواجبات الملف عبر الإنترنت أو وكالات الأداء.',
        darija: 'خلص 50 درهم فالسيت أو من شي وكالة أداء.',
      },
      {
        fr: 'Déposer le dossier papier dans l’institut OFPPT de votre premier choix.',
        ar: 'إيداع الملف الورقي بالمعهد الذي اخترته كرغبة أولى.',
        darija: 'دي الدوسي الورقي لـ ISTA أو المعهد لي درتيه رقم 1.',
      },
      {
        fr: 'Consulter les listes des admis selon le classement par note du Bac.',
        ar: 'متابعة نتائج الانتقاء حسب لوائح الترتيب ومعدلات البكالوريا.',
        darija: 'بقى تبع النتايج ولوائح الانتظار والمقبولين حسب نقطة الباك.',
      },
    ],
    location: {
      fr: 'Institut Spécialisé de Technologie Appliquée (ISTA) ou Institut de Technologie Appliquée (ITA).',
      ar: 'المعهد المتخصص للتكنولوجيا التطبيقية (ISTA) المعني بترشيحك.',
      darija: 'المعهد المتخصص للتكنولوجيا التطبيقية (ISTA) لي دفعتي ليه.',
    },
    appointmentRequired: false,
    feesMAD: 50,
    deadline: {
      fr: 'Période de mai à fin juillet pour la première session.',
      ar: 'من شهر ماي إلى متم شهر يوليوز للمرحلة الرئيسية الأولى.',
      darija: 'من شهر 5 حتى اللخر د شهر 7 فالمرحلة اللولى.',
    },
    officialSource: 'Office de la Formation Professionnelle et de la Promotion du Travail (OFPPT)',
    officialSourceUrl: 'https://www.ofppt.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-04-12',
    tags: ['ofppt', 'ista', 'formation', 'stage', 'technicien', 'metier', 'تكوين'],
  },
  {
    id: 'proc_amo_tadamon',
    slug: 'amo-tadamon-assurance-maladie-cnss',
    category: 'administration',
    title: {
      fr: 'Assurance Maladie Obligatoire (AMO Tadamon / Ex-RAMED)',
      ar: 'نظام التأمين الإجباري الأساسي عن المرض (AMO تضامن / راميد سابقاً)',
      darija: 'لامو تضامن (AMO Tadamon) والتغطية الصحية فـ CNSS',
    },
    description: {
      fr: 'Régime d’assurance maladie pris en charge par l’État pour les personnes incapables d’assumer les cotisations selon le Registre Social Unifié (RSU).',
      ar: 'نظام التغطية الصحية المجاني الذي تتحمل الدولة اشتراكاته لفائدة الأسر المستحقة طبقاً لتنقيط السجل الاجتماعي الموحد.',
      darija: 'كيفاش تستافد من التغطية الصحية فابور لي كتخلصها الدولة على الناس لي مقيدين فالسجل الموحد RSU.',
    },
    requiredDocuments: [
      {
        id: 'doc_amo_rsu_score',
        name: {
          fr: 'Attestation de score RSU inférieur au seuil réglementaire (actuellement < 9.326)',
          ar: 'شهادة تثبت الحصول على تنقيط بالسجل الاجتماعي الموحد يقل عن العتبة (أقل من 9.326)',
          darija: 'تنقيط فالسجل الاجتماعي الموحد قل من العتبة المحددة (9.32)',
        },
        copies: 1,
      },
      {
        id: 'doc_amo_cnie_famille',
        name: {
          fr: 'Copies des CNIE de tous les membres majeurs du foyer',
          ar: 'نسخ من البطاقات الوطنية لجميع أفراد الأسرة البالغين',
          darija: 'فوتوكوبي لاكارط ناسيونال ديال أفراد العائلة البالغين',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Foyer marocain enregistré au RSU dont le score socio-économique est inférieur ou égal au seuil fixé par décret gouvernemental, ne bénéficiant d’aucun autre régime obligatoire.',
      ar: 'الأسرة المسجلة في السجل الاجتماعي الموحد RSU والتي يقل مؤشرها عن العتبة، ولا تتوفر على تغطية صحية أخرى.',
      darija: 'تكون الأسرة مقيدة فـ RSU والمؤشر قل من العتبة، وميكون عندكم حتى نظام تغطية بحال كنوبس أو الضمان الاجتماعي د الخدمة.',
    },
    steps: [
      {
        fr: 'S’inscrire au Registre National de la Population (RNP) pour chaque membre puis au Registre Social Unifié (RSU) sur rsu.ma.',
        ar: 'التسجيل أولاً بالسجل الوطني للسكان RNP ثم السجل الاجتماعي الموحد RSU.',
        darija: 'تسجل فالـ RNP ومن بعد فالسجل الموحد RSU فالملحقة الإدارية أو عبر السيت.',
      },
      {
        fr: 'Si votre score est en dessous du seuil éligible, le basculement vers AMO Tadamon s’effectue automatiquement auprès de la CNSS.',
        ar: 'في حالة الحصول على تنقيط أقل من العتبة، يتم التسجيل تلقائياً في مصالح الصندوق الوطني للضمان الاجتماعي CNSS.',
        darija: 'يلا كانت النقطة قل من العتبة، كتحول أوتوماتيك لـ CNSS بلا ما تبدل مجهود كبير.',
      },
      {
        fr: 'Vérifier vos droits et télécharger votre attestation d’immatriculation sur le portail macnss.ma.',
        ar: 'التحقق من رقم التسجيل وتحميل شهادة الحقوق عبر بوابة macnss.ma أو تطبيق الهاتف.',
        darija: 'تأكد من حقوقك فالأبليكاسيون ديال macnss.ma أو من موقع الضمان الاجتماعي.',
      },
    ],
    location: {
      fr: 'Portail www.macnss.ma ou agences CNSS / bureaux de proximité.',
      ar: 'بوابة www.macnss.ma أو وكالات الضمان الاجتماعي ومكاتب القرب.',
      darija: 'وكالات CNSS أو موقع macnss.ma أو وكالات القرب (كاش بلوس، تسهيلات).',
    },
    appointmentRequired: false,
    feesMAD: 0,
    officialSource: 'Caisse Nationale de Sécurité Sociale (CNSS) & Ministère de la Santé',
    officialSourceUrl: 'https://www.macnss.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-03-01',
    tags: ['amo', 'sante', 'cnss', 'tadamon', 'hopital', 'rsu', 'تغطية', 'صحة'],
  },
  {
    id: 'proc_logement_onousc',
    slug: 'logement-cite-universitaire-onousc',
    category: 'housing',
    title: {
      fr: 'Logement en Cité Universitaire (ONOUSC)',
      ar: 'السكن بالأحياء الجامعية العمومية (أونوسك ONOUSC)',
      darija: 'السكن فالحي الجامعي (لاسيطي لافاك ONOUSC)',
    },
    description: {
      fr: 'Procédure annuelle de candidature pour l’attribution d’une chambre en cité universitaire pour étudiants marocains des facultés publiques.',
      ar: 'إجراءات طلب الاستفادة من السكن الجامعي بالأحياء الجامعية التابعة للمكتب الوطني للأعمال الجامعية والاجتماعية والثقافية.',
      darija: 'كيفاش تدفع باش تاخد بيت فالحي الجامعي (لاسيطي) والشروط والوثائق المطلوبة.',
    },
    requiredDocuments: [
      {
        id: 'doc_cite_demande_web',
        name: {
          fr: 'Reçu de candidature en ligne imprimé depuis logement.onousc.ma',
          ar: 'وصل طلب السكن الإلكتروني مطبوع من منصة أونوسك',
          darija: 'وصل طلب السكن مطبوع من السيت logement.onousc.ma',
        },
        copies: 1,
      },
      {
        id: 'doc_cite_cnie_etudiant',
        name: {
          fr: 'Copie de la CNIE de l’étudiant et des parents',
          ar: 'نسخة من البطاقة الوطنية للطالب والأبوين',
          darija: 'فوتوكوبي لاكارط ناسيونال ديالك وديال الوالدين',
        },
        copies: 1,
      },
      {
        id: 'doc_cite_revenu_parents',
        name: {
          fr: 'Attestation de revenu global des parents délivrée par la DGI (Direction Générale des Impôts)',
          ar: 'شهادة الدخل الإجمالي السنوي للأبوين مسلمة من إدارة الضرائب',
          darija: 'شهادة الدخل السنوي للوالدين من مصلحة الضرائب (الدار البيضاء/الرباط/إلخ)',
        },
        copies: 1,
      },
      {
        id: 'doc_cite_certif_inscription',
        name: {
          fr: 'Attestation d’inscription universitaire de l’année en cours',
          ar: 'شهادة التسجيل الجامعي برسم الموسم الحالي',
          darija: 'شهادة التسجيل ف لافاك لهاد العام',
        },
        copies: 1,
      },
      {
        id: 'doc_cite_photos',
        name: {
          fr: 'Quatre (4) photos d’identité récentes',
          ar: '4 صور فوتوغرافية حديثة',
          darija: '4 تصاور صغار',
        },
        copies: 4,
      },
    ],
    eligibility: {
      fr: 'Étudiants inscrits dans un établissement universitaire public, dont les parents résident en dehors du périmètre de l’université.',
      ar: 'الطلبة المسجلون بالمؤسسات الجامعية العمومية الذين يقطن أولياؤهم خارج المدار الحضري للمدينة الجامعية.',
      darija: 'تكون طالب ف لافاك عمومية والوالدين ساكنين فمدينة أخرى بعيدة على الجامعة.',
    },
    steps: [
      {
        fr: 'Déposer la candidature numérique sur logement.onousc.ma durant le mois d’août/septembre.',
        ar: 'تقديم الترشيح الإلكتروني عبر منصة logement.onousc.ma خلال شهري غشت وشتنبر.',
        darija: 'عمر الطلب فالسيت د لوسيت logement.onousc.ma فشهر 8 و 9.',
      },
      {
        fr: 'Télécharger et imprimer le récépissé comportant le numéro de dossier.',
        ar: 'تحميل وطباعة وصل إيداع الترشيح المتضمن لرقم الملف.',
        darija: 'طبع وصل الطلب لي فيه نمرة الدوسي.',
      },
      {
        fr: 'Consulter les listes des bénéficiaires affichées selon les critères de distance et de revenu social.',
        ar: 'الاطلاع على لوائح المستفيدين المعلنة بناء على معايير بعد المسافة والدخل الأسري.',
        darija: 'شوف واش تقبلتي فاللوائح لي كيعلقو حسب البعد ودخل الأسرة.',
      },
      {
        fr: 'Déposer le dossier physique original et payer les droits de logement (environ 40 à 100 DH par mois selon la cité).',
        ar: 'إيداع الملف المادي وأداء واجبات السكن الرمزية.',
        darija: 'دي الدوسي وخلص واجب السكن الرمزي وتسلم الساروت د البيت.',
      },
    ],
    location: {
      fr: 'Cité Universitaire publique de votre ville universitaire.',
      ar: 'الحي الجامعي العمومي التابع لجامعتك.',
      darija: 'الحي الجامعي (Cité universitaire) فمدينتك الجامعية.',
    },
    appointmentRequired: false,
    feesMAD: 50,
    deadline: {
      fr: 'Fin septembre de chaque année universitaire.',
      ar: 'متم شهر شتنبر من كل سنة جامعية.',
      darija: 'أواخر شهر شتنبر فكل عام.',
    },
    officialSource: 'Office National des Œuvres Universitaires, Sociales et Culturelles (ONOUSC)',
    officialSourceUrl: 'https://logement.onousc.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-08-15',
    tags: ['logement', 'cite', 'onousc', 'chambre', 'etudiant', 'حي جامعي', 'سكن'],
  },
  {
    id: 'proc_retrait_diplome',
    slug: 'retrait-definitif-diplome-universitaire',
    category: 'documents',
    title: {
      fr: 'Retrait Définitif du Diplôme Universitaire Original',
      ar: 'السحب النهائي للشهادة الجامعية الأصلية ودبلوم التخرج',
      darija: 'سحب الدبلوم الأصلي من الجامعة (الكرطونة)',
    },
    description: {
      fr: 'Procédure pour récupérer votre diplôme définitif (Licence, Master, Ingénieur, Doctorat) et votre Baccalauréat original conservé lors de l’inscription.',
      ar: 'إجراءات تسلم الدبلوم النهائي الأصلي واسترجاع شهادة البكالوريا الأصلية بعد استيفاء سنوات التخرج وإبراء الذمة.',
      darija: 'كيفاش تاخد الدبلوم النهائي ديالك وتسترجع شهادة الباك الأصلية من الجامعة.',
    },
    requiredDocuments: [
      {
        id: 'doc_retrait_attestation_reussite',
        name: {
          fr: 'Attestation originale de réussite provisoire',
          ar: 'شهادة النجاح المؤقتة الأصلية المسلمة سابقاً',
          darija: 'شهادة النجاح المؤقتة (Attestation de réussite) الأصلية',
        },
        copies: 1,
        notes: {
          fr: 'Doit être restituée à la scolarité',
          ar: 'يتم إرجاعها وجوباً لمصلحة الشؤون الطلابية',
          darija: 'خاصك ترجعها ليهم باش تاخد الدبلوم الأصلي فبلاصتها',
        },
      },
      {
        id: 'doc_retrait_quitus',
        name: {
          fr: 'Quitus de la bibliothèque universitaire (attestation de non-redevabilité de livres)',
          ar: 'شهادة براءة الذمة من خزانة الكلية (إرجاع الكتب المعارة)',
          darija: 'شهادة البراءة (الكيتوس) من الخزانة د لافاك بلي ما كيتسالوك تا كتاب',
        },
        copies: 1,
        notes: {
          fr: 'Délivrée par le conservateur de la bibliothèque de la faculté',
          ar: 'تسلم من مسؤول مكتبة الكلية',
          darija: 'كتصاوبها من المكتبة د الكلية فـ 5 دقايق',
        },
      },
      {
        id: 'doc_retrait_cnie',
        name: {
          fr: 'Carte d’Identité Nationale Électronique (CNIE) originale',
          ar: 'البطاقة الوطنية للتعريف الإلكترونية الأصلية',
          darija: 'لاكارط ناسيونال الأصلية ديالك',
        },
        copies: 1,
      },
      {
        id: 'doc_retrait_carte_etudiant',
        name: {
          fr: 'Carte d’étudiant originale (à restituer)',
          ar: 'بطاقة الطالب الأصلية (يتم إرجاعها)',
          darija: 'الكارط ديوديون الأصلية كترجعها ليهم',
        },
        copies: 1,
      },
    ],
    eligibility: {
      fr: 'Lauréat ayant validé l’ensemble des modules de sa filière et dont le diplôme est édité par la Présidence de l’Université.',
      ar: 'الخريج الذي استوفى جميع الوحدات والوحدات النمطية وصدر دبلومه رسمياً من رئاسة الجامعة.',
      darija: 'الخريج لي فاليدا الموديلات كاملين والدبلوم ديالو تطبع من رئاسة الجامعة.',
    },
    steps: [
      {
        fr: 'Vérifier la disponibilité de votre diplôme sur le site ou par affichage au décanat de la faculté.',
        ar: 'التأكد من جهوزية الدبلوم عبر إعلان الكلية أو فضاء الخريجين.',
        darija: 'تأكد بلي الدبلومات تطبعو ووجدو فالموقع د لافاك.',
      },
      {
        fr: 'Obtenir le quitus de la bibliothèque universitaire prouvant l’absence d’emprunts en cours.',
        ar: 'الحصول على شهادة إبراء الذمة (Quitus) من مكتبة المؤسسة.',
        darija: 'جيب شهادة البراءة (Quitus) من البيبليوتيك د لافاك.',
      },
      {
        fr: 'Se présenter personnellement avec la CNIE et l’attestation de réussite provisoire au service des diplômes.',
        ar: 'الحضور شخصياً مصحوباً بالبطاقة الوطنية وشهادة النجاح المؤقتة لمصلحة الشواهد.',
        darija: 'سير شخصياً بلاكارط ناسيونال وشهادة النجاح المؤقتة للشؤون الطلابية.',
      },
      {
        fr: 'Signer le registre de décharge et récupérer votre diplôme officiel ainsi que votre Baccalauréat original.',
        ar: 'توقيع سجل الاستلام وتسلم الدبلوم الرسمي وشهادة البكالوريا الأصلية.',
        darija: 'سيني فرجستر الاستلام وها نتا خديتي الدبلوم والباك ديالك.',
      },
    ],
    location: {
      fr: 'Service des diplômes de votre faculté ou Présidence de l’Université.',
      ar: 'مصلحة الشواهد بالكلية أو رئاسة الجامعة.',
      darija: 'مصلحة الشواهد بالكلية فمدينتك.',
    },
    appointmentRequired: false,
    feesMAD: 0,
    officialSource: 'Présidence de l’Université et Décanat de la Faculté',
    officialSourceUrl: 'https://www.enssup.gov.ma',
    verificationStatus: 'unverified',
    lastVerifiedDate: '2026-03-20',
    tags: ['diplome', 'bac', 'retrait', 'laureat', 'faculte', 'quitus', 'دبلوم'],
  },
];

// Multilingual Text Normalizer for Arabic, Darija, Arabizi, and French
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Strip Arabic diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize Alefs
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Normalize Yaa / Alef Maqsura
    .replace(/ى/g, 'ي')
    // Normalize common Arabizi numerals in Moroccan queries
    .replace(/3/g, 'ع')
    .replace(/7/g, 'ح')
    .replace(/9/g, 'ق')
    .replace(/5/g, 'خ')
    // Normalize French accents
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove punctuation
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟?،]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Scored search helper for procedures
export function searchProcedures(query: string, category?: string): Procedure[] {
  let filtered = PROCEDURES_DATA;
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (!query || query.trim() === '') {
    return filtered;
  }

  const normalizedQuery = normalizeText(query);
  const queryTokens = normalizedQuery.split(' ').filter((t) => t.length > 1);

  if (queryTokens.length === 0) {
    return filtered;
  }

  const scored = filtered.map((p) => {
    let score = 0;
    const titleNorm = normalizeText(`${p.title.fr} ${p.title.ar} ${p.title.darija}`);
    const descNorm = normalizeText(`${p.description.fr} ${p.description.ar} ${p.description.darija}`);
    const tagsNorm = p.tags.map((t) => normalizeText(t));

    // Title direct match
    if (titleNorm.includes(normalizedQuery)) {
      score += 60;
    }

    // Token matching
    for (const token of queryTokens) {
      if (titleNorm.includes(token)) {
        score += 25;
      }
      if (tagsNorm.some((tag) => tag.includes(token))) {
        score += 20;
      }
      if (descNorm.includes(token)) {
        score += 8;
      }
    }

    return { procedure: p, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.procedure);
}

