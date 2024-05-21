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
        mbient: 0,
        anime: 0,
        indie: 0,
        movies: 0,
        rock: 0,
        country: 0,
        piano: 0,
    }; 

    let dominantGenre; //null
    
    function startQuiz(){
        document.getElementById("home").classList.remove("active");
        document.getElementById("home").classList.add("hidden");
        document.getElementById("quiz").classList.remove("hidden");
        document.getElementById("quiz").classList.add("active");
        displayQuestion();
    }

    function displayHome(){
        document.getElementById("quiz").classList.remove("active");
        document.getElementById("quiz").classList.add("hidden");
        document.getElementById("results").classList.remove("active");
        document.getElementById("results").classList.add("hidden");
        document.getElementById("home").classList.remove("hidden");
        document.getElementById("home").classList.add("active");
        currentQuestionIndex = 0;
    }
        
    // function displayQuestionImage(currentQuestionIndex) {
    //     const questionImageURLs = [
    //         "img/q1.jpg",
    //         "img/q2.jpg",
    //         "img/q3.jpg",
    //         "img/q4.jpg",
    //         "img/q5.jpg",
    //         "img/q6.jpg",
    //         "img/q7.jpg",
    //         "img/q8.jpg",
    //         "img/q9.jpg",
    //         "img/q10.jpg",
    //     ];
    //     const questionImage = document.getElementById("questionImage");
    //     questionImage.setAttribute("src", questionImageURLs[currentQuestionIndex]);
    // }

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

        currentQuestion.choices.forEach((choiceObj, index) => {
            const button = document.createElement("button");
            button.textContent = choiceObj.choice;
            button.onclick = () => {
                updateChoiceWeights(weights[index]);
                saveAnswer();
            };
            choicesContainer.appendChild(button);
        });
    }

    function updateChoiceWeights(weights) {
        for (let choice in weights) {
            if(weights.hasOwnProperty(choice)){
                weights[choice] = weights[choice];
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
        displayResults();
    }

        
    async function displayResults() {
        const resultsContent = document.getElementById("resultsContent");

        const dominantGenre = calculateDominantGenre(weights);
    
        const tokenResponse = await getToken(dominantGenre);
        const trackInfo = await getTrackInfo(tokenResponse.access_token, dominantGenre);
        console.log(trackInfo); //Testing 
    
        displayRecommendedTracks(trackInfo);
    }

    function calculateDominantGenre(weights) {
        let maxScore = -Infinity;
    
        for (const genre in weights){
            if (weights.hasOwnProperty(genre)){

                if(weights[genre] > maxScore){
                    maxScore = weights[genre];
                    dominantGenre = genre;
                }
            }
        }

        console.log(dominantGenre);
        return dominantGenre;
        
    }
    
    function displayRecommendedTracks(trackInfo){
        const resultsContent = document.getElementById("resultsContent");
        resultsContent.innerHTML = ""; 
    
        const heading = document.createElement("h2");
        heading.textContent = "Your Recommended Song is: ";
        resultsContent.appendChild(heading);
    
        trackInfo.tracks.forEach(track => {

            const trackDiv = document.getElementById("trackDiv");

            const albumCover = document.getElementById("albumCover");
            albumCover.textContent = "Album Cover";
            albumCover.setAttribute("src", track.album.images[1].url);

            const trackName = document.getElementById("trackName");
            trackName.textContent = "Track Name: " + track.name;
    
            const artists = document.getElementById("artists");
            artists.textContent = "Artists: " + track.artists.map(artist => artist.name).join(", ");
    
            const album = document.getElementById("album");
            album.textContent = "Album: " + track.album.name;
            
            const genreId = document.getElementById("genreId");
            genreId.textContent = "Genre: " + (dominantGenre.charAt(0).toUpperCase() + dominantGenre.slice(1));

            const spotifyLink = document.getElementById("spotifyLink");
            spotifyLink.textContent = "Link to Spotify";
            spotifyLink.setAttribute("href", track.external_urls.spotify);
    
            trackDiv.appendChild(albumCover);
            trackDiv.appendChild(trackName);
            trackDiv.appendChild(artists);
            trackDiv.appendChild(album);
            trackDiv.appendChild(genreId);
            trackDiv.appendChild(spotifyLink);

            resultsContent.appendChild(trackDiv);
        });
    }
