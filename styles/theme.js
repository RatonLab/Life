export const colores = {
  fondo: '#fdf6ec',
  texto: '#333333',
  secundario: '#666666',
  primario: '#e8a9a9',
  acento: '#a9c4e8',
  borde: '#e2d8c4',
};

export const estilosBase = {
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colores.texto,
    marginBottom: 10,
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
    color: colores.texto,
  },
  subtitulo: {
    fontSize: 14,
    color: colores.secundario,
    marginBottom: 8,
  },
  boton: {
    backgroundColor: colores.primario,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    padding: 20,
  },
};
