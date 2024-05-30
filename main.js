import { getTrack, getTrackInfo, getToken } from "./api/spotifyServices.js";

let questions;

fetch('data/questions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    questions = data;
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

    function toggleClasses(element, removeClass, addClass) {
        element.classList.remove(removeClass);
        element.classList.add(addClass);
    }

    function startQuiz() {
        toggleClasses(document.getElementById("home"), "active", "hidden");
        toggleClasses(document.getElementById("quiz"), "hidden", "active");
        displayQuestion();
    }

    document.getElementById("startQuiz").addEventListener('click', startQuiz);

    function resetQuiz(){ 
        toggleClasses(document.getElementById("quiz"), "active", "hidden");
        toggleClasses(document.getElementById("results"), "active", "hidden");
        toggleClasses(document.getElementById("home"), "hidden", "active");
        currentQuestionIndex = 0;
    }

    document.getElementById("resetQuiz").addEventListener('click', resetQuiz);

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
                handleQuestionUpdate();
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

    function handleQuestionUpdate(){
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        }
        else {
            toggleClasses(document.getElementById("quiz"), "active", "hidden");
            toggleClasses(document.getElementById("quizComplete"), "hidden", "active");
        }
    }

    function displayResults() {
        toggleClasses(document.getElementById("quizComplete"), "active", "hidden");
        toggleClasses(document.getElementById("results"), "hidden", "active");
        displayRecommendedTracks();
    }

    document.getElementById("quizComplete").addEventListener('click', displayResults);

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

    document.getElementById("saveTrack").addEventListener('click', getTrack);
       
        
  


        