let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the amplitude of the carrier
let fft; // we'll visualize the waveform
let amplitude, frequency;

function setup() {
  createCanvas(600, 400);
  noFill();
  background(30); // alpha

  carrier = new p5.Oscillator(); // connects to master output by default
  carrier.freq(340);
  carrier.amp(0);
  // carrier's amp is 0 by default, giving our modulator total control

  carrier.start();

  modulator = new p5.Oscillator('triangle');
  modulator.disconnect(); // disconnect the modulator from master output
  modulator.freq(5);
  modulator.amp(1);
  modulator.start();

  // Modulate the carrier's amplitude with the modulator
  // Optionally, we can scale the signal.
  carrier.amp(modulator.scale(-1, 1, 1, -1));

  // create an fft to analyze the audio
  fft = new p5.FFT();
  
  amplitude=createSlider(0,350,0);
  amplitude.position(200,8);
  amplitude.style('width', '200px');
  
  frequency=createSlider(0,5000,0);
  frequency.position(200,25);
  frequency.style('width', '200px');
  
}

function draw() {
  background(30, 130, 130, 100); // alpha

  // map mouseY to moodulator freq between 0 and 20hz
  let modFreq = map(frequency.value(), 0, height, 20, 0);
  modulator.freq(modFreq);

  let modAmp = map(amplitude.value(), 0, width, 0, 1);
  modulator.amp(modAmp, 0.01); // fade time of 0.1 for smooth fading

  // analyze the waveform
  waveform = fft.waveform();

  // draw the shape of the waveform
  drawWaveform();

  drawText(modFreq, modAmp);
}

function drawWaveform() {
  stroke(220);
  strokeWeight(12);
  beginShape();
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, -height / 2, height / 2);
    vertex(x, y + height / 2);
  }
  endShape();
}

function drawText(modFreq, modAmp) {
  strokeWeight(1);
  text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
  text('Modulator Amplitude: ' + modAmp.toFixed(3), 20, 40);
}
