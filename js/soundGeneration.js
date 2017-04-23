// hz values of a c major scale
var cMajor = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]
var cPenta = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
var abcCPenta = ['C,', 'D', 'E', 'G', 'A', 'C\'']




var shimmer = new Instrument({wave: 'sawtooth', cutoff: 1000, release: 4, detune: 0})

window.addEventListener('keydown', function (e) {
  var char = abcCPenta[Math.floor((Math.random() * 6))]
  bass.play(bassNotes[Math.floor((Math.random() * 3))])
})
function speedFunc (currentSpeed) {
  if(currentSpeed==null){
    return
  }else{
    console.log(currentSpeed)
    var instrument = new Instrument({wave: 'square', decay: 0.3, cutoff:700, detune: 0})
    instrument.play({tempo:Math.floor(100*Math.pow(currentSpeed,1/2))},'fga')
  }
}
function bassFunc(moduloValue){
  var bassNotes = ['C,', 'F,', 'G,']
  var bass = new Instrument({wave: 'sine', release: 2, cutoff:1000, detune: 0})
  bass.play(bassNotes[Math.floor((Math.random() * 3))])
}
