const questions = [
{
    question: "If you were to take a hike in the woods, which option would you prefer?", //Question
    choices: ["Go on the hike alone spending the time just enjoying the peaceful ambience", //Answer Choice 1
              "Bring a friend along and enjoy your time talking with eachother", //Answer Choice 2
    ],
    choiceWeights: [
        {popGenreScore: 0, instrumentalGenreScore: +3}, //choiceWeights for first choice
        {popGenreScore: +2, instrumentalGenreScore: 0}, //choiceWeights for second choice
    ],
},

    {
        question: "If you were to go to a concert, which option would you prefer?", //Question
        choices: ["Sit in a seat and just enjoy the concert", //Answer choice 1
                  "Sing and dance along with the music", //Answer Choice 2
        ],
        choiceWeights: [
            {lofiGenreScore: +2, rockGenreScore: 0}, //choiceWeights for first choice
            {lofiGenreScore: 0, rockGenreScore: +2}, //choiceWeights for second choice
        ],
    }
];

let currentQuestionIndex = 0; //Initilizing the currentQuestionIndex to the element 0
let choiceWeights = {}; //Creating an object to keep track of choice weights

//genres of music
let rockGenreScore = 0;
let animeGenreScore = 0;
let soundtrackGenreScore = 0;
let popGenreScore = 0;
let lofiGenreScore = 0;
let instrumentalGenreScore = 0;

function startQuiz(){
    document.getElementById("home").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    displayQuestion();
}

function displayQuestion() {

    const questionContainer = document.getElementById("question");
    const choicesContainer = document.getElementById("choices");
    const currentQuestion = questions[currentQuestionIndex];

    questionContainer.textContent = currentQuestion.question;
    choicesContainer.innerHTML = "";

    currentQuestion.choices.forEach((choice, index) => {
        const button = document.createElement("button");
        button.textContent = choice;
        button.onclick = () => {
            updateChoiceWeights(currentQuestion.choiceWeights[index]);
            checkAnswer();
        };
        choicesContainer.appendChild(button);
    });
}

function updateChoiceWeights(weights) {
    //Merge the choice weights for the current question into the choiceWeights object
    choiceWeights = { ...choiceWeights, ...weights};
}

function checkAnswer(){
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length){
        displayQuestion();
    }
    else {
        document.getElementById("quiz").style.display = "none";
        document.getElementById("results").style.display = "block";
        displayResults();
    }
}

function displayResults(){
    const resultsContent = document.getElementById("resultsContent");
    resultsContent.innnerHTML = ""; //Used to make sure the old results are cleared
    const resultsText = document.createElement("p");
    resultsText.textContent = "Results:";
    resultsContent.appendChild(resultsText);

    for (const key in choiceWeights) {
        const resultItem = document.createElement("p");
        resultItem.textContent = `${key}: ${choiceWeights[key]}`;
        resultsContent.appendChild(resultItem);
    }
}

displayQuestion();

document.getElementById("quiz").style.display = "none";
document.getElementById("results").style.display = "none";

