const SMILEY_HAPPY = './assets/happy.png'
const SMILEY_SMILE = './assets/smile.png'
const SMILEY_DEAD = './assets/dead.png'
const SMILEY_SUNGLASSES = './assets/sunglasses.png'
const HEART_FILLED = './assets/heart-filled.png'
const HEART_HOLLOW = './assets/heart-hollow.png'
const LIGHTBULB_FILLED_PATH = './assets/lightbulb-filled.png'
const LIGHTBULB_HOLLOWED_PATH = './assets/lightbulb-hollow.png'
var emojiState = 'smile'
var gIsCheatsScreenVisible = false

function updateEmoji(state) {
  if (emojiState === 'dead' || emojiState === 'sunglasses') return

  const elEmoji = document.querySelector('.emoji')

  if (state === 'happy') {
    elEmoji.src = SMILEY_HAPPY
    emojiState = 'happy'
  } else if (state === 'smile') {
    elEmoji.src = SMILEY_SMILE
    emojiState = 'smile'
  } else if (state === 'dead') {
    elEmoji.src = SMILEY_DEAD
    emojiState = 'dead'
  } else if (state === 'sunglasses') {
    elEmoji.src = SMILEY_SUNGLASSES
    emojiState = 'sunglasses'
  }
}

function resetUI() {
  _resetEmoji()
  _resetHearts()
}

function _resetEmoji() {
  const elEmoji = document.querySelector('.emoji')
  elEmoji.src = SMILEY_SMILE
  emojiState = 'smile'
}

function _resetHearts() {
  const elHearts = document.querySelectorAll('.hearts .icon')
  for (var i = 0; i < elHearts.length; i++) elHearts[i].src = HEART_FILLED
}

function showVictoryAnnouncement() {
  const elVictory = document.querySelector('.victory')
  elVictory.style.display = 'block'
  setTimeout(() => {
    elVictory.classList.add('indicator-victory')
    setTimeout(() => {
      elVictory.style = ''
      elVictory.classList.remove('indicator-victory')
    }, 1500)
  }, 10)
}

function showHeartLoss() {
  const elHeart = document.querySelector('.indicator--heart')
  elHeart.style.display = 'block'
  setTimeout(() => {
    elHeart.classList.add('indicator--heart--on-victory')
    setTimeout(() => {
      elHeart.style = ''
      elHeart.classList.remove('indicator--heart--on-victory')
    }, 1500)
  }, 10)
}

function hollowHeart(i) {
  const elHearts = document.querySelectorAll('.hearts .icon')
  elHearts[i].src = HEART_HOLLOW
}

function shakeScreen() {
  const elMain = document.querySelector('main')
  elMain.classList.add('animate--shake')
  setTimeout(() => {
    elMain.classList.remove('animate--shake')
  }, 1000)
}

function changeHighlightedDiff(elCell) {
  const elDiffs = document.querySelectorAll('.difficulty-table .cell')
  for (var i = 0; i < elDiffs.length; i++) {
    elDiffs[i].classList.remove('chosen-diff')
  }
  elCell.classList.add('chosen-diff')
}

function changeTablesDiff(diff) {
  console.log(diff)
  const elInfoTable = document.querySelector('.info-table')
  elInfoTable.classList.remove('info-table--easy')
  elInfoTable.classList.remove('info-table--medium')
  elInfoTable.classList.remove('info-table--hard')
  elInfoTable.classList.add(`info-table--${diff}`)
  const elHeartsTable = document.querySelector('.hearts')
  elHeartsTable.classList.remove('hearts--easy')
  elHeartsTable.classList.remove('hearts--medium')
  elHeartsTable.classList.remove('hearts--hard')
  elHeartsTable.classList.add(`hearts--${diff}`)
  if (gIsCheatsScreenVisible) toggleCheatsScreen(true)
}

function toggleCheatsScreen() {
  const elCheatsScreen = document.querySelector('.cheats')
  if (gIsCheatsScreenVisible) {
    elCheatsScreen.classList.remove('reveal-cheats')
    setTimeout(() => {
      elCheatsScreen.classList.toggle('hide')
    }, 300)
  } else {
    elCheatsScreen.classList.toggle('hide')
    console.log('here')
    setTimeout(() => {
      elCheatsScreen.classList.add('reveal-cheats')
    }, 10)
  }
  gIsCheatsScreenVisible = !gIsCheatsScreenVisible
}

function lightLightbulbs(activeHints) {
  const hints = document.querySelectorAll('.hint')
  for (var i = 0; i < hints.length; i++) {
    hints[i].classList.toggle('hint-clicked')
    if (activeHints[i]) {
      hints[i].classList.toggle('hint-clicked--background')
    }
  }
}
function hollowLightbulb(index) {
  const hints = document.querySelectorAll('.hint')
  hints[index].src = LIGHTBULB_HOLLOWED_PATH
}

function renderValue(selector, value) {
  const element = document.querySelector(selector)
  element.innerText = value
}
