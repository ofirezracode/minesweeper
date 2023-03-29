var emojiState = 'smile'

function updateEmoji(state) {
  if (emojiState === 'dead' || emojiState === 'sunglasses') return

  const elEmoji = document.querySelector('.emoji')

  if (state === 'happy') {
    elEmoji.src = '../assets/happy.png'
    emojiState = 'happy'
  } else if (state === 'smile') {
    elEmoji.src = '../assets/smile.png'
    emojiState = 'smile'
  } else if (state === 'dead') {
    elEmoji.src = '../assets/dead.png'
    emojiState = 'dead'
  } else if (state === 'sunglasses') {
    elEmoji.src = '../assets/sunglasses.png'
    emojiState = 'sunglasses'
  }
}

function resetEmoji() {
  const elEmoji = document.querySelector('.emoji')
  elEmoji.src = '../assets/smile.png'
  emojiState = 'smile'
}

function showVictoryAnnouncement() {
  const victory = document.querySelector('h2')
  victory.style.display = 'block'
  setTimeout(() => {
    victory.classList.add('h2--on-victory')
    setTimeout(() => {
      victory.style = ''
      victory.classList.remove('h2--on-victory')
    }, 1500)
  }, 10)
}
