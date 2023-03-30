var gIsHintClicked = false
const gActiveHints = []

function initCheats() {
  gActiveHints[0] = true
  gActiveHints[1] = true
  gActiveHints[2] = true
}
function onHintClick() {
  if (!gActiveHints[gActiveHints.length - 1] || gGame.isClicksDisabled) return
  if (!gIsHintClicked) {
    lightLightbulbs(gActiveHints)
  } else {
    lightLightbulbs(gActiveHints)
  }
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
