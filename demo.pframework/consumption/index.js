// Mapeo de las horas para el eje theta (angular) del gráfico
let time = cData.map((item) => item.time);

// Mapeo de los consumos divididos por 200000 para normalizarlos en el rango 0-5 (los datos son ficticios)
let cons1 = cData.map((item) => item.cons1 / 200000);
let cons2 = cData.map((item) => item.cons2 / 200000);
let cons3 = cData.map((item) => item.cons3 / 200000);
let cons4 = cData.map((item) => item.cons4 / 200000);

// Generación de valores de texto con un decimal para mostrarlos en el hover
let cons1t = cons1.map((value) => value.toFixed(1));
let cons2t = cons2.map((value) => value.toFixed(1));
let cons3t = cons3.map((value) => value.toFixed(1));
let cons4t = cons4.map((value) => value.toFixed(1));

// Definición de la primera traza (curva) polar para el consumo 1
var trace1 = {
  theta: time, // Eje angular
  r: cons1, // Eje radial
  text: cons1t, // Valores de texto para hover
  fill: "toself", // El área se rellena hasta el centro
  type: "scatterpolar", // Tipo de gráfico polar
  fillcolor: "transparent", // Sin relleno visible (solo líneas)
  mode: "lines", // Solo líneas (sin marcadores)
  line: {
    color: "#333", // Color de la línea
    width: 2, // Grosor de la línea
    shape: "spline", // Línea suavizada
    smoothing: 1.1, // Nivel de suavizado
  },
  textfont: {
    color: "#111", // Color del texto
    size: 16, // Tamaño del texto
  },
  hoverinfo: "none", // Desactivar información en hover para simplificar
};

// Definición de la segunda traza polar (similar a la primera)
var trace2 = {
  theta: time,
  r: cons2,
  text: cons2t,
  fill: "tonext", // La segunda área se rellena entre esta curva y la anterior
  type: "scatterpolar",
  fillcolor: "transparent",
  mode: "lines",
  line: {
    color: "#333",
    width: 2,
    shape: "spline",
    smoothing: 1.1,
  },
  textfont: {
    color: "#111",
    size: 16,
  },
  hoverinfo: "none",
};

// Definición de la tercera traza polar
var trace3 = {
  theta: time,
  r: cons3,
  text: cons3t,
  fill: "tonext",
  type: "scatterpolar",
  mode: "lines",
  fillcolor: "transparent",
  line: {
    color: "#333",
    width: 2,
    shape: "spline",
    smoothing: 1.1,
  },
  textfont: {
    color: "#111",
    size: 16,
  },
  hoverinfo: "none",
};

// Definición de la cuarta traza polar
var trace4 = {
  theta: time,
  r: cons4,
  text: cons4t,
  fill: "tonext",
  type: "scatterpolar",
  mode: "lines",
  fillcolor: "transparent",
  line: {
    color: "#333",
    width: 2,
    shape: "spline",
    smoothing: 1.1,
  },
  textfont: {
    color: "#111",
    size: 16,
  },
  hoverinfo: "none",
};

// Agrupamos todas las trazas para graficarlas juntas
var data = [trace1, trace2, trace3, trace4];

var layout = {
  title:
    "Consumo eléctrico medio en kW para familias de 1 a 4 personas durante el día en una ciudad no especificada.",
  showlegend: false, // No se muestra la leyenda
  polar: {
    radialaxis: {
      visible: true, // Mostrar el eje radial
      showgrid: true, // Mostrar las líneas de la cuadrícula
      griddash: "dot", // Tipo de línea punteada
      gridcolor: "#aaa", // Color de las líneas de cuadrícula
      tickvals: [1, 2, 3, 4, 5], // Valores de las marcas de la escala
      ticktext: ["        1 kW", "", "   3 kW", "         4 kW", ""], // Texto de las marcas de escala
      angle: 0, // Inicia en el ángulo 0
      range: [0, 5.1], // Rango del eje radial
      tickcolor: "transparent", // Las marcas de escala son invisibles
      ticklen: 0, // Longitud de la marca de escala (no hay)
      showline: false, // Ocultar el borde radial
    },
    angularaxis: {
      showgrid: false, // No mostrar líneas en el eje angular
      showline: false, // No mostrar el borde angular
      tickcolor: "transparent", // Marcas invisibles
      direction: "clockwise", // Dirección del gráfico: en sentido horario
    },
  },
};

Plotly.newPlot("myDiv", data, layout);

// Obtener la referencia del gráfico
var myDiv = document.getElementById("myDiv");

// Manejo del evento hover
myDiv.on("plotly_hover", function (data) {
  var curveNumber = data.points[0].curveNumber; // Obtener el número de curva
  drawForFaces(curveNumber + 1);
});

function drawForFaces(curveNumber) {
  // Mostrar el número de personas basado en la curva actual
  var personasDiv = document.getElementById("npersonas");
  personasDiv.style.display = "block";
  personasDiv.innerHTML = curveNumber;

  // Si el número de curva es 0, restaurar los valores originales
  if (curveNumber == 0) {
    restore();
    return;
  }

  // Ajustamos curveNumber a un índice válido
  curveNumber--;

  // Establecer los colores y las modalidades en función del número de curva
  var fillColors = ["#ddd", "#ddd", "#ddd", "#ddd"];
  var modes = ["lines", "lines", "lines", "lines"]; // Inicializar todos como 'lines'

  // Cambiar colores solo hasta la curva actual
  for (var i = 0; i <= curveNumber; i++) {
    fillColors[i] = "#77bbee"; // Colorear el área resaltada
  }

  // Solo la curva seleccionada mostrará 'lines+text'
  modes[curveNumber] = "lines+text";

  // Crear el objeto de actualización
  var update = {
    fillcolor: fillColors,
    mode: modes,
    line: {
      color: "#888", // Color de la línea al hacer hover
      width: 1, // Grosor de la línea reducido
      shape: "spline", // Líneas suavizadas
      smoothing: 1.1, // Nivel de suavizado
    },
  };

  // Ocultar temporalmente los textos del eje radial
  layout.polar.radialaxis.ticktext = ["", "", "", "", ""];

  // Aplicar la actualización a la gráfica
  Plotly.restyle("myDiv", update);
  Plotly.relayout("myDiv", layout);
}

// Manejo del evento unhover (restaurar el gráfico)
myDiv.on("plotly_unhover", function () {
  restore();
});

// Función para restaurar el gráfico a su estado original
function restore() {
  document.getElementById("npersonas").style.display = "none"; // Ocultar el div de personas

  // Restablecer los valores originales
  var update = {
    fillcolor: ["transparent", "transparent", "transparent", "transparent"],
    mode: ["lines", "lines", "lines", "lines"],
    line: {
      color: "#333", // Restaurar el color de la línea
      width: 2, // Restaurar el grosor de la línea
      shape: "spline", // Líneas suavizadas
      smoothing: 1.1, // Nivel de suavizado
    },
  };

  // Restaurar los textos del eje radial
  layout.polar.radialaxis.ticktext = [
    "        1 kW",
    "",
    "   3 kW",
    "         4 kW",
    "",
  ];

  // Actualizar el gráfico
  Plotly.restyle("myDiv", update);
  Plotly.relayout("myDiv", layout);
}

// Función que se ejecuta cuando se recibe un dato desde Protobject
Protobject.Core.onReceived((data) => {
  drawForFaces(data);
});
