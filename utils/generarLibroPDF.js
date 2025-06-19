import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { collection, getDocs, query, where, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

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

export async function generarLibroPDF(nombreAutor, dedicatoriaTexto, nombreArchivo = 'mi_vida_en_palabras') {
  const pdfDoc = await PDFDocument.create();
  const fontTitulo = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontTexto = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const colorFondo = rgb(0.95, 0.90, 0.82); // diseño Vintage
  const colorTexto = rgb(0.2, 0.2, 0.2);
  const [width, height] = [595, 842]; // A4

  // 🧾 Portada
  const portada = pdfDoc.addPage([width, height]);
  portada.drawRectangle({ x: 0, y: 0, width, height, color: colorFondo });
  portada.drawText('Mi vida en palabras', {
    x: 60,
    y: height - 100,
    size: 30,
    font: fontTitulo,
    color: colorTexto,
  });
  portada.drawText(`Por: ${nombreAutor}`, {
    x: 60,
    y: height - 150,
    size: 18,
    font: fontTexto,
    color: colorTexto,
  });

  // 💌 Dedicatoria
  const dedicatoria = pdfDoc.addPage([width, height]);
  dedicatoria.drawRectangle({ x: 0, y: 0, width, height, color: colorFondo });
  dedicatoria.drawRectangle({
    x: 40,
    y: 80,
    width: width - 80,
    height: height - 160,
    borderWidth: 1,
    borderColor: rgb(0.7, 0.7, 0.7),
  });
  const lineasDedic = dividirTextoEnLineas(dedicatoriaTexto, 90);
  lineasDedic.forEach((linea, i) => {
    dedicatoria.drawText(linea, {
      x: 60,
      y: height - 200 - i * 24,
      size: 16,
      font: fontTexto,
      color: rgb(0.3, 0.2, 0.2),
    });
  });

  // 🔍 Recolectar respuestas del usuario
  const usuarioID = auth.currentUser.uid;
  const q = query(
    collection(db, 'respuestas'),
    where('usuarioID', '==', usuarioID),
    where('estado', '==', 'respondida')
  );
  const snapshot = await getDocs(q);
  const respuestas = {};

  snapshot.forEach(doc => {
    const data = doc.data();
    const etapa = data.etapa || 'Sin etapa';
    if (!respuestas[etapa]) respuestas[etapa] = [];
    respuestas[etapa].push({
      pregunta: data.preguntaID,
      respuesta: data.textoRespuesta,
    });
  });

  // 📚 Páginas por etapa (excepto “Mensaje final”)
  for (const etapa of Object.keys(respuestas)) {
    if (etapa === 'Mensaje final') continue;

    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: colorFondo });
    page.drawText(etapa, {
      x: 60,
      y: height - 80,
      size: 22,
      font: fontTitulo,
      color: colorTexto,
    });

    let y = height - 120;

    for (const item of respuestas[etapa]) {
      const preguntaLineas = dividirTextoEnLineas(`❓ ${item.pregunta}`, 90);
      for (const linea of preguntaLineas) {
        page.drawText(linea, {
          x: 60,
          y: y,
          size: 14,
          font: fontTexto,
          color: rgb(0.1, 0.1, 0.5),
        });
        y -= 18;
      }

      const respuestaLineas = dividirTextoEnLineas(item.respuesta, 90);
      for (const linea of respuestaLineas) {
        page.drawText(linea, {
          x: 60,
          y: y,
          size: 13,
          font: fontTexto,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= 16;
      }

      y -= 20;
      if (y < 100) {
        y = height - 100;
        pdfDoc.addPage([width, height]);
      }
    }
  }

  // 🌅 Última hoja con pensamiento final
  try {
    const userDoc = await getDoc(doc(db, 'usuarios', usuarioID));
    const pensamientoFinal = userDoc.exists() ? userDoc.data().pensamientoFinal : '';

    if (pensamientoFinal && pensamientoFinal.trim() !== '') {
      const finalPage = pdfDoc.addPage([width, height]);
      finalPage.drawRectangle({ x: 0, y: 0, width, height, color: colorFondo });

      finalPage.drawText('🕊️ Pensamiento final', {
        x: 60,
        y: height - 100,
        size: 22,
        font: fontTitulo,
        color: colorTexto,
      });

      const lineasFinal = dividirTextoEnLineas(`“${pensamientoFinal.trim()}”`, 90);
      lineasFinal.forEach((linea, i) => {
        finalPage.drawText(linea, {
          x: 60,
          y: height - 160 - i * 24,
          size: 16,
          font: fontTexto,
          color: rgb(0.3, 0.15, 0.15),
        });
      });

      finalPage.drawText('— Escrito por el autor/a —', {
        x: 60,
        y: 80,
        size: 12,
        font: fontTexto,
        color: rgb(0.5, 0.5, 0.5),
      });
    }
  } catch (error) {
    console.warn('No se pudo cargar el pensamiento final:', error);
  }

  // 💾 Guardar y compartir
  const pdfBytes = await pdfDoc.save();
  const nombreLimpio = nombreArchivo.trim().replace(/[^a-zA-Z0-9_\-]/g, '_') || 'mi_vida_en_palabras';
  const filePath = FileSystem.documentDirectory + `${nombreLimpio}.pdf`;

  await FileSystem.writeAsStringAsync(filePath, pdfBytes, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(filePath, {
    mimeType: 'application/pdf',
    dialogTitle: `Compartir ${nombreLimpio}.pdf`,
    UTI: 'com.adobe.pdf',
  });

  // 🗂️ Guardar historial del libro generado
  try {
    await addDoc(collection(db, 'libros_generados'), {
      usuarioID,
      nombreArchivo: `${nombreLimpio}.pdf`,
      nombreAutor,
      fechaCreacion: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('No se pudo guardar el historial del libro generado:', error);
  }
}
