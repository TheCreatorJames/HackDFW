
var audiocntx = new window.AudioContext()
// hz values of a c major scale
var cMajor = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
var cPenta = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
var abcCPenta = ['C,', 'D', 'E', 'G', 'A', 'C\'']

var instrument = new Instrument({wave: 'sine', cutoff: 1000, release: 2, detune: 0})
var shimmer = new Instrument({wave: 'sawtooth', cutoff: 1000, release: 4, detune: 0})
window.addEventListener('keydown', function (e) {
  var char = abcCPenta[Math.floor((Math.random() * 6))]
  instrument.play('[d2f2][ce][df]')
  console.log(char)

  // sineNote(0.5, 0)
  // noiseOn()
})
var sineNote = function (drivingSpeed, moduloValue) {
  var oscillator = audiocntx.createOscillator()
  var gainNode = audiocntx.createGain()
  gainNode.gain.value = drivingSpeed % 1
  gainNode.connect(audiocntx.destination)
  oscillator.connect(gainNode)
  oscillator.type = 'sine'
  oscillator.frequency.value = cPenta[Math.floor((Math.random() * 6))]
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

var noiseOn = function () {
  var brownGain = audiocntx.createGain()
  brownGain.gain.value = 0.5
  brownGain.connect(audiocntx.destination)
  brownNoise.connect(brownGain)
  brownGain.gain.setTargetAtTime(0.001, audiocntx.currentTime + 2, 0.5)
}
