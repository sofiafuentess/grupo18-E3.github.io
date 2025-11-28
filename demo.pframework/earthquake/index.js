const myPlot = document.getElementById("myMap");

const lon = terremotos.map((item) => item.Lon);
const lat = terremotos.map((item) => item.Lat);
//magnitudRaw son las magnitudes reales
const magnitudRaw = terremotos.map((item) => item.Magnitud);
//magnitud transforma las magnitudes reales para que las diferencias sean mas evidentes.
const magnitud = terremotos.map((item) => item.Magnitud * 5 - 28);

const data = [
  {
    type: "choropleth",
    locations: ["CHL"],
    z: [5],
    zmin: 0,
    zmax: 10,
    hoverinfo: "skip",
    showscale: false,
    colorscale: [
      [0, "rgb(255,255,255)"],
      [1, "rgb(200,200,200)"],
    ],
  },
  {
    type: "scattergeo",
    mode: "markers",
    lon: lon,
    lat: lat,
    cmax: 9,
    cmin: 6,
    hoverinfo: "none",
    name: "",
    marker: {
      color: magnitud,
      size: magnitud,
      colorscale: [
        [0, "rgb(255,255,255)"],
        [1, "rgb(0,0,0)"],
      ],
      line: { color: "black" },
    },
  },
];

const layout = {
  geo: {
    scope: "south america",
    resolution: 150,
    showland: true,
    landcolor: "rgb(255, 255, 255)",
    subunitwidth: 1,
    countrywidth: 1,
    subunitcolor: "rgb(255,255,255)",
    countrycolor: "rgb(255,255,255)",
    lonaxis: { range: [-64, -76] },
    lataxis: { range: [-18, -59] },
  },
  autosize: false,
  width: 200,
  height: 800,
  dragmode: false,
  margin: { l: 0, r: 0, b: 0, t: 0, pad: 0 },
};

Plotly.newPlot("myMap", data, layout, {
  scrollZoom: false,
  displayModeBar: false,
});

const highAudio = new Audio("high.mp3");
const mediumAudio = new Audio("medium.mp3");
const lowAudio = new Audio("low.mp3");

myPlot.on("plotly_hover", function (data) {
  var index = data.points[0].pointIndex;
  //deshabilitar el interval que gestiona la interaccion
  clearInterval(interactionInterval);
  showDetail(index);
});

function showDetail(index) {
  document.getElementById("nombre").innerHTML = terremotos[index].Nombre;
  document.getElementById("regiones").innerHTML = terremotos[index].Zonas;

  if (terremotos[index].Tzunami) {
    document.getElementById("tzunami").style.display = "block";
  } else {
    document.getElementById("tzunami").style.display = "none";
  }

  if (terremotos[index].Muertos == 0) {
    document.getElementById("muertos").style.color = "#124599";
  } else {
    document.getElementById("muertos").style.color = "";
  }

  document.getElementById("muertos").innerHTML = terremotos[index].Muertos;

  var magnitud = terremotos[index].Magnitud;
  var magnitudElement = document.getElementById("magnitud");
  magnitudElement.innerHTML = magnitud;

  magnitud *= 10;
  magnitudElement.style.width = magnitud + "px";
  magnitudElement.style.height = magnitud + "px";
  magnitudElement.style.lineHeight = magnitud + "px";
  document.querySelector("#tzunami img").style.height = magnitud + "px";

  document.getElementById("details").style.opacity = 1;
  document.getElementById("context").style.opacity = 0;
}

myPlot.on("plotly_unhover", function () {
  showInitialContext();
  //habilitar el interval que gestiona la interaccion
  activateInteraction();
});

function showInitialContext() {
  document.getElementById("details").style.opacity = 0;
  document.getElementById("context").style.opacity = 1;
}

var timeout;
myPlot.on("plotly_click", function (data) {
  earthQuake({
    el: myPlot,
    animationOption: "shaky",
  });

  var magnitudSound = terremotos[data.points[0].pointIndex].Magnitud;
  Protobject.Core.send(magnitudSound - 5.9).to("arduino.html");

  var volumeHigh = magnitudSound - 7.9;
  var volumeMedium = magnitudSound - 6.9;
  var volumeLow = magnitudSound - 5.9;

  volumeHigh = Math.max(0, Math.min(volumeHigh, 1));
  volumeMedium = Math.max(0, Math.min(volumeMedium, 1));
  volumeLow = Math.max(0, Math.min(volumeLow, 1));

  highAudio.volume = volumeHigh;
  mediumAudio.volume = volumeMedium;
  lowAudio.volume = volumeLow;

  highAudio.currentTime = 0;
  mediumAudio.currentTime = 0;
  lowAudio.currentTime = 0;

  highAudio.play();
  mediumAudio.play();
  lowAudio.play();

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    highAudio.pause();
    mediumAudio.pause();
    lowAudio.pause();
    Protobject.Core.send(0).to("arduino.html");
  }, 20000);
});

let generatedMagnitude = 0;

// Comentarios CLASE 18 abajo
// Escucha los valores de magnitud generados
Protobject.Core.onReceived((magnitude) => {
  generatedMagnitude = magnitude;
});

// Encuentra el índice del terremoto más cercano al valor generado
function indiceMasCercano(valorGenerado) {
  // Inicializa el índice y la diferencia mínima con el primer valor
  let indiceMasCercano = 0;
  let diferenciaMinima = Math.abs(valorGenerado - magnitudRaw[0]);

  // Itera a través de las magnitudes para encontrar la más cercana
  for (let i = 1; i < magnitudRaw.length; i++) {
    const diferenciaActual = Math.abs(valorGenerado - magnitudRaw[i]);

    // Actualiza si la diferencia actual es menor que la mínima registrada
    if (diferenciaActual < diferenciaMinima) {
      diferenciaMinima = diferenciaActual;
      indiceMasCercano = i;
    }
  }

  return indiceMasCercano;
}

let interactionInterval;

// Activa la interacción para mostrar información sobre el terremoto
function activateInteraction() {
  interactionInterval = setInterval(() => {
    // Solo realiza la acción si la magnitud generada es mayor que 3
    if (generatedMagnitude > 3) {
      console.log(`Generated magnitude: ${generatedMagnitude}`);
      const indexTerremoto = indiceMasCercano(generatedMagnitude);
      showDetail(indexTerremoto);
    } else {
      showInitialContext();
    }
  }, 3000);
}

// Inicia la función de interacción
activateInteraction();
