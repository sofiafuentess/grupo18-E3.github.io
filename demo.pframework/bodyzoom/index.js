var prevMinSlider = 0,
  prevMaxSlider = 0;
const minMovement = 4; // Movimiento mínimo para actualizar los deslizadores

function updateSlidersByFactors(zoomFactor, movingFactor) {
  const range = sliderMaxValue;

  // Calcula el rango ajustado en función del zoom
  const adjustedRange = range * ((100 - zoomFactor) / 100);

  // Calcula los valores mínimo y máximo de los deslizadores
  const minSliderValue = parseInt(
    (movingFactor / 100) * (range - adjustedRange)
  );
  const maxSliderValue = parseInt(minSliderValue + adjustedRange);

  // Verifica si los valores de los deslizadores han cambiado significativamente
  if (
    Math.abs(minSliderValue - prevMinSlider) > minMovement ||
    Math.abs(maxSliderValue - prevMaxSlider) > minMovement
  ) {
    sliderOne.value = minSliderValue; // Actualiza el valor del slider mínimo
    sliderTwo.value = maxSliderValue; // Actualiza el valor del slider máximo
    prevMinSlider = minSliderValue; // Guarda el valor mínimo anterior
    prevMaxSlider = maxSliderValue; // Guarda el valor máximo anterior
  }

  // Filtra los datos según los valores de los deslizadores y actualiza el gráfico
  filterDataBySlider(sliderOne.value, sliderTwo.value);
  plotData();
}

// Escucha los datos recibidos del objeto Protobject y actualiza los deslizadores
Protobject.Core.onReceived((data) => {
  const adjustedZoom = (data.zoom - 25) * 3; // Ajusta el zoom (a través de pruebas y errores)
  const adjustedMoving = data.moving * 1.5 - 25; // Ajusta el movimiento (a través de pruebas y errores)
  updateSlidersByFactors(adjustedZoom, adjustedMoving);
});

let filteredDates = [];
let filteredAapl = [];

// Filtrar los datos en función de los valores de los sliders
function filterDataBySlider(min, max) {
  filteredDates = []; // Limpiar la lista de fechas filtradas
  filteredAapl = []; // Limpiar la lista de valores filtrados

  // Recorrer los datos y filtrar por el rango seleccionado por los sliders
  for (let i = parseInt(min); i < parseInt(max); i++) {
    filteredDates.push(dates[i]); // Añadir la fecha filtrada
    filteredAapl.push(aapl[i]); // Añadir el valor AAPL correspondiente
  }
}

// Función para graficar los datos filtrados
function plotData() {
  const trace1 = {
    type: "scatter",
    mode: "lines",
    name: "AAPL",
    x: filteredDates,
    y: filteredAapl,
    line: { color: "#17BECF" },
  };

  const data = [trace1];

  const layout = {
    title: "Apple Stock",
    showlegend: false,
    xaxis: {
      range: [filteredDates[0], filteredDates[filteredDates.length - 1]],
    },
    yaxis: {
      range: [85, 140], // Ajusta según los datos reales
    },
  };

  Plotly.newPlot("myDiv", data, layout); // Crear o actualizar el gráfico
}

let sliderOne = document.getElementById("slider-1");
let sliderTwo = document.getElementById("slider-2");
let sliderMaxValue = dates.length;

// Configura los sliders con el valor máximo y value basado en la longitud de las fechas
sliderOne.max = sliderMaxValue;
sliderTwo.max = sliderMaxValue;
sliderTwo.value = sliderMaxValue;

// Mínima diferencia permitida entre los dos sliders
const minGap = 30;

// Función para actualizar los filtros y el gráfico basado en los sliders
function updateSliders() {
  // Asegurarse de que los sliders no se crucen
  if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
    if (this === sliderOne) {
      sliderOne.value = parseInt(sliderTwo.value) - minGap;
    } else {
      sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
  }

  // Llamar a filterDataBySlider con los valores de los sliders
  filterDataBySlider(sliderOne.value, sliderTwo.value);
  plotData();
}

// Añadir eventos a los sliders para actualizar el gráfico en tiempo real
sliderOne.addEventListener("input", updateSliders);
sliderTwo.addEventListener("input", updateSliders);

// Inicializa el grafico con los sliders en sus posiciones minima y maxima (overview general)
updateSliders();
