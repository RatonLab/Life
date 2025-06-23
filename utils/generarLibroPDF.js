import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { shareAsync } from 'expo-sharing';

export async function generarLibroPDF({ titulo, autor, contenido, dedicatoria, pensamientoFinal }) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const margin = 40;
    let y = height - margin;

    // Título
    page.drawText(titulo || 'Mi vida en palabras', {
      x: margin,
      y,
      size: 20,
      font,
      color: rgb(0, 0, 0.8),
    });
    y -= 30;

    // Autor
    if (autor) {
      page.drawText(`Autor: ${autor}`, {
        x: margin,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
      y -= 20;
    }

    // Dedicatoria
    if (dedicatoria) {
      page.drawText(`Dedicatoria: ${dedicatoria}`, {
        x: margin,
        y,
        size: 12,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      y -= 40;
    }

    // Contenido principal
    const contenidoFormateado = contenido || 'Aquí va la historia de vida...';
    const lines = font.splitTextIntoLines(contenidoFormateado, 80);
    for (let line of lines) {
      if (y < 60) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      page.drawText(line, { x: margin, y, size: 11, font, color: rgb(0, 0, 0) });
      y -= 15;
    }

    // Pensamiento final
    if (pensamientoFinal) {
      y -= 40;
      page.drawText(`"${pensamientoFinal}"`, {
        x: margin,
        y,
        size: 13,
        font,
        color: rgb(0.1, 0.1, 0.6),
      });
    }

    // Guardar archivo
    const pdfBytes = await pdfDoc.save();
    const filePath = `${FileSystem.documentDirectory}MiLibro.pdf`;
    await FileSystem.writeAsStringAsync(filePath, pdfBytes, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await shareAsync(filePath, { mimeType: 'application/pdf' });
    return filePath;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
}
