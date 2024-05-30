import { getTrack, getTrackInfo } from "./spotifyServices.js";

let questions;

fetch('questions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    questions = data;
    console.log(questions); 
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

    let currentQuestionIndex = 0;  
    let weights = {
        chill: 0,
        pop: 0,
        dance: 0,
        ambient: 0,
        anime: 0,
        indie: 0,
        movies: 0,
        rock: 0,
        country: 0,
        piano: 0,
    }; 

   let dominantGenre;

    function startQuiz(){ //To Do - Simplify Class Toggles
        document.getElementById("home").classList.remove("active");
        document.getElementById("home").classList.add("hidden");
        document.getElementById("quiz").classList.remove("hidden");
        document.getElementById("quiz").classList.add("active");
        displayQuestion();
    }

    document.getElementById("startQuiz").addEventListener('click', function() {
        startQuiz();
    });

    function displayHome(){ //To Do - Simplify Class Toggles
        document.getElementById("quiz").classList.remove("active");
        document.getElementById("quiz").classList.add("hidden");
        document.getElementById("results").classList.remove("active");
        document.getElementById("results").classList.add("hidden");
        document.getElementById("home").classList.remove("hidden");
        document.getElementById("home").classList.add("active");
        currentQuestionIndex = 0;
    }

    document.getElementById("displayHome").addEventListener('click', function() {
        displayHome();
    });

    function displayQuestion() { //To Do - Possibly Simplify by using html in this js, similar to displayRecommendedTracks
        const questionContainer = document.getElementById("question");
        const choicesContainer = document.getElementById("choices");
        const questionImage = document.getElementById("questionImage");
        const progressImage = document.getElementById("progressImage");
        const currentQuestion = questions[currentQuestionIndex];
        
        questionContainer.textContent = currentQuestion.question;
        choicesContainer.innerHTML = "";

        questionImage.setAttribute("src", questions[currentQuestionIndex].questionImage);
        progressImage.setAttribute("src", questions[currentQuestionIndex].progressImage);

        currentQuestion.choices.forEach((choiceObj) => {
            const button = document.createElement("button");
            button.textContent = choiceObj.choice;
            button.onclick = () => {
                updateChoiceWeights(choiceObj.weights);
                saveAnswer();
            };
            choicesContainer.appendChild(button);
        });
    }

    function updateChoiceWeights(choiceWeights) {
        for (let choice in choiceWeights) {
            if(weights.hasOwnProperty(choice)){
                weights[choice] += choiceWeights[choice];
            }
            else {
                weights[choice] = choiceWeights[choice];
            }
        }
    }

    function saveAnswer(){ //To Do - Rename Function
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length){
            displayQuestion();
        }
        else { //To Do - Simplify Class Toggles
            document.getElementById("quiz").classList.remove("active");
            document.getElementById("quiz").classList.add("hidden");
            document.getElementById("calculatingResults").classList.remove("hidden");
            document.getElementById("calculatingResults").classList.add("active");
        }
    }

    function displayResults(){ //To Do - Simplify Class Toggles & Rename Elements
        document.getElementById("calculatingResults").classList.remove("active");
        document.getElementById("calculatingResults").classList.add("hidden");
        document.getElementById("results").classList.remove("hidden");
        document.getElementById("results").classList.add("active");
        displayRecommendedTracks();
    }

    document.getElementById("calculateResults").addEventListener('click', function() {
        displayResults();
    });

    function calculateDominantGenre(weights) {
        let maxValue = -Infinity;
        
        for (const genre in weights) {
            if (weights.hasOwnProperty(genre)) {
    
                if (weights[genre] > maxValue) {
                    maxValue = weights[genre];
                    dominantGenre = genre;
                }
            }
        }
        return dominantGenre;
    }

    async function displayRecommendedTracks(){
        const resultsElem = document.getElementById("results");

        dominantGenre = calculateDominantGenre(weights);
        const trackInfo = await getTrackInfo(localStorage.getItem('access_token'), dominantGenre);
        console.log(trackInfo);

        trackInfo.tracks.forEach(track => {

            const result = `
                <div id="resultsContent">
                    <h2>Your Recommended Song is: </h2>
                </div>
                <div id="trackDiv">
                    <img src=${track.album.images[1].url}>
                    <p>Track Name: ${track.name}</p>
                    <p>Artist: ${track.artists.map(artist => artist.name).join(", ")}</p>
                    <p>Album: ${track.album.name}</p>
                    <p>Genre: ${(dominantGenre.charAt(0).toUpperCase() + dominantGenre.slice(1))}</p>
                    <a id="spotifyLink" href=${track.external_urls.spotify}>Link to Spotify</a>
                </div>
            `;

            resultsContent.innerHTML = result;
            localStorage.setItem("track_id",track.id);

            if(!result) {
                alert('Error in Displaying Results! Please Try Again!');
            }
        });
    }

    document.getElementById("saveTrack").addEventListener('click', function() {
        getTrack();
    });
       
        
  


        