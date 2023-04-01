const EASY_BOARD = { row: 4, col: 4, mines: 2, diff: 'easy' }
const MEDIUM_BOARD = { row: 8, col: 8, mines: 14, diff: 'medium' }
const HARD_BOARD = { row: 12, col: 12, mines: 32, diff: 'hard' }
const MINE = '*'
const MINE_HTML = '<img class="cell--img" src="./assets/bomb.png" />'
const FLAG_HTML = '<img class="cell--img" src="./assets/flag.png" />'

var gLevel = EASY_BOARD
var gBoard
var gGame

onInit()

function onInit() {
  gGame = resetGame()
  resetUI(gLevel.diff)
  resetTimer()
  renderBoard()
  renderMarkedCounter()
  initCheats()
}

function changeDiff(elCell, size) {
  if (size === gLevel.row) return
  if (size === 4) {
    gLevel = EASY_BOARD
  } else if (size === 8) {
    gLevel = MEDIUM_BOARD
  } else if (size === 12) {
    gLevel = HARD_BOARD
  }
  changeHighlightedDiff(elCell)
  changeTablesDiff(gLevel.diff)
  onInit()
}

function resetGame() {
  return {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    isBoardInitialized: false,
    time: 0,
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
    isSafeClick: false,
  }
}

function renderBoard() {
  const selector = '.game-container'
  var strHTML = `<table class="board--${gLevel.diff}"><tbody>`
  for (var i = 0; i < gLevel.row; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gLevel.col; j++) {
      const cell = ''
      const className = `cell cell--board pointer cell-${i}-${j}`

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
  console.log('event,button', event.button)

  if (!gGame.isBoardInitialized) {
    gBoard = buildBoard({ i: i, j: j })
    gGame.isBoardInitialized = true
    startTimer((time) => {
      gGame.time = time
    })
  }

  if (!gGame.isOn || gGame.isClicksDisabled || gBoard[i][j].isShown) return

  console.log('gBoard', gBoard)
  // 0 === left
  if (event.button === 0) {
    handleLeftClick(i, j)
  }
  //2 === right
  else if (event.button === 2) {
    handleRightClick(elCell, i, j)
  }

  if (gGame.shownCount === gLevel.col * gLevel.row) {
    handleVictory()
  }
}

function handleLeftClick(i, j) {
  if (gBoard[i][j].isShown) return
  if (gIsHintClicked) {
    hintRevealCells(i, j)
    return
  } else if (gBoard[i][j].isMine) {
    if (gGame.lives > 0) {
      gGame.lives--
      gGame.isClicksDisabled = true
      shakeScreen()
      setTimeout(() => {
        gGame.isClicksDisabled = false
      }, 1010)
      showHeartLoss()
      hollowHeart(3 - gGame.lives - 1)
      revealCell(i, j)
    } else {
      handleLoss()
    }
  } else {
    if (gBoard[i][j].isSafeClick) {
      gBoard[i][j].isSafeClick = false
      const elCell = document.querySelector(`.cell-${i}-${j}`)
      elCell.classList.remove('cell--board--marked-safe')
    }
    revealCells(i, j)
  }
}
function handleRightClick(elCell, i, j) {
  if (gBoard[i][j].isMarked) {
    elCell.innerHTML = ''
    gBoard[i][j].isMarked = false
    gBoard[i][j].isShown = false
    gGame.markedCount--
    gGame.shownCount--
  } else {
    elCell.innerHTML = FLAG_HTML
    gBoard[i][j].isMarked = true
    gBoard[i][j].isShown = true
    gGame.markedCount++
    gGame.shownCount++
  }
  renderMarkedCounter()
}
function onHintClick() {
  if (gGame.isClicksDisabled || !gGame.isOn) return
  triggerHints()
}
function onSafeClick() {
  if (gGame.isClicksDisabled || !gGame.isOn || !gGame.isBoardInitialized) return
  markSafeClick(gBoard)
}
function hintRevealCells(row, col) {
  gGame.isClicksDisabled = true
  const cells = []
  for (var i = row - 1; i <= row + 1; i++) {
    if (i < 0 || i > gBoard.length - 1) continue
    for (var j = col - 1; j <= col + 1; j++) {
      if (j < 0 || j > gBoard[i].length - 1 || gBoard[i][j].isShown) continue
      const location = { i: i, j: j }
      const value = gBoard[i][j].isMine ? MINE_HTML : gBoard[i][j].minesAroundCount
      cells.push(location)
      renderCell(location, value)
    }
  }
  setTimeout(() => {
    hideCells(cells)
    gGame.isClicksDisabled = false
    onHintClick()
    reduceActiveHints()
  }, 1000)
}
function revealCells(row, col) {
  if (gBoard[row][col].isShown) return
  revealCell(row, col)
  if (gBoard[row][col].minesAroundCount > 0) {
    return
  } else if (gBoard[row][col].minesAroundCount === 0) {
    for (var i = row - 1; i <= row + 1; i++) {
      if (i < 0 || i > gBoard.length - 1) continue
      for (var j = col - 1; j <= col + 1; j++) {
        if (j < 0 || j > gBoard[i].length - 1 || (i === row && j === col)) continue
        revealCells(i, j)
      }
    }
  }
}
function revealCell(row, col) {
  const value = gBoard[row][col].isMine ? MINE_HTML : gBoard[row][col].minesAroundCount
  renderCell({ i: row, j: col }, value)
  gBoard[row][col].isShown = true
  gGame.shownCount++
  return
}
function hideCells(cells) {
  for (var i = 0; i < cells.length; i++) {
    renderCell(cells[i], '')
  }
}

function handleLoss() {
  stopTimer()
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

  const bestTime = localStorage.getItem(gLevel.diff)
  if (!bestTime || bestTime > gGame.time) {
    localStorage.setItem(gLevel.diff, gGame.time)
    renderValue('.score', gGame.time)
  }
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
