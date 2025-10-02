//lida com o id container do grid
const container = document.getElementById("container");

//#region gridPreset (Slider)
const gridPreset = document.getElementById("gridPreset");
const presetValues = [16, 32, 48, 64, 80]; // valores para o gridPreset

// Evento do slider
gridPreset.addEventListener("input", () => {
  const valor = presetValues[gridPreset.value];
  criarGrid(valor);
});

//#endregion

//#region Borracha
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

  //(indicação visual):
  if (isEraserActive) {
    eraserBtn.innerHTML =
      '<i class="fa-solid fa-eraser"></i><span>Apagar Ligado</span>';
  } else {
    eraserBtn.innerHTML =
      '<i class="fa-solid fa-eraser"></i><span>Apagar Desligado</span>';
  }
});

//#endregion Borracha

//#region Range da Borracha

// Tamanho fixo da área da borracha (em células)
const eraserAreaSize = 2; // apaga 2x2 células

let mousePressionado = false;
//lida com os eventos de mousepressionado e mouse solto
document.addEventListener("mousedown", () => (mousePressionado = true));
document.addEventListener("mouseup", () => (mousePressionado = false));

// Esconde quando mouse sai da janela
document.addEventListener("mouseleave", () => {
  eraserCursor.style.display = "none";
});

// Mostra/oculta quando move o cursor
// No mousemove, atualize o tamanho do cursor:
document.addEventListener("mousemove", (e) => {
  if (isEraserActive) {
    eraserCursor.style.display = "block";
    const cellSize = container.offsetWidth / presetValues[gridPreset.value];
    const visualSize = (eraserAreaSize * 2 + 1) * cellSize;
    eraserCursor.style.width = visualSize + "px";
    eraserCursor.style.height = visualSize + "px";
    // eraserCursor.style.left = e.pageX - visualSize / 2 + "px";
    // eraserCursor.style.top = e.pageY - visualSize / 2 + "px";

    const offset = visualSize / 2; // ou use 15 para fixo
    // eraserCursor.style.left = e.pageX - offset + "px";
    // eraserCursor.style.top = e.pageY - offset + "px";
    eraserCursor.style.left = e.clientX - offset + "px";
    eraserCursor.style.top = e.clientY - offset + "px";
  } else {
    eraserCursor.style.display = "none";
  }
});
//#endregion

//#region Botão de Reset
const resetBtn = document.getElementById("resetBtn");

// Evento do Botão de reinicio
resetBtn.addEventListener("click", () => {
  // Recria grid com o valor atual do slider
  const valorAtual = presetValues[gridPreset.value];
  criarGrid(valorAtual);
});
//#endregion

//#region Detector de Orientação
function recriarGridNaMudanca() {
  const valorAtual = presetValues[gridPreset.value];
  criarGrid(valorAtual);
}

// ✅ DESLIGA borracha se estiver ativa
if (isEraserActive) {
  isEraserActive = false;
  eraserBtn.classList.remove("active");
  eraserCursor.style.display = "none";
  eraserBtn.innerHTML =
    '<i class="fa-solid fa-eraser"></i><span>Borracha</span>';
}

// Detecta quando a tela vira (mobile)
window.addEventListener("orientationchange", recriarGridNaMudanca);

// Detecta redimensionamento (desktop/mobile)
window.addEventListener("resize", recriarGridNaMudanca);

// Opcional: Debounce para não chamar muitas vezes

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(recriarGridNaMudanca, 250);
});

//#endregion

//#region colorPicker (Escolha de cores)
const colorPicker = document.getElementById("colorPicker");

// Array com cores primárias iniciais para recente
let colorHistory = [
  "#9D9DA2", // cinza (cor padrão)
  "#FF0000", // vermelho
  "#FFFF00", // amarelo
  "#00FF00", // verde
  "#0000FF", // azul
  //"#FF00FF", // magenta
  //'#00FFFF', // ciano
  //'#FFA500', // laranja
];

// Atualiza a palette quando cor é escolhida
colorPicker.addEventListener("change", () => {
  addToHistory(colorPicker.value);
});
//#endregion

//#region Funções

// Pinta as celula do Grid container (Borracha,colorPicker)
function paintCell(targetCell) {
  if (isEraserActive) {
    // Borracha - apaga área ao redor
    const cells = document.querySelectorAll(".cell");
    const index = Array.from(cells).indexOf(targetCell);
    const gridSize = presetValues[gridPreset.value];

    // Calcula posição da célula alvo
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Apaga células na área ao redor
    for (let r = row - eraserAreaSize; r <= row + eraserAreaSize; r++) {
      for (let c = col - eraserAreaSize; c <= col + eraserAreaSize; c++) {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          const cellIndex = r * gridSize + c;
          if (cells[cellIndex]) {
            cells[cellIndex].style.backgroundColor = "transparent";
          }
        }
      }
    }
  } else {
    // Pincel normal - pinta só a célula
    targetCell.style.backgroundColor = colorPicker.value;
  }
}
/*--------------------------------------------------------*/
function addToHistory(newColor) {
  colorHistory = colorHistory.filter((color) => color !== newColor);
  colorHistory.unshift(newColor);

  if (colorHistory.length > 5) {
    colorHistory = colorHistory.slice(0, 5);
  }
  updateColorHistory();
}
/*--------------------------------------------------------*/
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
/*--------------------------------------------------------*/
function criarGrid(gridSize) {
  /*------------------------------------------------------*/
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
  /*------------------------------------------------------*/
}
/*--------------------------------------------------------*/

//#endregion

//#region Eventos Touch
// Evento de Touch start
container.addEventListener("touchstart", (e) => {
  e.preventDefault();

  if (isEraserActive) {
    const touch = e.touches[0];
    eraserCursor.style.display = "block";
    const cellSize = container.offsetWidth / presetValues[gridPreset.value];
    const visualSize = (eraserAreaSize * 2 + 1) * cellSize;
    eraserCursor.style.width = visualSize + "px";
    eraserCursor.style.height = visualSize + "px";
    // eraserCursor.style.left = touch.clientX - visualSize / 2 + "px";
    // eraserCursor.style.top = touch.clientY - visualSize / 2 + "px";
    const offset = visualSize / 2;
    eraserCursor.style.left = touch.clientX - offset + "px";
    eraserCursor.style.top = touch.clientY - offset + "px";
  }

  const touch = e.touches[0];
  const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
  const cell = elemento?.closest(".cell");

  if (cell) {
    paintCell(cell);
  }
});
/*------------------------------------------------------*/
// Evento de Touch pressionado
container.addEventListener("touchmove", (e) => {
  e.preventDefault();

  if (isEraserActive) {
    const touch = e.touches[0];
    const cellSize = container.offsetWidth / presetValues[gridPreset.value];
    const visualSize = (eraserAreaSize * 2 + 1) * cellSize;
    // eraserCursor.style.left = touch.clientX - visualSize / 2 + "px";
    // eraserCursor.style.top = touch.clientY - visualSize / 2 + "px";
    const offset = visualSize / 2;
    eraserCursor.style.left = touch.clientX - offset + "px";
    eraserCursor.style.top = touch.clientY - offset + "px";
  }

  const touch = e.touches[0];
  const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
  const cell = elemento?.closest(".cell");

  if (cell) {
    paintCell(cell);
  }
});
/*------------------------------------------------------*/
// Fim do touch
container.addEventListener("touchend", () => {
  eraserCursor.style.display = "none"; // esconde quando solta
});
//#endregion

//CHAMADAS
criarGrid(presetValues[2]); // Inicia na posição do meio do slider do grid

//Inicializa a exibição da palete de cores
updateColorHistory();
