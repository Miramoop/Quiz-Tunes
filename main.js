const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choices-text'));

let currentQuestion = {};
let acceptingAnswers = true;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: 'Which animal is best?',
        choice: 'Dog',
        choice: 'Cat',
        choice: 'Fish',
        choice: 'Cow',
    },

    {
        question: 'Which food is best?',
        choice: 'Mac and Cheese',
        choice: 'Pizza',
        choice: 'Chicken Noodle Soup',
        choice: 'Ramen',
    },

    {
        question: 'Which season is best?',
        choice: 'Fall',
        choice: 'Winter',
        choice: 'Spring',
        choice: 'Summer',
    },
]



