$(document).ready(function () {
    $(document).delegate("button[data-toggle='change-size']", "click", changeSizeHandler);
    loadGame();
});
function changeSizeHandler(e) {
    e.preventDefault();
    var button = $(this);
    var attrs = ["data-rows-count", "data-columns-count", "data-bomb-count"];
    for (var i = 0; i < attrs.length; i++) {
        $("table.sapper-table:first").attr(attrs[i], button.attr(attrs[i]));
    }
    //кол-во столбцов
    var columns = parseInt(button.attr("data-columns-count"));
    //установки ширины между столбцами
    var width = columns * 30+2;
    $("div.panel.sapper-table:first").width(width);
    loadGame();
}
/*
*Функция для инициализации элементов и переменных игры
*
*/
function loadGame() {
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-refresh").remove();
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-count-icon").remove();
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.timer").remove();
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-count").remove();
    // количество строк
    var rowsCount = parseInt($("table.sapper-table").attr("data-rows-count"));
    // количество колонок
    var columnsCount = parseInt($("table.sapper-table").attr("data-columns-count"));
    // количество бомб
    var bombCount = parseInt($("table.sapper-table").attr("data-bomb-count"));
    //массив бомб
    var bombs = [];
    // секунды таймера
    var seconds = 0;
    // игра окончена
    var gameOver = false;
    /**
    * Функция для рандомизации строк/столбцов
    *
    *метод random даст равномерное распределение
    *
    */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /*
    *Функция для получения случайного числа для колонки
    *
    число будет в диапазоне от 0 до кол-во столбцов-1
    *
    */
    function getRandomColumnIndex() {
        return getRandomInt(0, columnsCount - 1);
    }
     /*
    *Функция для получения случайного числа для столбца
    *
    число будет в диапазоне от 0 до кол-во колонок-1
    *
    */
    function getRandomRowIndex() {
        return getRandomInt(0, rowsCount - 1);
    }
//функция для создания бомбы со случайными координатами
/**
* @return возвращает случайное число колонок и строк
*/
// Создать бомбу со случайными координатами
function getBomb() {
        return [getRandomRowIndex(), getRandomColumnIndex()];
}
/*
*Функция для проверки существование бомбы
*
проверяются координаты по массиву
если бомба существует флаг = true
*
*/
function checkBomb(bmb) {
        //флаг существования бомбы
        var exists = false;
        for (var b = 0; b < bombs.length; b++) {
        if (bmb[0] === bombs[b][0] && bmb[1] === bombs[b][1]) {
                exists = true;
                break;
            }
        }
        return exists;
}
/*
*Функция для получения ячейки
*
*/
function getCell(ri, ci) {
        var row = $("table.sapper-table>tbody>tr")[ri];
        var cell = $(row).find("td > div")[ci];
        return $(cell);
}
/*
*Функция для проверки ячейки,что она еще не открыта
*
*/    
function checkCell(cell) {
        return cell.hasClass("cell-closed") && cell.attr("data-flag") === undefined;
}
/*
*Функция для установки окончания игры
*
*/ 
    function setGameOver() {
        gameOver = true;
        var table = $("table.sapper-table:first");
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("colspan", columnsCount);
        td.setAttribute("class", "game-over");
        td.innerHTML = "Game Over";
        tr.appendChild(td);
        table.append(tr);
    }
/*
*Функция для проверки ячейки вокруг текущей ячейки с указанными координатами
*
*/    
function lookAround(ri, ci, funct) {
        //первая строка
        var beginRowIndex = ri === 0 ? 0 : ri - 1;
        //последняя строка
        var endRowIndex = ri === rowsCount - 1 ? rowsCount - 1 : ri + 1;
        //первая колонка
        var beginColumnIndex = ci === 0 ? 0 : ci - 1;
        //последняя колонка
        var endColumnIndex = ci === columnsCount - 1 ? columnsCount - 1 : ci + 1;
        //проход по строкам
        for (var bri = beginRowIndex; bri <= endRowIndex; bri++) {
            //проход по столбцам
            for (var bci = beginColumnIndex; bci <= endColumnIndex; bci++) {
                if (ri === bri && ci === bci) {
                    continue;
                }
                funct(bri, bci);
            }
        }
}
/*
*Функция для очистки ячейки вокруг с проверкой вокруг пустых ячеек
*
*/
function clearAround(cell, ri, ci) {
        lookAround(ri, ci, function (ri2, ci2) {
            var cell2 = getCell(ri2, ci2);
            if (checkCell(cell2)) {
            clearCell(cell2);
            //если ячейка пустая, очистить ячейки вокруг иначе
            if (countBombsAround(ri2, ci2) === 0) {
                    clearAround(cell2, ri2, ci2);
             } 
             else {
                    //иначе вызов функции подсчета кол-ва бомб возле текущей ячейки
                    drawNumber(cell2, ri2, ci2);
             }
             }
          });
}
/*
*Функция для подсчёта кол-ва бомб вокруг ячейки по её координатам
*
*возвращает кол-во бомб
*/ 
function countBombsAround(ri, ci) {
        //счетчик
        var count = 0;
        //проход по циклу
        for (var bi = 0; bi < bombCount; bi++) {
            //нахождение бомбы
        var bomb = bombs[bi];
            //если бомба находится возле текущей ячейки, приплюсовываем к счетчику
            if (bomb[0] > ri - 2 && bomb[0] < ri + 2 && bomb[1] > ci - 2 && bomb[1] < ci + 2) {
                count++;
            }
        }
        return count;
}
/*
*Функция для отрисовки бомбы в ячейке
*
*/
function drawBomb(ri, ci) {
        //получение ячейки
        var cell = getCell(ri, ci);
        //очистка ячейки
        clearCell(cell);
        cell.removeClass("glyphicon-map-marker")
            .removeClass("cell-closed")
            .removeAttr("data-flag")
            .addClass("glyphicon")
            .addClass("glyphicon-remove-sign")
            //добавление бомбы
            .addClass("cell-bomb");
}
/*
*Функция для отображения всех бомб 
*
*все бомбы отображаются при проигрыше
*
*/ 
function drawAllBombs() {
   for (var q = 0; q < bombs.length; q++) {
   drawBomb(bombs[q][0], bombs[q][1]);
   }
   //функция отображения проигрыша
   displayLose();
}
/*
*Функция очистки ячейки
*
*/
function clearCell(cell) {
        if (!checkCell(cell)) {
            return;
        }
        cell.removeClass("cell-closed");
}
/*
*Функция подсчета кол-ва оставшихся закрытых ячеек
*
*/ 
function checkClosedCells() {
        //сравнение ячеек с количеством бомб
        if ($("table.sapper-table > tbody > tr > td > div.cell-closed").length === bombCount) {
        //отображение выигрыша
        displayWin();
        }
}
/*
*Функция определения числа кол-ва бомб вокруг ячейки
*
*/   
function drawNumber(cell, ri, ci) {
        // подсчитаем количество бомб вокруг ячеек
        var count = countBombsAround(ri, ci);
        console.log("count=", count);
        // очистим ячейку
        clearCell(cell);
        if (count > 0) {
            // если вокруг есть бомбы, то рисуем цифру
            cell.text(count);
            cell.addClass("cell-number")
                .addClass("number" + count);
        } else {
            // иначе очищаем ячейки вокруг
            clearAround(cell, ri, ci);
        }
        checkClosedCells();
}
/*
*Функция для добавления отметки бомбы(флаг)
*
*/
function addFlag(cell) {
        if (cell.attr("data-flag") === "true") {
            cell.removeClass("glyphicon")
                .removeClass("glyphicon-map-marker")
                .removeAttr("data-flag");
        } else {
            if (getCountNotMarkedBombs() <= 0) {
                return false;
            }
            cell.addClass("glyphicon")
                .addClass("glyphicon-map-marker")
                .attr("data-flag", "true");
        }
        displayCountBombs();
}
/*
*Функция для создания бомбы
*
*/
    function createBombs(firstCell) {
        bombs = [];
        for (var i = 0; i < bombCount; i++) {
            var bomb = getBomb();
            // если бомба с такими координатами уже есть, то пересоздадим
            while (checkBomb(bomb) || bomb[0] === firstCell[0] && bomb[1] === firstCell[1]) {
                bomb = getBomb();
            }
            bombs.push(bomb);
        }
    }
/*
*Обработчик первого клика мыши по любой ячейки
*
*после нажатия начинается игра и запускается таймер
*/
function firstClick(firstCell) {
        if ($("table.sapper-table[data-timer]").length < 1) {
            //создание бомб
            createBombs(firstCell);
            //запуск таймера
            startTimer();
        }
}
/*
*Функция обновления время на таймере
*
*/
function updateTimer() {
     if (gameOver) {
     stopTimer();
     return;
     }
     var date = new Date(seconds * 1000);
     var span = $("div.panel.sapper-table:first>.panel-heading>.panel-title span.timer");
     span.text(date.toTimeString().substr(3, 5));
     if ($("table.sapper-table[data-timer]").length < 1) {
     return;
     }
     seconds++;
     setTimeout(updateTimer, 1000);
    }
/*
*Функция запуска таймера
*
*/
function startTimer() {
        seconds = 0;
        gameOver = false;
        $("table.sapper-table").attr("data-timer", "true");
        updateTimer();
}
/*
*Функция остановки таймера
*
*/
function stopTimer() {
    $("table.sapper-table").removeAttr("data-timer");
}

/*
*Функция подсчета кол-ва оставшихся маркеров(помеченных ячеек)
*
*/
    function getCountNotMarkedBombs() {
        var count = bombCount - $("table.sapper-table:first>tbody>tr>td>div[data-flag]").length;
        return count;
    }
/*
*Функция для отображения оставшиегося кол-ва бомб
*
*/
    function displayCountBombs() {
        //переменная,содержащая оставшееся кол-во бомб
        var span = $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-count");
        //вывод этого кол-ва
        span.text(getCountNotMarkedBombs());
    }
/*
*Функция для отображения победы
*
*/
function displayWin() {
        stopTimer();
        var spanWin = document.createElement("span");
        $(spanWin).addClass("text-win").text("You win!");
        $("div.panel.sapper-table:first>.panel-heading>.panel-title").append(spanWin);
        setGameOver();
}
/*
*Функция для отображения проигрыша
*
*/
function displayLose() {
        //остановка таймера
        stopTimer();
        //создание элемента для отображения проигрыша в таблице ячеек
        var spanLose = document.createElement("span");
        $(spanLose).addClass("text-lose").text("You lose!");
        $("div.panel.sapper-table:first>.panel-heading>.panel-title").append(spanLose);
        //вызов функции проигрыша
        setGameOver();
}
/*
*Обработчик отпускания кнопок мыши с координатами ячейки
*
*/    
function mouseHandlerFactory(rowIndex, colIndex) {
        return function (e) {
        var cell = $(this);
        document.onmouseup = undefined;
        console.log("mouseup");
        console.log("button", e.button);
        switch (e.button) {
        case 0:
        leftButtonHandler(cell, rowIndex, colIndex);
        break;
        case 2:
        rigthButtonHandler(cell);
        break;
            }
        };
}
/*
*Обработчик клика правой кнопки мыши
*/    
function rigthButtonHandler(cell) {
        if (!cell.hasClass("cell-closed")) {
            return;
        }
        addFlag(cell);
}
/*
*Обработчик нажатия кнопки мыши над ячейкой
*
*/
function mousedownHandler(e) {
        console.log("mousedown");
        if (e.button === 0) {
            var cell = $(this);
            cell.removeClass("cell-closed");
            document.onmouseup = function () { cell.addClass("cell-closed"); };
        }
}
/*
*Обработчик нажатия левой кнопки мыши
*
*/
function leftButtonHandler(cell, rowIndex, colIndex) {
        var coord = [rowIndex, colIndex];
        // проверка первого клика для создания бомб
        firstClick(coord);
        // Если на ячейке стоит метка, то выйдем
        if (cell.attr("data-flag") === "true") {
            return;
        }
        // проверим нажатую ячейку на существование бомбы в ней
        if (checkBomb(coord)) {
            // покажем все бомбы
            drawAllBombs();
        } else {
            // нарисуем цифру или очистим ячейки
            drawNumber(cell, rowIndex, colIndex);
        }
}
    function crtElm(tag) {
        return document.createElement(tag);
    }
/*
*Функция создания игрового поля
*
*Расставление индексов в ячейках и установление обработчиков нажатий мыши
*
*/
    function createField() {
        var table = $("table.sapper-table:first");
        table.html("");
        seconds = 0;
        stopTimer();
        updateTimer();
        var tbody = crtElm("tbody");
        for (var j = 0; j < rowsCount; j++) {
            var tr = document.createElement("tr");
            for (var k = 0; k < columnsCount; k++) {
                var td = crtElm("td");
                var cell = crtElm("div");
                $(cell).addClass("cell-closed");
                // Устанавливаем обработчик кнопок мыши
                cell.onmouseup = mouseHandlerFactory(j, k);
                cell.onmousedown = mousedownHandler;
                cell.oncontextmenu = function (e) { e.preventDefault(); };
                td.appendChild(cell);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.append(tbody);
        // Создадим или обновим счётчик оставшихся бомб
        var spanCountBombs = $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-count");
        if (spanCountBombs.length < 1) {
            var spanCbIcon = crtElm("span");
            $(spanCbIcon).addClass("glyphicon")
                .addClass("glyphicon-remove-sign")
                .addClass("bombs-count-icon");
            var spanCb = crtElm("span");
            $(spanCb).addClass("bombs-count").text(bombCount);
            $("div.panel.sapper-table:first>.panel-heading>.panel-title").append(spanCbIcon);
            $("div.panel.sapper-table:first>.panel-heading>.panel-title").append(spanCb);

        } else {
            spanCountBombs.text(getCountNotMarkedBombs());
        }
        // Создадим отображения таймера
        var spanTimer = $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-refresh");
        if (spanTimer.length < 1) {
            var spTmr = crtElm("span");
            $(spTmr).addClass("timer");
            $("div.panel.sapper-table:first>.panel-heading>.panel-title").append(spTmr);
        }
        $("div.panel.sapper-table:first>.panel-heading>.panel-title span.text-win").remove();
        $("div.panel.sapper-table:first>.panel-heading>.panel-title span.text-lose").remove();
        // Кнопка новой игры
        var spanRefresh = $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-refresh");
        if (spanRefresh.length < 1) {
            var spRfsh = crtElm("span");
            $(spRfsh).addClass("pull-right")
                .addClass("glyphicon")
                .addClass("glyphicon-repeat")
                .addClass("bombs-refresh")
                .click(createField);
            $("div.panel.sapper-table:first>.panel-heading>.panel-title").append(spRfsh);
        }
    }
    //создание игрового поля
    createField();
}
