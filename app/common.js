/**
 * Created by margaryta.sadovets on 5/31/2017.
 */

var gameTable = {};
var colorSelector = [
    '#338a3e',
    '#f44336',
    '#f9a825',
    '#7b1fa2',
    '#5d4037',
    '#c2185b'
];
var iconSelector = [
    './app/imgs/criss-cross.png',
    './app/imgs/circular.png',
    './app/imgs/check-mark.png',
    './app/imgs/triangular.png',
    './app/imgs/smile.png',
    './app/imgs/hart.png'
];
var players = [];
var Player = function (icon) {
    this.cells = 0;
    this.walls = 0;
    this.icon = icon ||'url(./app/imgs/criss-cross.png)';
};
var whoseTurn = 0;
var wallColor = '#006978';

var GameCellBorder = function (border, cell, relation) {
    this.border = border;
    this.relation = relation;
    this.active = false;
    this.cell = cell;
};

window.onload = function () {

    // generate players
    var playerNumber = 6;
    var statisticDiv = document.getElementsByClassName('statistics-container')[0];
    for (var i = 0; i < playerNumber; i++) {
        players.push(new Player(iconSelector[i]));
        createPlayerDiv(statisticDiv, players[i], i);
    }
    generateScoreContainer();
    var curPlayerDiv = document.getElementById('player-' + whoseTurn);
    curPlayerDiv.className = 'selected-player';

    // generate game field
    var fieldSize = 5;
    generateGameField(fieldSize);
    var borders = document.getElementsByClassName('border');

    for (var i = 0; i < borders.length; i++) {
        borders[i].addEventListener('click', clickOnBorder);
    }
};

function clickOnBorder (event) {
    this.style.background = wallColor;
    var currentBorder = gameTable[this.id];
    var curPlayerDiv = document.getElementById('player-' + whoseTurn);
    if (!currentBorder.active) {
        players[whoseTurn].walls++;
        updateStatistics(curPlayerDiv, players[whoseTurn].walls, players[whoseTurn].cells);
        currentBorder.active = true;
        var relationCellId = currentBorder.relation;
        var relatedBorder = null;
        if (relationCellId != ''){
            relatedBorder = gameTable[relationCellId];
            if (relatedBorder) {
                relatedBorder.border.style.background = wallColor;
                relatedBorder.active = true;
            }
        }
        if (!checkClosedCells(currentBorder) && !checkClosedCells(relatedBorder)) {
            curPlayerDiv.className = 'player';
            whoseTurn = (whoseTurn >= players.length-1) ? 0 : whoseTurn + 1;
            curPlayerDiv = document.getElementById('player-' + whoseTurn);
            curPlayerDiv.className = 'selected-player';
        } else {
            players[whoseTurn].cells++;
            updateStatistics(curPlayerDiv, players[whoseTurn].walls, players[whoseTurn].cells);
        }
    }
}

function generateGameField (fieldSize) {
    var gameField = document.getElementsByClassName('game-field')[0];

    var k = 1;
    for (var j = 1; j < fieldSize * 2; j++) {
        var row = document.createElement('div');
        row.className = 'cells-row';

        for (var c = 0; c < k; c++){

            // create empty cell
            var cell = document.createElement('div');
            cell.className = 'empty-cell';
            cell.id = 'cell-' + j + '-' + c;

            createBorderDiv('top', cell, j, c, fieldSize);

            var cellMainPart = document.createElement('div');
            cellMainPart.className = 'inner-cell';
            cellMainPart.id = 'cell-' + j + '-' + c + '-center';
            cell.appendChild(cellMainPart);
            gameTable['cell-' + j + '-' + c + '-center'] =  cellMainPart;

            createBorderDiv('left', cellMainPart, j, c, fieldSize);
            createBorderDiv('right', cellMainPart, j, c, fieldSize);
            createBorderDiv('bottom', cell, j, c, fieldSize);

            row.appendChild(cell);
        }
        gameField.appendChild(row);
        if (j < fieldSize) {
            k = k + 2;
        } else {
            k = k - 2;
        }
    }
}
function checkClosedCells (border) {
    if (border) {
        var activeBorders = 0;
        for (var item in gameTable) {
            if (gameTable[item].active && gameTable[item].cell == border.cell) {
                activeBorders++;
            }
        }
        if (activeBorders >= 4) {
            var currentCell = document.getElementById(border.cell);
            currentCell.style['background-image'] = 'url(' + players[whoseTurn].icon + ')';
            return true;
        }
    }
    return false;
}

function generateScoreContainer () {
}

function createBorderDiv(borderType, cellObject, rowNumber, cellNumber, fieldSize) {
    var cellId = 'cell-' + rowNumber + '-' + cellNumber;
    var borderCell = document.createElement('div');
    borderCell.className = 'border ' + borderType;
    borderCell.id = cellId + '-' + borderType;
    cellObject.appendChild(borderCell);
    gameTable['cell-' + rowNumber + '-' + cellNumber + '-' + borderType] =  new GameCellBorder(borderCell, cellId, getRelationAddress(rowNumber, cellNumber, borderType, fieldSize));
}
function createPlayerDiv(parentDiv, playerObj, playerId) {
    var playerDiv = document.createElement('div');
    playerDiv.className = 'player';
    playerDiv.id = 'player-' + playerId;
    parentDiv.appendChild(playerDiv);

    var iconDiv = document.createElement('div');
    iconDiv.className = 'icon';
    iconDiv.innerHTML = '<img src="' + playerObj.icon + '">';
    playerDiv.appendChild(iconDiv);

    var statisticDiv = document.createElement('div');
    statisticDiv.className = 'statistic';
    statisticDiv.innerHTML = '<h1>Player ' + (playerId + 1) + '</h1>' +
        '<h3 class="player-statistics">Walls: 0 Cells: 0</h3>';
    playerDiv.appendChild(statisticDiv);
}


function getRelationAddress(rowNumber, cellNumber, borderType, fieldSize) {
    var relationBorderType = borderType;
    var relationAddress = 'cell-';
    var relationCellNumber = cellNumber;

    switch (borderType) {
        case 'top':
            relationBorderType = 'bottom';
            relationCellNumber = (rowNumber <= fieldSize) ? cellNumber - 1 : cellNumber + 1;
            relationAddress = relationAddress + (rowNumber - 1) + '-';
            break;
        case 'bottom':
            relationBorderType = 'top';
            relationCellNumber = (rowNumber < fieldSize) ? cellNumber + 1 : cellNumber - 1;
            relationAddress = relationAddress + (rowNumber + 1) + '-';
            break;
        case 'left':
            relationBorderType = 'right';
            relationAddress = relationAddress + rowNumber + '-';
            relationCellNumber = cellNumber - 1;
            break;
        case 'right':
            relationBorderType = 'left';
            relationAddress = relationAddress + rowNumber + '-';
            relationCellNumber = cellNumber + 1;
            break;
    }
    return relationAddress + relationCellNumber + '-' + relationBorderType;
}
function updateStatistics(currentPlayerDiv, walls, cells) {
    var statisticsDiv = currentPlayerDiv.getElementsByClassName('player-statistics')[0];
    statisticsDiv.innerHTML = 'Walls: ' + walls + ' Cells: ' + cells;
}
