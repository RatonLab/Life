import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function generarPortadaPDF(nombreAutor, estilo, fotoBase64 = null) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // Tamaño A4

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fecha = new Date().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Colores según estilo
  const estilos = {
    Vintage: rgb(0.95, 0.90, 0.82),
    Moderno: rgb(0.93, 0.93, 0.93),
    Orgánico: rgb(0.88, 0.94, 0.87),
  };
  const colorFondo = estilos[estilo] || rgb(1, 1, 1);
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: colorFondo,
  });

  // Título
  page.drawText('Mi vida en palabras', {
    x: 60,
    y: height - 100,
    size: 30,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Autor
  page.drawText(`Por: ${nombreAutor}`, {
    x: 60,
    y: height - 150,
    size: 18,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Fecha
  page.drawText(`Fecha: ${fecha}`, {
    x: 60,
    y: height - 180,
    size: 14,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Foto si está disponible
  if (fotoBase64) {
    const imageBytes = await fetch(fotoBase64).then(res => res.arrayBuffer());
    const image = await pdfDoc.embedJpg(imageBytes);
    page.drawImage(image, {
      x: width - 180,
      y: height - 280,
      width: 120,
      height: 120,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const filePath = FileSystem.documentDirectory + 'portada.pdf';
  await FileSystem.writeAsStringAsync(filePath, pdfBytes, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(filePath, {
    mimeType: 'application/pdf',
    dialogTitle: 'Compartir portada PDF',
    UTI: 'com.adobe.pdf',
  });
}
