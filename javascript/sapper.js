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
