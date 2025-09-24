//lida com o o div de id container
const container = document.getElementById("container");
//lida com o botão de id resetBtn
const resetBtn = document.getElementById("resetBtn");
//lida com a variável gridSizeInput
const gridInput = document.getElementById("gridSizeInput");

// MOUSE presionado começa como não
let mousePressionado = false;
//lida com os eventos de mousepressionado e mouse solto
document.addEventListener("mousedown", () => (mousePressionado = true));
document.addEventListener("mouseup", () => (mousePressionado = false));

// FUNÇÃO PINTAR - VERSÃO TESTE
function paintCell(cell) {
  cell.style.backgroundColor = "var(--cor-pintura)";
}

/*--------------------------------------------------------*/

function criarGrid(gridSize) {
  container.innerHTML = ""; // Limpa o grid anterior

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const cellWidth = containerWidth / gridSize;
  const cellHeight = containerHeight / gridSize;

  // Calcula quantas linhas cabem realmente
  const linhasQueCabem = Math.floor(containerHeight / cellHeight);

  /*------------------------------------------------------*/

  //cria o grid
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

  // TOUCH - CORRIGIDO
  container.addEventListener("touchstart", (e) => {
    e.preventDefault();

    const touch = e.touches[0];
    const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = elemento?.closest(".cell");

    if (cell) {
      paintCell(cell);
    }
  });

  container.addEventListener("touchmove", (e) => {
    e.preventDefault();

    const touch = e.touches[0];
    const elemento = document.elementFromPoint(touch.clientX, touch.clientY);
    const cell = elemento?.closest(".cell");

    if (cell) {
      paintCell(cell);
    }
  });
}

/*--------------------------------------------------------*/

// INICIALIZAR
criarGrid(parseInt(gridInput.value) || 16);

resetBtn.addEventListener("click", () => {
  const novoSize = Math.min(100, parseInt(gridInput.value) || 16);
  criarGrid(novoSize);
});
