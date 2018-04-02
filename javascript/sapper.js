// количество строк
var rowsCount = parseInt($("table.sapper-table").attr("data-rows-count"));
// количество колонок
var columnsCount = parseInt($("table.sapper-table").attr("data-columns-count"));
// количество бомб
var bombCount = parseInt($("table.sapper-table").attr("data-bomb-count"));
// бомбы
var bombs = [];
// секунды таймера
var seconds = 0;
// игра окончена
var gameOver = false;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Случайное число для колонки от 0 до кол-ва столбцов -1
function getRandomColumnIndex() {
    return getRandomInt(0, columnsCount - 1);
}
// Случайное число для строки от 0 до кол-ва строк -1
function getRandomRowIndex() {
    return getRandomInt(0, rowsCount - 1);
}
// Создать бомбу со случайными координатами
function getBomb() {
    return [getRandomRowIndex(), getRandomColumnIndex()];
}
// Проверить существование бомбы по массиву с координатами
function checkBomb(bmb) {
     var exists = false;
     for (var b = 0; b < bombs.length; b++) {
     if (bmb[0] === bombs[b][0] && bmb[1] === bombs[b][1]) {
     exists = true;
     break;
 }
 }
     return exists;
