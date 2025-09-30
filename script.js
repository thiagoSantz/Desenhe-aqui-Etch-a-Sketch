//#region Inicialização

//lida com o o div de id container
const container = document.getElementById("container");
//lida com o botão de id resetBtn
const resetBtn = document.getElementById("resetBtn");
//lida com a variável id gridPreset (Slider)
const gridPreset = document.getElementById("gridPreset");
const presetValues = [16, 32, 48, 64, 80]; // valores para o gridPreset
//lida com o colorPicker
const colorPicker = document.getElementById("colorPicker");
//Borracha
const eraserBtn = document.getElementById("eraserBtn");
let isEraserActive = false;

// Cria o elemento do cursor para borracha
const eraserCursor = document.createElement("div");
eraserCursor.className = "eraser-cursor";
document.body.appendChild(eraserCursor);

// Evento do botão borracha
eraserBtn.addEventListener("click", () => {
  isEraserActive = !isEraserActive;
  eraserBtn.classList.toggle("active", isEraserActive);
  eraserCursor.style.display = isEraserActive ? "block" : "none";
});

// Mostra/oculta e move o cursor
document.addEventListener("mousemove", (e) => {
  if (isEraserActive) {
    eraserCursor.style.display = "block";
    eraserCursor.style.width = "15px";
    eraserCursor.style.height = "15px";
    eraserCursor.style.left = e.pageX - 7 + "px";
    eraserCursor.style.top = e.pageY - 7 + "px";
  } else {
    eraserCursor.style.display = "none";
  }
});

// Esconde quando mouse sai da janela
document.addEventListener("mouseleave", () => {
  eraserCursor.style.display = "none";
});

// Array com 8 cores primárias iniciais
let colorHistory = [
  "#FF0000", // vermelho
  "#00FF00", // verde
  "#0000FF", // azul
  "#FFFF00", // amarelo
  "#FF00FF", // magenta
  //'#00FFFF', // ciano
  //'#FFA500', // laranja
  //'#9D9DA2'  // cinza (cor padrão)
];

// Atualiza a palette quando cor é escolhida
colorPicker.addEventListener("change", () => {
  addToHistory(colorPicker.value);
});

// Evento do slider
gridPreset.addEventListener("input", () => {
  const valor = presetValues[gridPreset.value];
  criarGrid(valor);
});

// Eventos de mouse
let mousePressionado = false;
//lida com os eventos de mousepressionado e mouse solto
document.addEventListener("mousedown", () => (mousePressionado = true));
document.addEventListener("mouseup", () => (mousePressionado = false));

// Evento do Botão de reinicio
resetBtn.addEventListener("click", () => {
  // Recria grid com o valor atual do slider
  const valorAtual = presetValues[gridPreset.value];
  criarGrid(valorAtual);
});

// FUNÇÃO PINTAR
function paintCell(cell) {
  if (isEraserActive) {
    cell.style.backgroundColor = "transparent"; // ← borracha APAGA
  } else {
    cell.style.backgroundColor = colorPicker.value; // ← pincel PINTA
  }
}

// Adiciona cor ao histórico (COMPORTAMENTO CORRETO)
function addToHistory(newColor) {
  colorHistory = colorHistory.filter((color) => color !== newColor);
  colorHistory.unshift(newColor);

  if (colorHistory.length > 5) {
    colorHistory = colorHistory.slice(0, 5);
  }

  updateColorHistory();
}
//#endregion

/*--------------------------------------------------------*/
// Atualiza a exibição (JS CORRETO - HTML e CSS do anterior)
function updateColorHistory() {
  const historyContainer = document.querySelector(".color-history-container");

  historyContainer.innerHTML = "";

  colorHistory.forEach((color, index) => {
    const colorDiv = document.createElement("div");
    colorDiv.className = "color-history-item";
    colorDiv.style.backgroundColor = color;
    colorDiv.title = color;
    colorDiv.addEventListener("click", () => {
      colorPicker.value = color;
    });
    historyContainer.appendChild(colorDiv);
  });
}

function criarGrid(gridSize) {
  container.innerHTML = ""; // Limpa o grid anterior

  // Força recálculo do layout antes de medir
  void container.offsetWidth; // trigger reflow

  // Calculos para caber as celulas
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const cellWidth = containerWidth / gridSize;
  const cellHeight = containerHeight / gridSize;

  // Calcula quantas linhas cabem realmente no container
  // Calcula com margem de erro para bordas
  const linhasQueCabem = Math.floor((containerHeight - 2) / cellHeight);

  /*------------------------------------------------------*/

  // Loop para criar o grid
  for (let i = 0; i < gridSize * linhasQueCabem; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    cell.style.width = `${cellWidth}px`;
    cell.style.height = `${cellHeight}px`;

    // Eventos mouse
    cell.addEventListener("mouseover", () => {
      if (mousePressionado) paintCell(cell);
    });
    cell.addEventListener("mousedown", () => paintCell(cell));

    container.appendChild(cell);
  }

  // Evento de Touch start
  container.addEventListener("touchstart", (e) => {
    e.preventDefault();

    if (isEraserActive) {
      const touch = e.touches[0];
      eraserCursor.style.display = "block";
      eraserCursor.style.width = "25px"; // maior para touch
      eraserCursor.style.height = "25px";
      eraserCursor.style.left = touch.clientX - 12 + "px";
      eraserCursor.style.top = touch.clientY - 12 + "px";
    }

    const touch = e.touches[0];
    const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = elemento?.closest(".cell");

    if (cell) {
      paintCell(cell);
    }
  });

  // Evento de Touch pressionado
  container.addEventListener("touchmove", (e) => {
    e.preventDefault();

    if (isEraserActive) {
      const touch = e.touches[0];
      eraserCursor.style.left = touch.clientX - 12 + "px";
      eraserCursor.style.top = touch.clientY - 12 + "px";
    }

    const touch = e.touches[0];
    const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = elemento?.closest(".cell");

    if (cell) {
      paintCell(cell);
    }
  });

  container.addEventListener("touchend", () => {
    eraserCursor.style.display = "none"; // esconde quando solta
  });
}

/*--------------------------------------------------------*/

criarGrid(presetValues[2]); // Inicia com 48 células

// Inicializa a exibição
updateColorHistory();
