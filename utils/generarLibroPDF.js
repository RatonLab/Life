import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function generarLibroPDF(nombreAutor, estilo, dedicatoriaTexto, fotoBase64 = null) {
  const pdfDoc = await PDFDocument.create();

  const fontTitulo = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontTexto = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pagePortada = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = pagePortada.getSize();

  const estilos = {
    Vintage: rgb(0.95, 0.90, 0.82),
    Moderno: rgb(0.93, 0.93, 0.93),
    Orgánico: rgb(0.88, 0.94, 0.87),
  };
  const colorFondo = estilos[estilo] || rgb(1, 1, 1);
  const colorTexto = rgb(0.2, 0.2, 0.2);

  const fecha = new Date().toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Portada
  pagePortada.drawRectangle({ x: 0, y: 0, width, height, color: colorFondo });
  pagePortada.drawText('Mi vida en palabras', {
    x: 60,
    y: height - 100,
    size: 30,
    font: fontTitulo,
    color: colorTexto,
  });
  pagePortada.drawText(`Por: ${nombreAutor}`, {
    x: 60,
    y: height - 150,
    size: 18,
    font: fontTexto,
    color: colorTexto,
  });
  pagePortada.drawText(`Fecha: ${fecha}`, {
    x: 60,
    y: height - 180,
    size: 14,
    font: fontTexto,
    color: colorTexto,
  });

  if (fotoBase64) {
    const imageBytes = await fetch(fotoBase64).then(res => res.arrayBuffer());
    const image = await pdfDoc.embedJpg(imageBytes);
    pagePortada.drawImage(image, {
      x: width - 180,
      y: height - 280,
      width: 120,
      height: 120,
    });
  }

  // Dedicatoria
  const pageDedicatoria = pdfDoc.addPage([595, 842]);
  pageDedicatoria.drawRectangle({ x: 0, y: 0, width, height, color: colorFondo });
  pageDedicatoria.drawRectangle({
    x: 40,
    y: 80,
    width: width - 80,
    height: height - 160,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });

  const dedicatoriaLineas = dividirTextoEnLineas(dedicatoriaTexto, 80);
  dedicatoriaLineas.forEach((linea, i) => {
    pageDedicatoria.drawText(linea, {
      x: 60,
      y: height - 200 - i * 24,
      size: 16,
      font: fontTexto,
      color: rgb(0.3, 0.2, 0.2),
    });
  });

  const pdfBytes = await pdfDoc.save();
  const filePath = FileSystem.documentDirectory + 'libro_completo.pdf';
  await FileSystem.writeAsStringAsync(filePath, pdfBytes, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(filePath, {
    mimeType: 'application/pdf',
    dialogTitle: 'Compartir libro PDF',
    UTI: 'com.adobe.pdf',
  });
}

function dividirTextoEnLineas(texto, maxCaracteresPorLinea) {
  const palabras = texto.split(' ');
  const lineas = [];
  let lineaActual = '';

  palabras.forEach(palabra => {
    if ((lineaActual + palabra).length <= maxCaracteresPorLinea) {
      lineaActual += palabra + ' ';
    } else {
      lineas.push(lineaActual.trim());
      lineaActual = palabra + ' ';
    }
  });

  if (lineaActual.trim() !== '') lineas.push(lineaActual.trim());
  return lineas;
}
