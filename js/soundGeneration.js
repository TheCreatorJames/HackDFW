
var audiocntx = new window.AudioContext()
// hz values of a c major scale
var cMajor = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
var cPenta = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
window.addEventListener('keydown', function (e) {
  sineNote(0.5, 0)
  brownNoise(0, 0)
})
var sineNote = function (drivingSpeed, moduloValue) {
  var oscillator = audiocntx.createOscillator()
  var gainNode = audiocntx.createGain()
  gainNode.gain.value = drivingSpeed % 1
  gainNode.connect(audiocntx.destination)
  oscillator.connect(gainNode)
  oscillator.type = 'sine'
  oscillator.frequency.value = cPenta[Math.floor((Math.random() * 8))]
  oscillator.start()
  gainNode.gain.setTargetAtTime(0.001, audiocntx.currentTime + 2, 0.5)
  oscillator.stop(audiocntx.currentTime + 5)
}
var bufferSize = 4096
var brownNoise = (function () {
  var lastOut = 0.0
  var node = audiocntx.createScriptProcessor(bufferSize, 1, 1)
  node.onaudioprocess = function (e) {
    var output = e.outputBuffer.getChannelData(0)
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1
      output[i] = (lastOut + (0.02 * white)) / 1.02
      lastOut = output[i]
      output[i] *= 3.5 // (roughly) compensate for gain
    }
  }
  return node
})()

// brownNoise.connect(audiocntx.destination)
