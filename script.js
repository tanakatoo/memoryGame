const gameContainer = document.getElementById("game");
let cardsTurned = 0
let card1Color = ""
let timeout1
let timeout2
let score=0
localStorage.getItem('bestScore')
let shuffledColors=[]

let error=document.querySelector("#error")
const yourScore = document.querySelector("#yourScore")
const bestScore=document.querySelector("#bestScore")
const scoreBoard =document.querySelector("#scoreBoard")
const bestScoreBoard=document.querySelector("#bestScoreBoard")
const playButton=document.querySelector(".startGame")


// const COLORS = [
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "purple",
//   "red",
//   "blue",
//   "green",
//   "orange",
//   "purple"
// ];

//if local storage has a score saved AND if it is not 1000 
if (localStorage.getItem('bestScore') && localStorage.bestScore != '1000') {
  bestScoreBoard.innerText = bestScoreBoard.innerText + ' ' + localStorage.bestScore
  bestScore.innerText = bestScore.innerText + ' ' + localStorage.bestScore
} else {
  localStorage.setItem('bestScore', '1000')
  bestScoreBoard.innerText = ""
  bestScore.innerText = "Play to set best score!"
}

playButton.addEventListener('click', function () {

  if (document.querySelector("#numberOfCards").value < 5 || document.querySelector("#numberOfCards").value > 10 || document.querySelector("#numberOfCards").value=='') {
    error.innerText = "Enter a number be between 5 and 10"
  } else {
    error.innerText = ""
  
    //when start button is clicked, display div
    if (gameContainer.children) {
      //if game is done, then clear everything first
      while (gameContainer.firstChild) {
        gameContainer.firstChild.remove()
      }
      shuffledColors.length = 0 //reset colors
    }
    score = 0 //reset score
  
    yourScore.innerText = "0"; //erase scoreboard
    bestScoreBoard.classList.toggle("hide")
    //create the colors array
    createArray();
    createDivsForColors(shuffledColors);
    playButton.classList.toggle('hide')
  }
})

function createArray() {
  let arrayOfColors=[]
  //create array for the number of pairs the user input
  for (let i = 0; i < document.querySelector("#numberOfCards").value; i++){
    r = Math.floor(Math.random()*256)
    g =Math.floor(Math.random()*256)
    b = Math.floor(Math.random() * 256)
    arrayOfColors.push("rgb(" + r + "," + g + "," + b + ")")
    arrayOfColors.push("rgb(" + r + "," + g + "," + b + ")")
  }
  shuffledColors = shuffle(arrayOfColors);
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {

  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.dataset.turned = false;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  score++;
  yourScore.innerText = score
  //only change if less than 2 cards are turned over 
  //only turn if data says this card has not been turned
  if (event.target.dataset.turned=="false") {
    cardsTurned++
  

    if (cardsTurned < 3) {

      //change the card color
      event.target.style.backgroundColor = event.target.className
      //add data that this card has been turned
      event.target.dataset.turned = true
      //compare the card color
      if (card1Color === event.target.className) {
        //if same color then it means there are 2 cards turned up and leave them turned up and 
        //cancel any timeouts that may have been set
        cardsTurned = 0
        clearTimeout(timeout1)
        clearTimeout(timeout2)
      } else {
        //if a different color, this could be the first card, or the second card
        card1Color = event.target.className
        //start the timer to turn back
        //if first timeout already set then set the 2nd one
        //if the 2nd one already set the set the first one
        if (!timeout1) {
          timeout1 = setMyTimeOut("timeout1", event)
        } else {
          timeout2 = setMyTimeOut("timeout2", event)
        }
      }
    } else {
      //# of cards turned is more than 3, so we don't turn it and turn the counter back down
      cardsTurned--
    }
  }
  //if all cards are turned, display button to restart game
  //check if all the data-turned is true
  const allDiv = document.querySelector("#game").children
  let totalCardsTurned = 0;
  for (let div of allDiv) {

    if (div.dataset.turned == "true") {
      totalCardsTurned++
    }
  }
  if (totalCardsTurned == 10) {
    //display button to play again
    document.querySelector(".startGame").innerText = "Play Again"
    playButton.classList.toggle('hide')
    if (score <  parseInt(localStorage.getItem('bestScore'))) {
      localStorage.setItem('bestScore', score)
      bestScore.innerText = "Best score: " + score
      bestScoreBoard.innerText = 'Best Score: ' + score
    }
    bestScoreBoard.classList.toggle("hide")
  }
}

function setMyTimeOut(name, event) {
  name = setTimeout(function () {
    event.target.style.backgroundColor = "white"
    event.target.dataset.turned=false
    cardsTurned--
    if (cardsTurned === 0) {
      //reset if this is the 2nd card
      card1Color = ""
    }
  }, 1000)
  return name
}