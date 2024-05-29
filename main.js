import { getTrackInfo } from "./spotifyauthorization.js";

const questions = [
        {
            question: "What is your ideal way to spend a Saturday afternoon?",  
            questionImage: "img/q1.jpg",
            progressImage: "img/emptyprogress.jpg",
            choices: [
                { choice: "Reading a book", weights: { chill: +25, ambient: +30 }}, 
                { choice: "Hiking in the Forest", weights: { country: +30, ambient: +15 }},
                { choice: "Hanging out with Friends", weights: { indie: +30, pop: +25 }},
                { choice: "Watching movies or TV shows", weights: { movies: +35, anime: +25 }},
            ],
        },

        {
            question: "What is your ideal vacation?",
            questionImage: "img/q2.jpg",
            progressImage: "img/q1progress.jpg",
            choices: [
                { choice: "Beach Resort", weights: { chill: +30, dance: +20 }},
                { choice: "Mountain Retreat", weights: { rock: +35, ambient: +20 }},
                { choice: "City Exploration", weights: { anime: +25, movies: +30 }},
                { choice:  "Chilling at Home", weights: { chill: +25, piano: +20 }},
            ]
        },

        {
            question: "If you were able to travel to any of these countries, where would you choose?",
            questionImage: "img/q3.jpg",
            progressImage: "img/q2progress.jpg",
            choices: [
                { choice: "Japan", weights: { anime: +40, movies: +20 }},
                { choice: "Australia", weights: { country: +30, ambient: +10 }},
                { choice: "France", weights: { indie: +10, piano: +30 }},
                { choice: "Mexico", weights: { dance: +40, pop: +25 }},
            ]
        },

        {
            question: "What type of exercise do you prefer?", 
            questionImage: "img/q4.jpg",
            progressImage: "img/q3progress.jpg",
            choices: [
                { choice: "Dance", weights: { dance: +40, movies: +25 }},
                { choice: "Jogging", weights: { pop: +30, rock: +20 }},
                { choice: "Weight Training", weights: { rock: +35, anime: +30 }},
                { choice: "Yoga", weights: { piano: +40, chill: +25 }},
            ]
        },

        {
            question: "What kind of music do you prefer to listen to?", 
            questionImage: "img/q5.jpg",
            progressImage: "img/q4progress.jpg",
            choices: [
                { choice: "Country", weights: { country: +40, ambient: +15 }},
                { choice: "Rock", weights: { indie: +15, rock: +40 }},
                { choice: "Dance", weights: { pop: +15, dance: +40 }},
                { choice: "Chill", weights: { chill: +40, ambient: +15 }},
            ]
        },

        {
            question: "Which season do you enjoy the most?", 
            questionImage: "img/q6.jpg",
            progressImage: "img/q5progress.jpg",
            choices: [
                { choice: "Fall", weights: { indie: +20, ambient: +35 }},
                { choice: "Winter", weights: { piano: +25, chill: +30 }},
                { choice: "Spring", weights: { chill: +10, anime: +15 }},
                { choice: "Summer", weights: { pop: +30, dance: +40 }},
            ]
        },

        {
            question: "What types of movies do you prefer?", 
            questionImage: "img/q7.jpg", 
            progressImage: "img/q6progress.jpg",
            choices: [
                { choice: "Action", weights: { rock: +40, anime: +40 }},
                { choice: "Comedy", weights: { indie: +20, chill: +20 }},
                { choice: "Drama", weights: { indie: +30, pop: +25 }},
                { choice: "Horror", weights: { pop: +10, rock: +15 }},
            ]
        },

        {
            question: "What is your favorite flower?",   
            questionImage: "img/q8.jpg",
            progressImage: "img/q7progress.jpg",
            choices: [
                { choice: "Rose", weights: { indie: +25, movies: +15 }},
                { choice: "Tulip", weights: { chill: +25, ambient: +15 }},
                { choice: "Sunflower", weights: { pop: +25, dance: +25 }},
                { choice: "Orchids", weights: { rock: +25, piano: +15 }},
            ]
        },

        {
            question: "What type of cuisine do you enjoy the most?",   
            questionImage: "img/q9.jpg",
            progressImage: "img/q8progress.jpg",
            choices: [
                { choice: "Japanese", weights: { anime: +40, movies: +20 }},
                { choice: "Spanish", weights: { dance: +40, pop: +30 }},
                { choice: "French", weights: { piano: +40, indie: +20 }},
                { choice: "American", weights: { movies: +40, country: +30 }},
            ]
        },

        {
            question: "What is your favorite time of day?", 
            questionImage: "img/q10.jpg",  
            progressImage: "img/q9progress.jpg",
            choices: [
                { choice: "Morning", weights: { piano: +40, ambient: +25 }},
                { choice: "Afternoon", weights: { pop: +35, dance: +20 }},
                { choice: "Evening", weights: { chill: +30, indie: +20 }},
                { choice: "Night", weights: { rock: +25, movies: +15 }},
            ]
        },

    ];
   
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

    function startQuiz(){
        document.getElementById("home").classList.remove("active");
        document.getElementById("home").classList.add("hidden");
        document.getElementById("quiz").classList.remove("hidden");
        document.getElementById("quiz").classList.add("active");
        displayQuestion();
    }

    document.getElementById("startQuiz").addEventListener('click', function() {
        startQuiz();
    });

    function displayHome(){
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

    function displayQuestion() {
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

    function saveAnswer(){
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length){
            displayQuestion();
        }
        else {
            document.getElementById("quiz").classList.remove("active");
            document.getElementById("quiz").classList.add("hidden");
            document.getElementById("calculatingResults").classList.remove("hidden");
            document.getElementById("calculatingResults").classList.add("active");
        }
    }

    function calculateResults(){
        document.getElementById("calculatingResults").classList.remove("active");
        document.getElementById("calculatingResults").classList.add("hidden");
        document.getElementById("results").classList.remove("hidden");
        document.getElementById("results").classList.add("active");
        displayRecommendedTracks();
    }

    document.getElementById("calculateResults").addEventListener('click', function() {
        calculateResults();
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

        const saveTrack = async () => {
            const access_token = localStorage.getItem('access_token');
            const trackId = localStorage.getItem('track_id');
        
            const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });
        
            if (!response.ok) {
                alert('Error in Saving Track! Please Try Again');
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }

            alert('Track was Saved Successfully!');
            return response.status === 200 ? 'Track saved successfully' : response.json();
            
        };
        
        document.getElementById("saveTrack").addEventListener('click', function() {
            saveTrack().then(result => {
                console.log(result);
            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
        
  


        