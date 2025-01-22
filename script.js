const levels = {
    "3x3": 3,
    "4x4": 4,
    "5x5": 5
};

let gridSize = 3;
let tiles = [];
let gameContainer = document.getElementById("game-container");
let puzzlePieces = document.getElementById("puzzle-pieces");
let tileWidth = 160; // Ширина одной части пазла
let tileHeight = 80; // Высота одной части пазла
let currentImageSet = 'img'; // Изначально карта Казахстана

// Функция для показа кнопок уровней после выбора карты
function showLevelButtons() {
    document.getElementById("controls").style.display = 'block';
}

// Функция загрузки уровня
function loadLevel(level, imageSet = 'img') {
    currentImageSet = imageSet;
    gridSize = levels[level];
    gameContainer.innerHTML = "";
    puzzlePieces.innerHTML = "";
    tiles = [];

    // Настроим контейнер для пазла
    gameContainer.style.width = `${tileWidth * gridSize}px`;
    gameContainer.style.height = `${tileHeight * gridSize}px`;
    gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, ${tileWidth}px)`;
    gameContainer.style.gridTemplateRows = `repeat(${gridSize}, ${tileHeight}px)`;

    // Создаем ячейки в рамке
    for (let i = 0; i < gridSize * gridSize; i++) {
        const emptyTile = document.createElement("div");
        emptyTile.className = "tile empty";
        emptyTile.dataset.index = i + 1;
        emptyTile.style.width = `${tileWidth}px`;
        emptyTile.style.height = `${tileHeight}px`;
        tiles.push(emptyTile);
        gameContainer.appendChild(emptyTile);
    }

    // Создаем массив с номерами элементов и перемешиваем их
    const shuffledIndexes = shuffleArray([...Array(gridSize * gridSize).keys()].map(i => i + 1));

    // Создаем элементы пазла внизу
    shuffledIndexes.forEach((index) => {
        const tile = createTileElement(index, level, imageSet);
        puzzlePieces.appendChild(tile);
    });

    // Добавляем обработчики для ячеек в рамке
    tiles.forEach((tile) => {
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("drop", dropTile);
    });
}

// Функция для создания элементов пазла
function createTileElement(index, level, imageSet) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.width = `${tileWidth}px`;
    tile.style.height = `${tileHeight}px`;
    tile.style.backgroundImage = `url('${imageSet}/${level}/${index}.png')`;
    tile.style.backgroundSize = "contain";
    tile.style.backgroundRepeat = "no-repeat";
    tile.style.backgroundPosition = "center";
    tile.draggable = true;
    tile.dataset.index = index;

    // Обработчики для перетаскивания
    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragend", dragEnd);

    return tile;
}

// Перемешивание массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Начало перетаскивания
function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
    e.dataTransfer.effectAllowed = "move"; // Ограничиваем действие перетаскивания
    setTimeout(() => {
        e.target.style.opacity = "0.5";
    }, 0);
}

// Конец перетаскивания
function dragEnd(e) {
    e.target.style.opacity = "1";
}

// Обработка перетаскивания над ячейкой
function dragOver(e) {
    e.preventDefault(); // Отключаем стандартное поведение
    e.dataTransfer.dropEffect = "move"; // Указываем действие при сбросе
}

// Обработка сброса элемента на ячейку
function dropTile(e) {
    e.preventDefault(); // Отключаем стандартное поведение

    // Получаем индекс перетаскиваемого элемента
    const droppedIndex = e.dataTransfer.getData("text/plain");
    const targetTile = e.target;

    // Проверяем, что элемент сбрасывается на ячейку сетки
    if (targetTile.classList.contains("tile")) {
        // Сохраняем индекс элемента, который уже находится в ячейке (если есть)
        const existingIndex = targetTile.dataset.index;

        // Если ячейка не пустая, возвращаем текущий элемент обратно в контейнер для пазлов
        if (!targetTile.classList.contains("empty")) {
            const existingTile = createTileElement(existingIndex, `${gridSize}x${gridSize}`, currentImageSet);
            puzzlePieces.appendChild(existingTile); // Добавляем элемент обратно в контейнер
        }

        // Обновляем содержимое ячейки новым элементом
        targetTile.style.backgroundImage = `url('${currentImageSet}/${gridSize}x${gridSize}/${droppedIndex}.png')`;
        targetTile.style.backgroundSize = "contain";
        targetTile.style.backgroundRepeat = "no-repeat";
        targetTile.style.backgroundPosition = "center";

        // Помечаем ячейку как заполненную
        targetTile.classList.remove("empty");
        targetTile.dataset.index = droppedIndex;

        // Удаляем перетаскиваемый элемент из контейнера для пазлов
        const tileToRemove = puzzlePieces.querySelector(`[data-index="${droppedIndex}"]`);
        if (tileToRemove) {
            tileToRemove.remove();
        }

        // Проверяем, собран ли пазл
        checkWin();
    }
}

// Проверка, собран ли пазл
function checkWin() {
    let isCorrect = true;

    // Проверяем, что каждая ячейка содержит правильный элемент
    tiles.forEach((tile, index) => {
        const expectedIndex = index + 1;
        if (tile.dataset.index != expectedIndex) {
            isCorrect = false;
        }
    });

    // Поздравляем только если все элементы на своих местах
    if (isCorrect && tiles.every(tile => !tile.classList.contains("empty"))) {
        setTimeout(() => {
            alert("Поздравляем! Вы собрали пазл!");
        }, 300);
    }
}

// Подключение карт к кнопкам
document.getElementById("kazakhstan-map").addEventListener("click", () => {
    showLevelButtons();
    document.getElementById("level-3x3").style.display = 'block';
    document.getElementById("level-4x4").style.display = 'block';
    document.getElementById("level-5x5").style.display = 'block';

    document.getElementById("level-3x3-img1").style.display = 'none';
    document.getElementById("level-4x4-img1").style.display = 'none';
    document.getElementById("level-5x5-img1").style.display = 'none';
});

document.getElementById("world-map").addEventListener("click", () => {
    showLevelButtons();
    document.getElementById("level-3x3-img1").style.display = 'block';
    document.getElementById("level-4x4-img1").style.display = 'block';
    document.getElementById("level-5x5-img1").style.display = 'block';

    document.getElementById("level-3x3").style.display = 'none';
    document.getElementById("level-4x4").style.display = 'none';
    document.getElementById("level-5x5").style.display = 'none';
});

// Подключение уровней к кнопкам для Казахстана
document.getElementById("level-3x3").addEventListener("click", () => loadLevel("3x3"));
document.getElementById("level-4x4").addEventListener("click", () => loadLevel("4x4"));
document.getElementById("level-5x5").addEventListener("click", () => loadLevel("5x5"));

// Подключение уровней к кнопкам для карты мира (img1)
document.getElementById("level-3x3-img1").addEventListener("click", () => loadLevel("3x3", 'img1'));
document.getElementById("level-4x4-img1").addEventListener("click", () => loadLevel("4x4", 'img1'));
document.getElementById("level-5x5-img1").addEventListener("click", () => loadLevel("5x5", 'img1'));

// Инициализация начального уровня
loadLevel("3x3"); 
