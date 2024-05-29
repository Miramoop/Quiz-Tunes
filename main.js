import { getTrackInfo } from "./spotifyauthorization.js";

const questions = [
        {
            question: "What is your ideal way to spend a Saturday afternoon?",  
            image: "img/q1.jpg",
            choices: [
                { choice: "Reading a book", weights: { chill: +20, ambient: +20 }}, 
                { choice: "Hiking in the Forest", weights: { country: +20, ambient: +20 }},
                { choice: "Hanging out with Friends", weights: { indie: +20, pop: +20 }},
                { choice: "Watching movies or TV shows", weights: { movies: +20, anime: +20 }},
            ],
        },

        {
            question: "What is your ideal vacation?",
            image: "img/q2.jpg",
            choices: [
                { choice: "Beach Resort", weights: { chill: +20, dance: +20 }},
                { choice: "Mountain Retreat", weights: { rock: +20, ambient: +20 }},
                { choice: "City Exploration", weights: { anime: +20, movies: +20 }},
                { choice:  "Chilling at Home", weights: { chill: +20, piano: +20 }},
            ]
        },

        {
            question: "If you were able to travel to any of these countries, where would you choose?",
            image: "img/q3.jpg",
            choices: [
                { choice: "Japan", weights: { anime: +20, movies: +20 }},
                { choice: "Australia", weights: { country: +20, ambient: +20 }},
                { choice: "France", weights: { indie: +20, piano: +20 }},
                { choice: "Mexico", weights: { dance: +20, pop: +20 }},
            ]
        },

        {
            question: "What type of exercise do you prefer?", 
            image: "img/q4.jpg",
            choices: [
                { choice: "Dance", weights: { dance: +20, movies: +20 }},
                { choice: "Jogging", weights: { pop: +20, rock: +20 }},
                { choice: "Weight Training", weights: { rock: +20, anime: +20 }},
                { choice: "Yoga", weights: { piano: +20, chill: +20 }},
            ]
        },

        {
            question: "What kind of music do you prefer to listen to?", 
            image: "img/q5.jpg",
            choices: [
                { choice: "Country", weights: { country: +20, ambient: +20 }},
                { choice: "Rock", weights: { indie: +20, rock: +20 }},
                { choice: "Dance", weights: { pop: +20, dance: +20 }},
                { choice: "Chill", weights: { chill: +20, ambient: +20 }},
            ]
        },

        {
            question: "Which season do you enjoy the most?", 
            image: "img/q6.jpg",
            choices: [
                { choice: "Fall", weights: { indie: +20, ambient: +20 }},
                { choice: "Winter", weights: { piano: +20, chill: +20 }},
                { choice: "Spring", weights: { chill: +20, anime: +20 }},
                { choice: "Summer", weights: { pop: +20, dance: +20 }},
            ]
        },

        {
            question: "What types of movies do you prefer?", 
            image: "img/q7.jpg", 
            choices: [
                { choice: "Action", weights: { rock: +20, anime: +20 }},
                { choice: "Comedy", weights: { indie: +20, chill: +20 }},
                { choice: "Drama", weights: { indie: +20, pop: +20 }},
                { choice: "Horror", weights: { pop: +20, rock: +20 }},
            ]
        },

        {
            question: "What is your favorite flower?",   
            image: "img/q8.jpg",
            choices: [
                { choice: "Rose", weights: { indie: +20, movies: +20 }},
                { choice: "Tulip", weights: { chill: +20, ambient: +20 }},
                { choice: "Sunflower", weights: { pop: +20, dance: +20 }},
                { choice: "Orchids", weights: { rock: +20, piano: +20 }},
            ]
        },

        {
            question: "What type of cuisine do you enjoy the most?",   
            image: "img/q9.jpg",
            choices: [
                { choice: "Japanese", weights: { anime: +20, movies: +20 }},
                { choice: "Spanish", weights: { dance: +20, pop: +20 }},
                { choice: "French", weights: { piano: +20, indie: +20 }},
                { choice: "American", weights: { movies: +20, country: +20 }},
            ]
        },

        {
            question: "What is your favorite time of day?", 
            image: "img/q10.jpg",  
            choices: [
                { choice: "Morning", weights: { piano: +20, ambient: +20 }},
                { choice: "Afternoon", weights: { pop: +20, dance: +20 }},
                { choice: "Evening", weights: { chill: +20, indie: +20 }},
                { choice: "Night", weights: { rock: +20, movies: +20 }},
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

    function displayQuestionImage(currentQuestionIndex){
        const questionImage = document.getElementById("questionImage");
        questionImage.setAttribute("src", questions[currentQuestionIndex].image);
    }

    function displayQuestion() {
        const questionContainer = document.getElementById("question");
        const choicesContainer = document.getElementById("choices");
        const currentQuestion = questions[currentQuestionIndex];
        
        questionContainer.textContent = currentQuestion.question;
        choicesContainer.innerHTML = "";

        displayQuestionImage(currentQuestionIndex);

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
        document.getElementById("calculatingResults").classList.add("hidden")
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
                //console.log(`Checking genre: ${genre}, weight: ${weights[genre]}`); //Testing
    
                if (weights[genre] > maxValue) {
                    maxValue = weights[genre];
                    dominantGenre = genre;
                   //console.log(`New dominant genre: ${dominantGenre}, maxValue: ${maxValue}`); //Testing
                }
            }
        }
        //console.log(`Final dominant genre: ${dominantGenre}`); //Testing
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
        });
    }



    //Would need to have trackId in order to add into their library
    //Saving Track to user's libary
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
                const errorData = await response.json();
                throw new Error(`Error ${response.status}: ${errorData.message}`);
            }
        
            return response.status === 200 ? 'Track saved successfully' : response.json();
        };
        
        document.getElementById("saveTrack").addEventListener('click', function() {
            saveTrack().then(result => {
                console.log(result);
            }).catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
        

        //Testing to Make Sure Track Actually Saved
        // const checkSavedTrack = async () => {
        //     const access_token = localStorage.getItem('access_token');
        //     const trackId = localStorage.getItem('track_id');

        //     const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`, {
        //     method: 'GET',
        //     headers: {
        //             'Authorization': `Bearer ${access_token}`,
        //     }
        // });
        
        // return await response.json();
        // };

        // document.getElementById("checkSaveTrack").addEventListener('click', function() {
        //     checkSavedTrack().then(result => {
        //         console.log(result);
        //     }).catch(error => {
        //         console.error('There was a problem with the save operation:', error);
        //     });
        // });
        
 
  


