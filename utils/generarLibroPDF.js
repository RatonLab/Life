import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

function base64ToBlob(base64, mimeType = 'application/pdf') {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

export async function generarLibroPDF(usuarioID) {
  try {
    const docRef = doc(db, 'usuarios', usuarioID);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('No se encontró el usuario');
    }

    const datosUsuario = docSnap.data();
    const nombreCompleto = datosUsuario.nombre || 'SinNombre';
    const nombreLimpio = nombreCompleto.replace(/\s+/g, '_');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const textFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const titulo = 'Mi vida en palabras';
    const subtitulo = 'Tu historia merece ser contada';

    const fontSizeTitulo = 28;
    const fontSizeSubtitulo = 20;

    const textWidthTitulo = titleFont.widthOfTextAtSize(titulo, fontSizeTitulo);
    const textWidthSubtitulo = textFont.widthOfTextAtSize(subtitulo, fontSizeSubtitulo);

    const xTitulo = (width - textWidthTitulo) / 2;
    const xSubtitulo = (width - textWidthSubtitulo) / 2;

    page.drawText(titulo, {
      x: xTitulo,
      y: height - 100,
      size: fontSizeTitulo,
      font: titleFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    page.drawText(subtitulo, {
      x: xSubtitulo,
      y: height - 140,
      size: fontSizeSubtitulo,
      font: textFont,
      color: rgb(0.4, 0.4, 0.4),
    });

    const pdfBytes = await pdfDoc.save();

    const filePath = `${FileSystem.cacheDirectory}${nombreLimpio}_libro.pdf`;
    await FileSystem.writeAsStringAsync(filePath, pdfBytes.toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Cargar archivo PDF como base64
    const pdfBase64Upload = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convertir a Blob
    const pdfBlob = base64ToBlob(pdfBase64Upload, 'application/pdf');

    // Subir a Firebase Storage
    const storageRef = ref(storage, `libros/${usuarioID}/${nombreLimpio}.pdf`);
    await uploadBytes(storageRef, pdfBlob);
    const urlPDF = await getDownloadURL(storageRef);

    console.log('✅ PDF subido con éxito:', urlPDF);
    await shareAsync(filePath);
    return urlPDF;

  } catch (error) {
    console.error('❌ Error al generar el PDF:', error);
    throw error;
  }
}
