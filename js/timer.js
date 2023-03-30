var gStartTime
var gTimerInterval
var gUpdateSecondsFunc

function startTimer(func) {
  gStartTime = Date.now()
  gTimerInterval = setInterval(updateTimer, 100)
  gUpdateSecondsFunc = func
}

function stopTimer() {
  clearInterval(gTimerInterval)
}

function updateTimer() {
  const elTimer = document.querySelector('.timer')
  const elapsedTime = Date.now() - gStartTime
  const seconds = Math.floor(elapsedTime / 1000)
  elTimer.innerText = `${seconds}`.padStart(3, '0')
  if (gUpdateSecondsFunc) gUpdateSecondsFunc(seconds)
}

function resetTimer() {
  stopTimer()
  const elTimer = document.querySelector('.timer')
  elTimer.innerText = '000'
}
