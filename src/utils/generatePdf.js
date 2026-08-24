/**
 * PDF Generation Utility using html2pdf.js
 * Renders any DOM element by ID into a high-quality A4 PDF document.
 */
export async function downloadPdfFromElement(elementId, filename = 'document.pdf') {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element #${elementId} not found for PDF generation`)
    window.print()
    return
  }

  try {
    const html2pdf = (await import('html2pdf.js')).default
    const opt = {
      margin: [10, 10, 10, 10], // mm
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    }

    await html2pdf().set(opt).from(element).save()
  } catch (err) {
    console.warn('html2pdf generation failed, falling back to window.print():', err)
    window.print()
  }
}
