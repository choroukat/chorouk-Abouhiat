import { jsPDF } from 'jspdf';
import { GeneratedDemande, UserChecklist } from '../types';

function stripEmojis(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]/gu, '')
    .trim();
}

function hasArabicCharacters(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);
}

// Render Arabic or mixed text block onto an offscreen canvas for crisp, ligature-safe rendering in jsPDF
function renderArabicBlockToImage(
  text: string,
  widthPx = 1000,
  fontSizePx = 24
): { dataUrl: string; widthMm: number; heightMm: number } {
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { dataUrl: '', widthMm: 0, heightMm: 0 };
  }

  ctx.font = `${fontSizePx}px 'Cairo', 'Tajawal', 'Segoe UI', Tahoma, sans-serif`;
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';

  const lines: string[] = [];
  const rawParagraphs = text.split('\n');

  const maxLineWidth = widthPx - 40;

  for (const para of rawParagraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  const lineHeight = fontSizePx * 1.6;
  const totalHeight = Math.max(120, lines.length * lineHeight + 60);
  canvas.height = totalHeight;

  // Re-apply context font after resize
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${fontSizePx}px 'Cairo', 'Tajawal', 'Segoe UI', Tahoma, sans-serif`;
  ctx.fillStyle = '#1e293b';
  ctx.direction = 'rtl';
  ctx.textAlign = 'right';

  let y = lineHeight + 20;
  for (const line of lines) {
    if (line) {
      ctx.fillText(line, widthPx - 20, y);
    }
    y += lineHeight;
  }

  const widthMm = 170; // Printable width on A4 page
  const heightMm = (totalHeight / widthPx) * widthMm;

  return {
    dataUrl: canvas.toDataURL('image/png'),
    widthMm,
    heightMm,
  };
}

export function exportDemandeToPDF(demande: GeneratedDemande) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header Moroccan Emerald Green & Crimson Red accent bars
  doc.setFillColor(0, 98, 51);
  doc.rect(margin, 15, 60, 3, 'F');
  doc.setFillColor(193, 39, 45);
  doc.rect(margin + 62, 15, 30, 3, 'F');

  // Title: Strict non-official statement (No "ROYAUME DU MAROC", No "Document officiel")
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(24, 30, 42);
  doc.text('Wach Nqder? — Modele de Demande Personnelle', margin, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Document d’aide prive a la redaction (Non officiel) • wach-nqder.ma', margin, 32);

  // Line separator
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, 38, pageWidth - margin, 38);

  const isArabicContent = hasArabicCharacters(demande.content) || demande.language === 'ar';

  if (isArabicContent) {
    // For Arabic letters, render using high-definition ligature-safe canvas image
    const fullArabicText = `
المعني بالأمر: ${demande.fullName}
رقم البطاقة الوطنية: ${demande.cinNumber}
${demande.cneOrMassar ? `رمز مسار: ${demande.cneOrMassar}` : ''}
الهاتف: ${demande.phone} | البريد: ${demande.email}
الجهة المعنية: ${demande.universityOrCompany}
المدينة: ${demande.city}

الموضوع: ${demande.title}

${demande.content}

التوقيع:
${demande.fullName}
`.trim();

    const arabicImage = renderArabicBlockToImage(stripEmojis(fullArabicText), 1200, 26);
    if (arabicImage.dataUrl) {
      doc.addImage(arabicImage.dataUrl, 'PNG', margin, 44, arabicImage.widthMm, Math.min(arabicImage.heightMm, pageHeight - 65));
    }
  } else {
    // Standard French letter formatting
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('Demandeur :', margin, 46);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Nom : ${stripEmojis(demande.fullName)}`, margin, 52);
    doc.text(`CNIE : ${stripEmojis(demande.cinNumber)}`, margin, 57);
    if (demande.cneOrMassar) {
      doc.text(`CNE / Massar : ${stripEmojis(demande.cneOrMassar)}`, margin, 62);
    }
    doc.text(`Tel : ${stripEmojis(demande.phone)}`, margin, demande.cneOrMassar ? 67 : 62);
    doc.text(`Email : ${stripEmojis(demande.email)}`, margin, demande.cneOrMassar ? 72 : 67);

    // Recipient Box
    const recipientY = 46;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(pageWidth / 2, recipientY, contentWidth / 2, 28, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text('Destinataire :', pageWidth / 2 + 5, recipientY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(stripEmojis(demande.recipientTitle || "Monsieur le Responsable d'Établissement"), pageWidth / 2 + 5, recipientY + 14);
    doc.text(stripEmojis(demande.universityOrCompany || 'Établissement d’accueil'), pageWidth / 2 + 5, recipientY + 20);

    // Subject title
    const bodyStartY = 85;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, bodyStartY, contentWidth, 12, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(2, 44, 34);
    doc.text(`OBJET : ${stripEmojis(demande.title).toUpperCase()}`, margin + 5, bodyStartY + 8);

    // Content body
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);

    const splitText = doc.splitTextToSize(stripEmojis(demande.content), contentWidth);
    doc.text(splitText, margin, bodyStartY + 22);

    const signatureY = pageHeight - 45;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Fait a ${stripEmojis(demande.city || 'Maroc')}, le ${new Date(demande.createdAt).toLocaleDateString('fr-FR')}`, pageWidth - margin - 70, signatureY);
    doc.text('Signature du demandeur :', pageWidth - margin - 70, signatureY + 8);
  }

  // Footer Disclaimer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Wach Nqder? — Modele a usage personnel. Non affilie a un organisme gouvernemental.', margin, pageHeight - 12);

  const cleanFilename = stripEmojis(demande.fullName || 'Demande').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`${demande.type}_${cleanFilename}.pdf`);
}

export function exportChecklistToPDF(checklist: UserChecklist) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Header Moroccan Emerald Green & Crimson Red accent bars
  doc.setFillColor(0, 98, 51);
  doc.rect(margin, 15, 60, 3, 'F');
  doc.setFillColor(193, 39, 45);
  doc.rect(margin + 62, 15, 30, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('CHECKLIST PERSONNELLE DES PIECES', margin, 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Procedure : ${stripEmojis(checklist.title)}`, margin, 33);

  const completedCount = checklist.items.filter((i) => i.isCompleted).length;
  const totalCount = checklist.items.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Progress summary card
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, 40, contentWidth, 20, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(22, 101, 52);
  doc.text(`Etat d'avancement : ${completedCount} sur ${totalCount} documents prets (${percent}%)`, margin + 6, 49);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Genere le : ${new Date().toLocaleDateString('fr-FR')} • Wach Nqder? (Non officiel)`, margin + 6, 55);

  let currentY = 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Pieces a preparer :', margin, currentY);

  currentY += 10;

  checklist.items.forEach((item, index) => {
    doc.setDrawColor(item.isCompleted ? 22 : 148, item.isCompleted ? 101 : 163, item.isCompleted ? 52 : 184);
    doc.setFillColor(item.isCompleted ? 220 : 255, item.isCompleted ? 252 : 255, item.isCompleted ? 231 : 255);
    doc.rect(margin, currentY - 4, 5, 5, 'FD');

    if (item.isCompleted) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(22, 101, 52);
      doc.text('X', margin + 1.2, currentY);
    }

    doc.setFont('helvetica', item.isCompleted ? 'bold' : 'normal');
    doc.setFontSize(10);
    doc.setTextColor(item.isCompleted ? 15 : 71, item.isCompleted ? 23 : 85, item.isCompleted ? 42 : 105);
    doc.text(`${index + 1}. ${stripEmojis(item.name)}`, margin + 9, currentY);

    if (item.copiesRequired && item.copiesRequired > 1) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${item.copiesRequired} copies necessaires]`, margin + 9, currentY + 5);
      currentY += 11;
    } else {
      currentY += 8;
    }
  });

  currentY += 8;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9);
  doc.text('Avertissement : Informations indicatives. Verifiez toujours la derniere annonce officielle.', margin, currentY);

  const cleanTitle = stripEmojis(checklist.title || 'Checklist').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Checklist_${cleanTitle}.pdf`);
}
