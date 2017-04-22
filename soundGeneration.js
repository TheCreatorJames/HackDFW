
var audiocntx = new window.AudioContext()
// hz values of a c major scale
var cMajor = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]

window.addEventListener('keydown', function (e) {
  sineNote(0.5, 0)
})
var sineNote = function (drivingSpeed, moduloValue) {
  var oscillator = audiocntx.createOscillator()
  var gainNode = audiocntx.createGain()
  gainNode.gain.value = drivingSpeed % 1
  gainNode.connect(audiocntx.destination)
  oscillator.connect(gainNode)
  oscillator.type = 'sine'
  oscillator.frequency.value = cMajor[Math.floor((Math.random() * 8))]
  oscillator.start()
  gainNode.gain.setTargetAtTime(0.001, audiocntx.currentTime + 2, 0.5)
  oscillator.stop(audiocntx.currentTime + 5)
}
