import { db, auth } from '../firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';

/**
 * Guarda o actualiza una respuesta del usuario
 */
export const guardarRespuesta = async (etapa, preguntaId, respuestaTexto, estado) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuario no autenticado");

    const docRef = doc(db, "respuestas", `${user.uid}_${etapa}_${preguntaId}`);
    const docSnap = await getDoc(docRef);

    const nuevaVersion = {
      texto: respuestaTexto,
      fecha: new Date().toISOString(),
    };

    if (docSnap.exists()) {
      const dataActual = docSnap.data();
      const versionAnterior = {
        texto: dataActual.textoRespuesta,
        fecha: dataActual.fechaModificacion?.toDate?.() || null,
      };

      await updateDoc(docRef, {
        textoRespuesta: respuestaTexto,
        estado,
        fechaModificacion: serverTimestamp(),
        versionesAnteriores: arrayUnion(versionAnterior),
      });
    } else {
      await setDoc(docRef, {
        usuarioId: user.uid,
        etapa,
        preguntaId,
        textoRespuesta: respuestaTexto,
        estado,
        fechaModificacion: serverTimestamp(),
        versionesAnteriores: [],
      });
    }

    console.log(`✅ Respuesta guardada: ${preguntaId}`);
  } catch (error) {
    console.error("❌ Error al guardar la respuesta:", error.message);
  }
};
