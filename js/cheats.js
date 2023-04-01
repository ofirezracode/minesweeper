var gIsHintClicked
const gActiveHints = []
var gSafeClicksRemaining
var gIsSafeClickActive
var gSafeClickTimeout

function initCheats() {
  gActiveHints[0] = true
  gActiveHints[1] = true
  gActiveHints[2] = true
  gIsHintClicked = false
  gSafeClicksRemaining = 3
  gIsSafeClickActive = false
  renderValue('.safe-clicks-remaining', gSafeClicksRemaining)
}
function triggerHints() {
  if (!gActiveHints[gActiveHints.length - 1]) return
  lightLightbulbs(gActiveHints)
  gIsHintClicked = !gIsHintClicked
}
function reduceActiveHints() {
  for (var i = 0; i < gActiveHints.length; i++) {
    if (gActiveHints[i]) {
      gActiveHints[i] = false
      hollowLightbulb(i)
      return
    }
  }
}
function markSafeClick(board) {
  if (gSafeClicksRemaining <= 0 || gIsSafeClickActive) return
  gIsSafeClickActive = true
  const possibleCells = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (!board[i][j].isShown && !board[i][j].isMine) {
        possibleCells.push({ i, j })
      }
    }
  }
  if (possibleCells.length <= 0) return
  const location = possibleCells[getRandomInt(0, possibleCells.length)]
  board[location.i][location.j].isSafeClick = true
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.classList.add('cell--board--marked-safe')
  const elbtn = document.querySelector('.safe-click-btn')
  elbtn.classList.add('blocked')
  gSafeClickTimeout = setTimeout(() => {
    gIsSafeClickActive = false
    if (gSafeClicksRemaining > 0) elbtn.classList.remove('blocked')
    if (board[location.i][location.j].isShown) return
    elCell.classList.remove('cell--board--marked-safe')
  }, 2000)

  gSafeClicksRemaining--
  renderValue('.safe-clicks-remaining', gSafeClicksRemaining)
}
