
//Creating the Quiz Questions
const questions = [
{
    question: "If you were to take a hike in the woods, which option would you prefer?", //Question
    choices: ["Go on the hike alone spending the time just enjoying the peaceful ambience", //Answer Choice 1
              "Bring a friend along and enjoy your time talking with eachother", //Answer Choice 2
    ],
    choiceWeights: [
        {popGenreScore: 0, ambientGenreScore: +3}, //choiceWeights for first choice
        {popGenreScore: +2, ambientGenreScore: 0}, //choiceWeights for second choice
    ],
},

    {
        question: "If you were to go to a concert, which option would you prefer?", //Question
        choices: ["Sit in a seat and just enjoy the concert", //Answer choice 1
                  "Sing and dance along with the music", //Answer Choice 2
        ],
        choiceWeights: [
            {chillGenreScore: +2, danceGenreScore: 0}, //choiceWeights for first choice
            {chillGenreScore: 0, danceGenreScore: +2}, //choiceWeights for second choice
        ],
    }
];

//Initializing the currentQuestionIndex to the element 0,
//so it starts at the first question properly
let currentQuestionIndex = 0;  

//Creating an object to keep track of the choice weights given 
//by each question answer
let choiceWeights = {}; 

//Creating the variables for the genres of the music
let chillGenreScore = 0;
let popGenreScore = 0;
let danceGenreScore = 0;
let ambientGenreScore = 0;

//Additional Genres to Add
//let animeGenreScore = 0;
//let indieGenreScore = 0;
//let moviesGenreScore = 0;

//Creating a function that is triggered when the user clicks the 
//Start Quiz button on home, Makes the home element invisible and
//displays the quiz element
function startQuiz(){
    document.getElementById("home").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    displayQuestion();
}

//Creating a function to display all the quiz questions
//Uses the containers created in the HTML file to display
//each element based on id
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
            saveAnswer();
        };
        choicesContainer.appendChild(button);
    });
}

//Creating a function that keeps track of all the weights by merging 
//the choiceWeights results from each question into the choiceWeights 
//object
function updateChoiceWeights(weights) {
    choiceWeights = { ...choiceWeights, ...weights};
}

//Creating a function that saves the answers for each question
//As long as the currentQuestionIndex is less than the 
//questions.length it displays the next question
//If the questions have all been displayed then it makes the quiz
//element invisible and displays the results page
function saveAnswer(){
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

//Creating a function to display the quiz results in terms of the 
//calculated genre values
function displayResults(){
    const resultsContent = document.getElementById("resultsContent");

    //Used to make sure that the old results are cleared before the new
    //ones are displayed
    resultsContent.innnerHTML = ""; 
    const resultsText = document.createElement("p");
    resultsText.textContent = "Results:";
    resultsContent.appendChild(resultsText);

    //Used to calculate all the genre values obtained from each question
    //and display them for the user to see
    //Will later on have the Spotify API take in these values to get
    //an album in that genre
    for (const key in choiceWeights) {
        const resultItem = document.createElement("p");
        resultItem.textContent = `${key}: ${choiceWeights[key]}`;
        resultsContent.appendChild(resultItem);
    }
}

//Must add these to ensure that the quiz and results pages are invisible
//when the web quiz is first launched
document.getElementById("quiz").style.display = "none";
document.getElementById("results").style.display = "none";

