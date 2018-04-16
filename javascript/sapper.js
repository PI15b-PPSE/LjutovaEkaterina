function changeSizeHandler(e) {
    e.preventDefault();
    var button = $(this);
    var attrs = ["data-rows-count", "data-columns-count", "data-bomb-count"];
    for (var i = 0; i < attrs.length; i++) {
        $("table.sapper-table:first").attr(attrs[i], button.attr(attrs[i]));
}
    var columns = parseInt(button.attr("data-columns-count"));
    var width = columns * 30 + 2;
    $("div.panel.sapper-table:first").width(width);
    loadGame();
function loadGame() {
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-refresh").remove();
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-count-icon").remove();
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.timer").remove();
    $("div.panel.sapper-table:first>.panel-heading>.panel-title span.bombs-count").remove();

}
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
