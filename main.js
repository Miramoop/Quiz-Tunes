const questions = [

        //An idea to combine the choices and weights?
        // {
        //     question: "What is your ideal way to spend a Saturday afternoon?",  
        //     choices: [
        //         { choice: "Reading a book", weights: { chill: +20, ambient: +20 }}, 
        //         { choice: "Hiking in the Forest", weights: {country: +20, ambient: +20}},
        //         { choice: "Hanging out with Friends", weights: { indie: +20, pop: +20 }},
        //         { choice: "Watching movies or TV shows", weights: { movies: +20, anime: +20 }},
        //     ],
        // },

        {
            question: "What is your ideal way to spend a Saturday afternoon?", 
            choices: ["Reading a book", 
                      "Hiking in the Forest", 
                      "Hanging out with Friends", 
                      "Watching movies or TV shows", 
            ],
            choiceWeights: [
                {chill: +20, ambient: +20}, 
                {country: +20, ambient: +20}, 
                {indie: +20, pop: +20}, 
                {movies: +20, anime: +20}, 
            ],
        },

        {
            question: "What is your ideal vacation?", 
            choices: ["Beach Resort", 
                      "Mountain Retreat", 
                      "City Exploration", 
                      "Chilling at Home", 
            ],
            choiceWeights: [
                {chill: +20, dance: +20}, 
                {rock: +20, ambient: +20}, 
                {anime: +20, movies: +20}, 
                {chill: +20, piano: +20}, 
            ],
        },

        {
            question: "If you were able to travel to any of these countries, where would you choose?", 
            choices: ["Japan", 
                      "Australia", 
                      "France", 
                      "Mexico", 
            ],
            choiceWeights: [
                {anime: +20, movies: +20}, 
                {country: +20, ambient: +20}, 
                {indie: +20, piano: +20}, 
                {dance: +20, pop: +20}, 
            ],
        },

        {
            question: "What type of exercise do you prefer?", 
            choices: ["Dance", 
                      "Jogging", 
                      "Weight Training", 
                      "Yoga", 
            ],
            choiceWeights: [
                {dance: +20, movies: +20}, 
                {pop: +20, rock: +20}, 
                {rock: +20, anime: +20}, 
                {piano: +20, chill: +20}, 
            ],
        },

        {
            question: "What kind of music do you prefer to listen to?", 
            choices: ["Country", 
                      "Rock", 
                      "Dance", 
                      "Chill", 
            ],
            choiceWeights: [
                {country: +20, ambient: +20}, 
                {indie: +20, rock: +20}, 
                {pop: +20, dance: +20}, 
                {chill: +20, ambient: +20}, 
            ],
        },

        
        {
            question: "Which season do you enjoy the most?", 
            choices: ["Fall", 
                      "Winter", 
                      "Spring", 
                      "Summer", 
            ],
            choiceWeights: [
                {indie: +20, ambient: 0}, 
                {piano: +20, chill: +20}, 
                {chill: +20, anime: +20}, 
                {pop: +20, dance: +20}, 
            ],
        },

         
        {
            question: "What types of movies do you prefer?", 
            choices: ["Action", 
                      "Comedy", 
                      "Drama", 
                      "Horror", 
            ],
            choiceWeights: [
                {rock: +20, anime: +20}, 
                {indie: +20, chill: +20}, 
                {indie: +20, pop: +20}, 
                {pop: +20, rock: +20}, 
            ],
        },

        {
            question: "What is your favorite flower?", 
            choices: ["Rose", 
                      "Tulip", 
                      "Sunflower", 
                      "Orchids", 
            ],
            choiceWeights: [
                {indie: +20, movies: +20}, 
                {chill: +20, ambient: +20}, 
                {pop: +20, dance: +20}, 
                {rock: +20, piano: +20}, 
            ],
        },

        {
            question: "What type of cuisine do you enjoy the most?", 
            choices: ["Japanese", 
                      "Spanish", 
                      "French", 
                      "American", 
            ],
            choiceWeights: [
                {anime: +20, movies: +20}, 
                {dance: +20, pop: +20}, 
                {piano: +20, indie: +20}, 
                {movies: +20, country: +20}, 
            ],
        },
        
        {
            question: "What is your favorite time of day?",
            choices: ["Morning", 
                      "Afternoon", 
                      "Evening", 
                      "Night", 
            ],
            choiceWeights: [
                {piano: +20, ambient: +20}, 
                {pop: +20, dance: +20}, 
                {chill: +20, indie: +20}, 
                {rock: +20, movies: +20}, 
            ],
        },
    ];
   
    let currentQuestionIndex = 0;  
    
    //Object to keep track of the choice weights given by each question answer
    let choiceWeights = {}; 
    
    //Make into an object
    // let genreCounts = {
    //     chill: 0,
    //     pop: 0,
    //     dance: 0,
    //     ambient: 0,
    //     anime: 0,
    //     indie: 0,
    //     movies: 0,
    //     rock: 0,
    //     country: 0,
    //     piano: 0
    // };
    
    // genreCounts.chill += 1;
    // genreCounts.pop -= 1;

    let chill = 0;
    let pop = 0;
    let dance = 0;
    let ambient = 0;
    let anime = 0;
    let indie = 0;
    let movies = 0;
    let rock = 0;
    let country = 0;
    let piano = 0;

    //dominantGenre intialized at null
    let dominantGenre;
    
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
        
    function displayQuestionImage(currentQuestionIndex) {
        const questionImageURLs = [
            "img/q1.jpg",
            "img/q2.jpg",
            "img/q3.jpg",
            "img/q4.jpg",
            "img/q5.jpg",
            "img/q6.jpg",
            "img/q7.jpg",
            "img/q8.jpg",
            "img/q9.jpg",
            "img/q10.jpg",
        ];
        const questionImage = document.getElementById("questionImage");
        questionImage.setAttribute("src", questionImageURLs[currentQuestionIndex]);
    }

    function displayProgressbar(currentQuestionIndex){
        const progressBarURLs = [
            "img/progressBar1.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
            "img/.jpg",
        ];
        const progressBar = document.getElementById("progressBar");
        progressBar.setAttribute("src", progressBarURLs[currentQuestionIndex]);
    }

    function displayQuestion() {

        const questionContainer = document.getElementById("question");
        const choicesContainer = document.getElementById("choices");
        const currentQuestion = questions[currentQuestionIndex];
        
        questionContainer.textContent = currentQuestion.question;
        choicesContainer.innerHTML = "";

        displayQuestionImage(currentQuestionIndex);
        displayProgressbar(currentQuestionIndex);

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

    function updateChoiceWeights(weights) {
        for (let choice in weights) {
            if(weights.hasOwnProperty(choice)){
                choiceWeights[choice] = weights[choice];
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

        const dominantGenre = calculateDominantGenre(choiceWeights);
    
        const tokenResponse = await getToken(dominantGenre);
        const trackInfo = await getTrackInfo(tokenResponse.access_token, dominantGenre);
        console.log(trackInfo); //Testing 
    
        displayRecommendedTracks(trackInfo);
    }
    
    function calculateDominantGenre(choiceWeights) {
        let maxScore = -Infinity;
    
        for (const genre in choiceWeights){
            if (choiceWeights.hasOwnProperty(genre)){

                if(choiceWeights[genre] > maxScore){
                    maxScore = choiceWeights[genre];
                    dominantGenre = genre;
                }
            }
        }

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
            genreId.textContent = "Genre: " + dominantGenre;

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
