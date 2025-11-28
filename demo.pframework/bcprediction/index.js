// Extrae las fechas y valores de los datos de Bitcoin
let Dates = btdata.map((item) => item.Date); // Array de fechas
let Val = btdata.map((item) => item.Value); // Array de valores

// type - Tipo de predicción (Pessimistic, Neutral, Optimistic).
function plotData(type) {
  // Extrae fechas y valores de las predicciones basadas en el tipo
  let DatesP = predictions.map((item) => item.Date); // Fechas de predicciones
  let ValP = predictions.map((item) => item[type]); // Valores de predicciones según el tipo

  // Definición de la traza para los datos reales
  const trace1 = {
    type: "scatter",
    mode: "lines",
    x: Dates, // Fechas reales
    y: Val, // Valores reales
    line: { color: "#17BECF" }, // Color de la línea
  };

  // Definición de la traza para las predicciones
  const trace2 = {
    type: "scatter",
    mode: "lines",
    x: DatesP, // Fechas de predicción
    y: ValP, // Valores de predicción
    line: { color: "#222", dash: "dot" }, // Color de la línea y tipo de línea
  };

  const data = [trace1, trace2]; // Conjunto de datos para el gráfico

  // Configuración del diseño del gráfico
  const layout = {
    title: "Bitcoin Price Predictions", // Título del gráfico
    showlegend: false, // Oculta la leyenda
    yaxis: {
      range: [0, 200000], // Rango del eje Y
    },
    xaxis: {
      range: [Dates[0], DatesP[DatesP.length - 1]], // Rango del eje X
      tickvals: [
        "8-Oct-19",
        "8-Oct-20",
        "8-Oct-21",
        "8-Oct-22",
        "8-Oct-23",
        "8-Oct-24",
        "8-Oct-25",
        "8-Oct-26",
        "8-Oct-27",
        "8-Oct-28",
        "8-Oct-29",
      ], // Valores de ticks específicos
    },
    annotations: [
      // Anotaciones en el gráfico
      {
        x: "8-Oct-24",
        y: 0,
        xref: "x",
        yref: "y",
        text: "Predictions",
        showarrow: true,
        arrowhead: 0,
        ax: 0,
        ay: -180,
        xanchor: "left",
      },
    ],
  };

  // Crea o actualiza el gráfico
  Plotly.newPlot("myDiv", data, layout);
}

// Inicializa el gráfico con la predicción neutral
plotData("Neutral");

// Asigna eventos de clic a los botones para actualizar el gráfico según el tipo de predicción
document.getElementById("Pessimistic").onclick = function () {
  plotData("Pessimistic");
};
document.getElementById("Neutral").onclick = function () {
  plotData("Neutral");
};
document.getElementById("Optimistic").onclick = function () {
  plotData("Optimistic");
};

// Recibe datos de Protobject y actualiza el gráfico
Protobject.Core.onReceived((data) => {
  plotData(data); // Actualiza el gráfico con los nuevos datos
  // Restablece el color de fondo de los botones
  document.getElementById("Pessimistic").style.background = "";
  document.getElementById("Optimistic").style.background = "";
  document.getElementById("Neutral").style.background = "";
  // Resalta el botón correspondiente al tipo de predicción actual
  document.getElementById(data).style.background = "yellow";
});
