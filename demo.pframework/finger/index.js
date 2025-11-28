const VIDEO_W = 640;
const VIDEO_H = 360;

// Ajusta estos valores si el mapa no calza bien.
// Están en coordenadas normalizadas (0 a 1) sobre el video de la Spedal.
const MAP_X_MIN = 0.1;
const MAP_X_MAX = 0.9;
const MAP_Y_MIN = 0.4;
const MAP_Y_MAX = 0.7;

// Definimos 6 franjas verticales sobre el mapa físico (macro-regiones)
const regiones = [
  {
    id: "norte_grande",
    nombre: "Norte Grande",
    xMin: MAP_X_MIN,
    xMax: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.17,
    yMin: MAP_Y_MIN,
    yMax: MAP_Y_MAX,
  },
  {
    id: "norte_chico",
    nombre: "Norte Chico",
    xMin: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.17,
    xMax: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.34,
    yMin: MAP_Y_MIN,
    yMax: MAP_Y_MAX,
  },
  {
    id: "centro",
    nombre: "Zona Centro",
    xMin: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.34,
    xMax: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.5,
    yMin: MAP_Y_MIN,
    yMax: MAP_Y_MAX,
  },
  {
    id: "rm",
    nombre: "Región Metropolitana",
    xMin: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.5,
    xMax: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.6,
    yMin: MAP_Y_MIN,
    yMax: MAP_Y_MAX,
  },
  {
    id: "sur",
    nombre: "Zona Sur",
    xMin: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.6,
    xMax: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.8,
    yMin: MAP_Y_MIN,
    yMax: MAP_Y_MAX,
  },
  {
    id: "austral",
    nombre: "Zona Austral",
    xMin: MAP_X_MIN + (MAP_X_MAX - MAP_X_MIN) * 0.8,
    xMax: MAP_X_MAX,
    yMin: MAP_Y_MIN,
    yMax: MAP_Y_MAX,
  },
];

// Helpers DOM
const cursorEl = document.getElementById("cursor");
const infoEl = document.getElementById("info");
const debugEl = document.getElementById("debug");

let regionActualId = null;

// Dado x,y normalizados (0–1), decide si está sobre el mapa y qué macro-región es
function regionDesdePosicion(xNorm, yNorm) {
  if (
    xNorm < MAP_X_MIN ||
    xNorm > MAP_X_MAX ||
    yNorm < MAP_Y_MIN ||
    yNorm > MAP_Y_MAX
  ) {
    return null;
  }

  return (
    regiones.find(
      (r) =>
        xNorm >= r.xMin &&
        xNorm <= r.xMax &&
        yNorm >= r.yMin &&
        yNorm <= r.yMax
    ) || null
  );
}

// Lógica cuando cambia de región
function onRegionDetectada(region) {
  const datos = regionesCampamentos[region.id];

  let mensaje;
  if (datos) {
    mensaje =
      `En ${datos.nombre} hay ${datos.campamentos} campamentos ` +
      `que agrupan aproximadamente ${datos.hogares} hogares.`;
  } else {
    mensaje = `Se ha detectado la zona ${region.nombre}, pero no hay datos cargados.`;
  }

  if (infoEl) infoEl.textContent = mensaje;

  // Sonificación con TextToSpeech de Protobject
  Protobject.TextToSpeech.stop && Protobject.TextToSpeech.stop();
  Protobject.TextToSpeech.play("es-CL", mensaje);

  console.log("Región detectada:", region.id, mensaje);
}

// Recibimos los datos de la mano desde hand.html
Protobject.Core.onReceived((data) => {
  if (!data || typeof data.x !== "number" || typeof data.y !== "number") {
    return;
  }

  const xNorm = data.x; // 0–1
  const yNorm = data.y; // 0–1

  // Mover cursor de debug sobre el contenedor (opcional, solo visual)
  if (cursorEl) {
    const xPx = xNorm * VIDEO_W;
    const yPx = yNorm * VIDEO_H;
    cursorEl.style.left = `${xPx}px`;
    cursorEl.style.top = `${yPx}px`;
  }

  if (debugEl) {
    debugEl.textContent = `x: ${xNorm.toFixed(3)} · y: ${yNorm.toFixed(3)}`;
  }

  const region = regionDesdePosicion(xNorm, yNorm);
  if (!region) return;

  if (region.id === regionActualId) return;
  regionActualId = region.id;

  onRegionDetectada(region);
});
