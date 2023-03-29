const EASY_BOARD = { row: 4, col: 4, mines: 2 }
const MEDIUM_BOARD = { row: 8, col: 8, mines: 14 }
const HARD_BOARD = { row: 12, col: 12, mines: 32 }
const MINE = '*'
const MINE_HTML = '<img class="cell--img" src="./assets/bomb.png" />'
const FLAG_HTML = '<img class="cell--img" src="./assets/flag.png" />'

var gLevel = EASY_BOARD
var gBoard
var gGame

onInit()

function onInit() {
  gGame = resetGame()
  resetUI()
  resetTimer()
  renderBoard()
  renderMarkedCounter()
}

function resetGame() {
  return {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    initializedBoard: false,
    cheats: false,
    isClicksDisabled: false,
    lives: 3,
  }
}

function buildBoard(ignoreLocation) {
  const board = []
  const mat = createMat(gLevel.row, gLevel.col)
  placeMines(mat, ignoreLocation)
  for (var i = 0; i < gLevel.row; i++) {
    board.push([])
    for (var j = 0; j < gLevel.col; j++) {
      board[i][j] = buildCell(mat, i, j)
    }
  }
  return board
}
function placeMines(mat, ignoreLocation) {
  if (gLevel.mines > mat.length * mat[0].length) return
  for (var i = 0; i < gLevel.mines; i++) {
    var row = getRandomInt(0, mat.length)
    var col = getRandomInt(0, mat[0].length)
    if (mat[row][col] === MINE || (row === ignoreLocation.i && col === ignoreLocation.j)) {
      i--
    } else {
      mat[row][col] = MINE
    }
  }
}
function buildCell(mat, row, col) {
  const minesAroundCount = getAmountOfNeighboursContaining(mat, row, col, MINE)
  const isMine = mat[row][col] === MINE
  return {
    minesAroundCount: minesAroundCount,
    isShown: false,
    isMine: isMine,
    isMarked: false,
  }
}

function renderBoard() {
  const selector = '.game-container'
  var strHTML = '<table class="board"><tbody>'
  for (var i = 0; i < gLevel.row; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.col; j++) {
      const cell = ''
      const className = `cell cell--board cell-${i}-${j}`

      strHTML += `<td class="${className}" onclick="onCellClicked(event,this, ${i}, ${j})" oncontextmenu="onCellClicked(event,this, ${i}, ${j})">${cell}</td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>'

  const elContainer = document.querySelector(selector)
  elContainer.innerHTML = strHTML
}
function renderMarkedCounter() {
  const elMarkedCounter = document.querySelector('.marked')
  const count = gLevel.mines - gGame.markedCount
  if (count < 0) {
    elMarkedCounter.classList.add('marked--overflow')
  } else {
    elMarkedCounter.classList.remove('marked--overflow')
  }
  elMarkedCounter.innerText = count
}

function onCellClicked(event, elCell, i, j) {
  event.preventDefault()

  if (!gGame.initializedBoard) {
    gBoard = buildBoard({ i: i, j: j })
    gGame.initializedBoard = true
    startTimer()
  }

  if (!gGame.isOn || gGame.isClicksDisabled || gBoard[i][j].isShown) return

  // 0 === left
  if (event.button === 0) {
    handleLeftClick(elCell, i, j)
  }
  //2 === right
  else if (event.button === 2) {
    handleRightClick(elCell, i, j)
  }
}

function handleLeftClick(elCell, i, j) {
  if (gBoard[i][j].isMine) {
    if (gGame.lives > 0) {
      gGame.lives--
      gGame.isClicksDisabled = true
      shakeScreen()
      setTimeout(() => {
        gGame.isClicksDisabled = false
      }, 1010)
      showHeartLoss()
      hollowHeart(3 - gGame.lives - 1)
    } else {
      handleLoss()
    }
  } else {
    elCell.innerHTML = gBoard[i][j].minesAroundCount
    gBoard[i][j].isShown = true
    gGame.shownCount++
    if (gGame.shownCount === gLevel.col * gLevel.row - gLevel.mines) {
      handleVictory()
    }
  }
}
function handleRightClick(elCell, i, j) {
  if (gBoard[i][j].isMarked) {
    elCell.innerHTML = ''
    gBoard[i][j].isMarked = false
    gGame.markedCount--
  } else {
    elCell.innerHTML = FLAG_HTML
    gBoard[i][j].isMarked = true
    gGame.markedCount++
  }
  renderMarkedCounter()
}

function handleLoss() {
  setValueAllMines('show')
  updateEmoji('dead')
  gGame.isOn = false
}
function handleVictory() {
  stopTimer()
  setValueAllMines('flag')
  updateEmoji('sunglasses')
  gGame.isOn = false
  showVictoryAnnouncement()
}

function setValueAllMines(value) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].isMine) {
        var html
        if (value === 'show') {
          html = MINE_HTML
        } else if (value === 'flag') {
          html = FLAG_HTML
        }
        renderCell({ i: i, j: j }, html)
      }
    }
  }
}

// function renderBoard() {
//   const selector = '.game-container'
//   var strHTML = '<table><tbody>'
//   for (var i = 0; i < gBoard.length; i++) {
//     strHTML += '<tr>'
//     for (var j = 0; j < gBoard[0].length; j++) {
//       const cell = gBoard[i][j].isMine ? MINE_HTML : gBoard[i][j].minesAroundCount
//       const className = `cell cell-${i}-${j}`

//       strHTML += `<td class="${className}">${cell}</td>`
//     }
//     strHTML += '</tr>'
//   }
//   strHTML += '</tbody></table>'

//   const elContainer = document.querySelector(selector)
//   elContainer.innerHTML = strHTML
// }
