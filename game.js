// global variabels
var xn = 70; //#columns
var yn = 35; //#rows
var currentGeneration;
var nextGeneration;
var allNeighbors;
var counter = 0; //starts at 0
var amount = 0; //starts at 0

// get element table from index.html
var table = document.getElementById("table");

// returns new world where everyone is dead
function createDeadGeneration() {
    var tabelle = new Array([]); //create new array
    for (var i = 0; i < xn; i++) {
        tabelle[i] = [];
        for (j = 0; j < yn; j++)
            tabelle[i][j] = false; //fills array with false = dead
    }
    return tabelle;
    tabelle[i][j] = false;
}

// define var currentGeneration and create Generation
function initModel() {
    currentGeneration = createDeadGeneration();
}

// define var nextGeneration and create Generation
function initModelNew() {
    nextGeneration = createDeadGeneration();
}

// initiates table
function initView() {
    for (var i = 1; i < yn - 1; i++) { //Starten mit [1][1] und enden mit (xn/yn -1), da so Rahmen stehen bleibt. (Array-table = Rahmen=> relevant für Auswahl Nachbarn) //Merke: array darf nicht negativ sein!
        var neueZeile = table.insertRow(table.length);
        for (var j = 1; j < xn - 1; j++) {
            var neueZelle = neueZeile.insertCell(j - 1);
            neueZelle.zeilenIndex = i; //new properties
            neueZelle.spaltenIndex = j;
            neueZelle.id = i + '-' + j;
        }
    }
    updateView();
}

// initiates & updates table on html, every cell by id
function updateView() {
    for (var i = 1; i < yn - 1; i++) {
        for (var j = 1; j < xn - 1; j++) {
            var zelle = document.getElementById(i + '-' + j);
            //zelle.innerHTML = currentGeneration[i][j] ? 't' : 'f';
            zelle.wert = currentGeneration[i][j];
            zelle.style = currentGeneration[i][j] ? "background:orange" : "background:white"; //bei click verändere Hintergrund (Browser)
        }
    }
}

// initiates currentGeneration (Model & View)
function init() {
    console.log('initiates..');
    initModel();
    initView();
}
init();

// get neighbor cells, apply rules and create a new generation
function createNextGeneration() {
    for (var i = 1; i < yn - 1; i++) {
        for (var j = 1; j < xn - 1; j++) {
            // startCell is the cell from where the neigbors are defined
            startCell = document.getElementById(i + '-' + j);

            // gets true or false for startCell and neighbors
            selectedCell = currentGeneration[startCell.zeilenIndex][startCell.spaltenIndex]; //selectedCell = startCell value (true or false)

            // neighbor cells
            var zer = currentGeneration[startCell.zeilenIndex - 1][startCell.spaltenIndex - 1]; // 0 1 2
            var one = currentGeneration[startCell.zeilenIndex - 1][startCell.spaltenIndex];   // 3   5
            var two = currentGeneration[startCell.zeilenIndex - 1][startCell.spaltenIndex + 1]; // 6 7 8
            var thr = currentGeneration[startCell.zeilenIndex][startCell.spaltenIndex - 1];
            var fiv = currentGeneration[startCell.zeilenIndex][startCell.spaltenIndex + 1];
            var six = currentGeneration[startCell.zeilenIndex + 1][startCell.spaltenIndex - 1];
            var sev = currentGeneration[startCell.zeilenIndex + 1][startCell.spaltenIndex];
            var eig = currentGeneration[startCell.zeilenIndex + 1][startCell.spaltenIndex + 1];

            // sum od all neighbors around selected cell
            allNeighbors = new Array(zer, one, two, thr, fiv, six, sev, eig);

            console.log(selectedCell + " in currentGeneration");
            // console.log(allNeighbors);

            // gives the # of true/false in allNeighbors
            var livingNeighbours = 0;
            for (var z = 0; z < allNeighbors.length; z++) {
                if (allNeighbors[z])
                    livingNeighbours++;
            }
           console.log(livingNeighbours + (8 - livingNeighbours));

            // apply rules
            if (selectedCell)
                nextGeneration[i][j] = livingNeighbours === 3 || livingNeighbours === 2;
            else
                nextGeneration[i][j] = livingNeighbours === 3;
        }
    }
    // move from currentGeneration to nextGeneration
    currentGeneration = nextGeneration;
}

// step from one generation to the other
function nextStep() {
    initModelNew();
    createNextGeneration();
    updateView();
    counter++;
    replace();
}

//----------------------------------------------------------------------------------------------CONTROLS

// function step
document.getElementById("step").onclick = function () {
    nextStep();
};

// function stop
document.getElementById("stop").onclick = function () {
    window.clearInterval(timer)
};

// function run
document.getElementById("run").onclick = function () {
    timer = window.setInterval(nextStep, 20)
};

// function clear
document.getElementById("clear").onclick = function () {
    initModel(); //inits new array, current Generation
    updateView();//refill existing table
    setToZero();
};

// generation info
function replace() {
    document.getElementById("gen").innerHTML = counter;
}

// generation info
function info() {
    document.getElementById("cells").innerHTML = amount;
}


// set the counter of generations back to zero
function setToZero() {
    counter = 0;
    document.getElementById("gen").innerHTML = counter;
    amount = 0;
    document.getElementById("cells").innerText = amount;
}

// on click activates/deactivates cells
table.onclick = function klicken(x) {
    if (x.srcElement.wert !== true) { //when not alive, resurrect
        x.srcElement.style = "background:orange"; //set color
        x.srcElement.wert = true; //set table value
        //x.srcElement.innerHTML = 't'; //writes t into cell
        currentGeneration[x.srcElement.zeilenIndex][x.srcElement.spaltenIndex] = true; //set array value
    }
    else { //when alive, kill
        x.srcElement.style = "background:white";
        x.srcElement.wert = false;
        //x.srcElement.innerHTML = 'f';
        currentGeneration[x.srcElement.zeilenIndex][x.srcElement.spaltenIndex] = false;
    }
    console.log("Cell " + x.srcElement.zeilenIndex + "|" + x.srcElement.spaltenIndex + " is " + currentGeneration[x.srcElement.zeilenIndex][x.srcElement.spaltenIndex]); //aray:
    amount++;
    info();
};


/*
// ToDo: Evtl. zusätzliche Funktion einbauen
//function createPattern
document.getElementById("pattern").onclick = function(x) {
    var patterns = table[Math.floor(Math.random() * table.length)]; //müsste ein td x y rausgeben
    currentGeneration[patterns.zeilenIndex][patterns.spaltenIndex] = true;


        patterns.style = "background:orange";
        patterns.wert = true;
};
   */
