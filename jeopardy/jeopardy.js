let $btn = $("#stButton")

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
        this.fillTable();
    }

    makeBoard(){
        this.board = [];
        for (let y = 0; y < this.height; y++) {
          this.board.push(Array.from({ length: this.width })); //destructuring a number, width, into an array 
        }
      }
    
    fillTable(){
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
      cell.setAttribute('id', `q${x}${y}`);
      cell.classList.toggle("question");
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

async function getCategory(id,cVal){
    let response = await axios.get("https://jservice.io/api/category?id="+id) //returning 1 category object
    //right here we need to stop if there's less than 5 clues
    let allClues = response.data.clues //store all the clues in an array
    // console.log(response)
    // generate 5 random clues
    let cluesTotal = response.data.clues.length //store how many clues there are
    let clueVals = ranArray(cluesTotal) //array of 5 random numbers within the length of how many clues there are
    // console.log(cluesTotal)
    // console.log(clueVals)
    let jCat = {}
    jCat["catname"+cVal] = (response.data.title).toUpperCase()
    for(let i=0;i<5;i++){
        let cIndex = clueVals[i]
        let tClue = allClues[cIndex]
        console.log(tClue)
        let cKey = `c-${cVal}-${i}`
        try{let uClue = new Clue(cKey,tClue.question,tClue.answer)
        let qname = "q"+cVal+i
        jCat[qname] = uClue}
        catch{let uClue = new Clue(cKey,"[question missing]","n/a")
        let qname = "q"+cVal+i
        jCat[qname] = uClue}
    }
    // console.log(jCat) //return 5 category names and 5 clues from each category, sort by value
    return jCat
}

//randfive returns an array of 5 random categories and 5 of their clues
async function randFive(){
    let categories = []
    let nums = [...ranArray(5000),...ranArray(5000)];
    for (let i = 0;i < 6; i++){
        // categories.push(await catClues(nums[i],i))
        categories = {...categories,...await getCategory(nums[i],i)}
    }
    //restructure array here to yield something more flat, just 30 clues.
    // console.log("here's our categories")
    // console.log(categories)
    return categories
}

async function pullData(){
    let cats = await randFive()
        for(let i=0;i<6;i++){
            let cName = `catname${i}`
            $(`#c${i}`).html(cats[cName])
        } 
    return cats
        // for(let j = 0;j<5;j++)
        // {
        //     console.log(`#c0-${j}`)
        //     $(`#c0-${j}`).text(cats[0].q0.question)
        // }
    }

    function showLoadingView() {
        $btn.attr("visibility","hidden")
        //create a gif div and append to loadspace
        $("#loadspace").append("<img src=\"loading.gif\"></img>")
        $btn.text("click here if you're waiting longer than a few seconds")
    
    }

    function hideLoadingView() {
        $btn.attr("visibility","visible")
        $("img").remove()
        $btn.text("Restart Game")
    }
    

async function setupAndStart(){
    showLoadingView();
    let g = new Game();
    let cats = await pullData()
    // console.log("here's what cats look like")
    // console.log(cats)
    for(let i = 0;i<6;i++){
        for (let j=0;j<5;j++){
            let key = `q${i}${j}`
            // console.log("assigning question"+key)
            // console.log(cats[key].question)
            handleClick(key,cats[key])
        }
    }
    hideLoadingView();

    //rename cats Clue Array so that it has IDs that match the cell
    // try{fillBoard()} // TODO - have initGame be the try-catch-try
    // catch{try{fillBoard()}catch{fillBoard()}}
    //assign clickers to each cell where: y
    //you click cell c-1-2
    //it checks the status "null, question, answer"
    //if null --> question, pull in text of clue x-1-2,
    //if question --> answer, pull in text of answer
    //if answer, do nothing
}   

$btn.on("click",setupAndStart)

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(key,cats){
    $(`#${key}`).on("click",function(e){
        let qC = cats.question
        let qA = cats.answer
        if(cats.showing === "null"){
            newText = qC;
            cats.showing = "question";
        }else if (cats.showing === "question"){
            newText = qA
            cats.showing = "answer"
            e.target.classList.toggle("answer")
        }else{newText = qA}
        $(`#${key}`).html(newText)
    })

}

