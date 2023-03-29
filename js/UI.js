var emojiState = 'smile'

function updateEmoji(state) {
  if (emojiState === 'dead' || emojiState === 'sunglasses') return

  const elEmoji = document.querySelector('.emoji')

  if (state === 'happy') {
    elEmoji.src = './assets/happy.png'
    emojiState = 'happy'
  } else if (state === 'smile') {
    elEmoji.src = './assets/smile.png'
    emojiState = 'smile'
  } else if (state === 'dead') {
    elEmoji.src = './assets/dead.png'
    emojiState = 'dead'
  } else if (state === 'sunglasses') {
    elEmoji.src = './assets/sunglasses.png'
    emojiState = 'sunglasses'
  }
}

function resetUI() {
  _resetEmoji()
  _resetHearts()
}

function _resetEmoji() {
  const elEmoji = document.querySelector('.emoji')
  elEmoji.src = './assets/smile.png'
  emojiState = 'smile'
}

function _resetHearts() {
  const elHearts = document.querySelectorAll('.hearts .heart')
  for (var i = 0; i < elHearts.length; i++) elHearts[i].src = './assets/heart-filled.png'
}

function showVictoryAnnouncement() {
  const elVictory = document.querySelector('h2')
  elVictory.style.display = 'block'
  setTimeout(() => {
    elVictory.classList.add('h2--on-victory')
    setTimeout(() => {
      elVictory.style = ''
      elVictory.classList.remove('h2--on-victory')
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
  const elHearts = document.querySelectorAll('.hearts .heart')
  elHearts[i].src = './assets/heart-hollow.png'
}

function shakeScreen() {
  const elMain = document.querySelector('main')
  elMain.classList.add('animate--shake')
  setTimeout(() => {
    elMain.classList.remove('animate--shake')
  }, 1000)
}
