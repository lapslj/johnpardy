class Clue{
    constructor(cKey,question,answer,showing = "null"){
        this.cKey = cKey;
        this.question = question;
        this.answer = answer;
        this.showing = showing;
        }
}

class Game{
    constructor(height = 5,width=6){
        this.height = height;
        this.width = width;
        this.makeBoard();
        this.makeHtmlBoard();
    }

    makeBoard(){
        this.board = [];
        for (let y = 0; y < this.height; y++) {
          this.board.push(Array.from({ length: this.width })); //destructuring a number, width, into an array 
        }
      }
    
    makeHtmlBoard(){
    const docBoard = document.getElementById('jeopardy');
    docBoard.innerHTML = '' //clear inner table
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    for (let x = 0; x < this.width; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', "c"+x);
    top.append(headCell);
    }

  docBoard.append(top);

  // make main part of board
  for (let y = 0; y < this.height; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.width; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `c${x}-${y}`);
      cell.innerText = "?"
      row.append(cell);
    }

    docBoard.append(row);
  }
}

}

//next: get randFive to spit out a Game object with 5 categories, 5 Clues each
//then we map those categories onto the DOM


//generate a random array of 5 numbers
function ranGen(max){
    let rArray = []
    if(max <= 5) {return [0,1,2,3,4]}
    else{
    for(let i=0;i<5;i++){
        let gen = Math.floor(Math.random()*max)
        rArray.push(gen)
    }
    return rArray
}
}

//generate a random UNIQUE array of 5 numbers (fails at 100 tries)
function ranArray(max){
    for (let i = 0; i <10; i++){
        let rArray = ranGen(max)
        if (rArray.length === new Set(rArray).size) //ensures that everything generated was unique
        {return rArray}
    }
    
}

async function catClues(id,cVal){
    let response = await axios.get("https://jservice.io/api/category?id="+id) //returning 1 category object
    //right here we need to stop if there's less than 5 clues
    let allClues = response.data.clues //store all the clues in an array
    console.log(response)
    // generate 5 random clues
    let cluesTotal = response.data.clues.length //store how many clues there are
    let clueVals = ranArray(cluesTotal) //array of 5 random numbers within the length of how many clues there are
    console.log(cluesTotal)
    console.log(clueVals)
    let jCat = {}
    jCat.catname = (response.data.title).toUpperCase()
    for(let i=0;i<5;i++){
        let cIndex = clueVals[i]
        let tClue = allClues[cIndex]
        console.log(tClue)
        let cKey = `c-${cVal}-${i}`
        try{let uClue = new Clue(cKey,tClue.question,tClue.answer)
        let qname = "q"+i
        jCat[qname] = uClue}
        catch{let uClue = new Clue(cKey,"[question missing]","n/a")
        let qname = "q"+i
        jCat[qname] = uClue}
    }
    console.log(jCat) //return 5 category names and 5 clues from each category, sort by value
    return jCat
}

//randfive returns an array of 5 random categories and 5 of their clues
async function randFive(){
    let categories = []
    let nums = [...ranArray(5000),...ranArray(5000)];
    for (let i = 0;i < 6; i++){
        categories.push(await catClues(nums[i],i))
    }
    console.log("here's our categories")
    console.log(categories)
    return categories
}

async function fillBoard(){
    let cats = await randFive()
        for(let i=0;i<6;i++){
            $(`#c${i}`).text(cats[i].catname)
        }
    }

function initGame(){
    let g = new Game();
    try{fillBoard()}
    catch{try{fillBoard()}catch{fillBoard()}}
}   

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

function getCategory(catId) {
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO