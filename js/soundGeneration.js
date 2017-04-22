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
})
function repeatAfterMe (currentSpeed) {
  if(currentSpeed===0){
    return
  }else{
    instrument.play(EFGA,repeatAfterMe(currentSpeed))
  }
}
