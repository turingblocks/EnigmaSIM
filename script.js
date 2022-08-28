// Create variables to reference for main DOM elements.
const lightsDiv = document.getElementById('lights');
const keyboardDiv = document.getElementById('keyboard');
const messageDiv = document.getElementById('message');
const positionsDiv = document.getElementById('positions');

// Define arrays.
const qwerty   = "QWERTYUIOPASDFGHJKLZXCVBNM".split('');
const alpha    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
const rotorI   = {
  
  array: "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split(''),
  notch: 11
}
const rotorII  = {
  array: "AJDKSIRUXBLHWTMCQGZNPYFVOE".split(''),
  notch: 4
}
const rotorIII = {
  array:  "BDFHJLCPRTXVZNYEIWGAKMUSQO".split(''),
  notch: 21
}
const reflector = "YRUHQSLDPXNGOKMIEBFZCWVJAT".split('');

// Define Rotors in use - static rotors.
var rotors = {
  rotor0: {
    array: rotorI.array,
    position: 0,
    notch: rotorI.notch
  },
  rotor1: {
    array: rotorII.array,
    position: 0,
    notch: rotorII.notch
  },
  rotor2: {
    array: rotorIII.array,
    position: 0,
    notch: rotorIII.notch
  }
}

// Define inital positions, and empty output array.
var messageArr = [];

// Define a function that simply increments the rotor, and rotates when it hits 25.
var cycle = function(rotor) {
  let currentPos = rotor.position
  let newPos = 0;
  if (currentPos == 25) {
    newPos =  0;
  }
  else {
    newPos = currentPos + 1;
  } 
  return newPos;
}

var rotate = function(rotors) {
  let newRotors = rotors
  newRotors.rotor2.position = cycle(newRotors.rotor2);
  if (newRotors.rotor2.position == newRotors.rotor2.notch) {
    newRotors.rotor1.position = cycle(newRotors.rotor1)
    if (newRotors.rotor1.position == newRotors.rotor1.notch) {
      newRotors.rotor0.position = cycle(newRotors.rotor0)
    }
  }
  return newRotors
}

// Define a function that takes a letter in, as well as a rotor and outputs another letter based on the rotor and position.
var rotorChange = function(letter, rotor) {

// Let the index of our input letter, this is the position in the alphabet.
let index = alpha.indexOf(letter);
// Offset the index by the position of the rotor.
index = ((index + rotor.position) % 26);
let newLetter = rotor.array[index];
let newIndex = alpha.indexOf(newLetter);
newIndex = (newIndex - rotor.position + 26) % 26;
return alpha[newIndex];
}

var rotorBack = function(letter, rotor) {
  let index = alpha.indexOf(letter);
  index = ((index + rotor.position) % 26);
  let newIndex = rotor.array.indexOf(alpha[index]);
  let newLetter = alpha[(newIndex - rotor.position + 26) % 26]
  return newLetter;
}

var reflect = function(letter) {
  let index = alpha.indexOf(letter);
  return reflector[index];
}

var outputLetter = function(key) {
  document.getElementById(key).classList.add('lit');
    setTimeout(function(){
    document.getElementById(key).classList.remove("lit"); 
  }, 300);
  messageArr.push(key[0]);
  messageDiv.innerHTML = '<h1>' + messageArr.join(' ') + '</h1>';
  positionsDiv.innerHTML = '<p> Positions: ' + alpha[rotors.rotor0.position] + ' ' + alpha[rotors.rotor1.position] + ' ' + alpha[rotors.rotor2.position] + '</p>';
}

var handleKeyPress = function(key) {
  rotors = rotate(rotors)
  let newLetter = rotorChange(key, rotors.rotor2);
  newLetter = rotorChange(newLetter, rotors.rotor1);
  newLetter = rotorChange(newLetter, rotors.rotor0);
  newLetter = reflect(newLetter);
  newLetter = rotorBack(newLetter, rotors.rotor0);
  newLetter = rotorBack(newLetter, rotors.rotor1);
  newLetter = rotorBack(newLetter, rotors.rotor2);
// Output new Letter.
  outputLetter(newLetter + 'light');
}

qwerty.map(function(letter){
  var lightText = document.createTextNode(letter);
  var newLight = document.createElement("div");
  newLight.appendChild(lightText);
  newLight.id = letter + 'light';
  newLight.classList.add("light");
  lightsDiv.appendChild(newLight);
});

qwerty.map(function(letter){
  var keyText = document.createTextNode(letter);
  var newKey = document.createElement("div");
  newKey.appendChild(keyText);
  newKey.id = letter + 'key';
  newKey.classList.add("key");
  keyboardDiv.appendChild(newKey);
  newKey.addEventListener("click", function(){
    handleKeyPress(letter)
  });
});

document.addEventListener('keydown', (event) => {
  var keyName = event.key.toUpperCase();
  handleKeyPress(keyName);
});

document.addEventListener('keyup', (event) => {
  const keyName = event.key.toUpperCase() + 'light';
  document.getElementById(keyName).classList.remove("lit")
});