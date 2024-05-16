//QUIZ PART OF CODE:

//Creating the Quiz Questions
const questions = [
    {
        question: "If you were to take a hike in the woods, which option would you prefer?", //Question
        choices: ["Go on the hike alone spending the time just enjoying the peaceful ambience", //Answer Choice 1
                  "Bring a friend along and enjoy your time talking with eachother", //Answer Choice 2
        ],
        choiceWeights: [
            {pop: 0, ambient: +50}, //choiceWeights for first choice
            {pop: +25, ambient: 0}, //choiceWeights for second choice
        ],
    },
    
        {
            question: "If you were to go to a concert, which option would you prefer?", //Question
            choices: ["Sit in a seat and just enjoy the concert", //Answer choice 1
                      "Sing and dance along with the music", //Answer Choice 2
            ],
            choiceWeights: [
                {chill: +25, dance: 0}, //choiceWeights for first choice
                {chill: 0, dance: +50}, //choiceWeights for second choice
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
    let chill = 0;
    let pop = 0;
    let dance = 0;
    let ambient = 0;

    let dominantGenre;
    
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
        // console.log(choiceWeights)
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
    async function displayResults() {
        const resultsContent = document.getElementById("resultsContent");
    
        //Used to make sure that the old results are cleared before the new
        //ones are displayed
        // resultsContent.innnerHTML = ""; 
        // const resultsText = document.createElement("p");
        // resultsText.textContent = "Results:";
        // resultsContent.appendChild(resultsText);
    
        //Used to calculate all the genre values obtained from each question
        //and display them for the user to see
        //Will later on have the Spotify API take in these values to get
        //an album in that genre
        // for (const key in choiceWeights) {
        //     const resultItem = document.createElement("p");
        //     resultItem.textContent = `${key}: ${choiceWeights[key]}`;
        //     resultsContent.appendChild(resultItem);
        // }
    
        //Calculating the dominant genre by using the choiceWeights
        const dominantGenre = calculateDominantGenre(choiceWeights);
    
        //Call Spotify API using the dominant genre
        const tokenResponse = await getToken(dominantGenre);
        const trackInfo = await getTrackInfo(tokenResponse.access_token, dominantGenre);
        console.log(trackInfo)
    
        //Display the recommended song on webpage
        displayRecommendedTracks(trackInfo);
    }
    
    function calculateDominantGenre(choiceWeights) {
        let maxScore = -Infinity;
    
        //Loop through each genre score in choiceWeights
        for (const genre in choiceWeights){
            if (choiceWeights.hasOwnProperty(genre)){
                //check through each genre's score to see if it is higher than current maxScore
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
    
        //Clear any previous results
        resultsContent.innerHTML = "";
    
        //Create a heading to display the recommended track
        const heading = document.createElement("h2");
        heading.textContent = "Recommended Song:";
        resultsContent.appendChild(heading);
    
        //Loop through each track in the trackInfo response
        trackInfo.tracks.forEach(track => {
            //Create a div to hold track information
            const trackDiv = document.createElement("div");
    
            //Create HTML elements for track name, artist, & album
            const trackName = document.createElement("p");
            trackName.textContent = "Track Name: " + track.name;
    
            const artists = document.createElement("p");
            artists.textContent = "Artists: " + track.artists.map(artist => artist.name).join(", ");
    
            const album = document.createElement("p");
            album.textContent = "Album: " + track.album.name;
    
            //Append track info to trackDiv
            trackDiv.appendChild(trackName);
            trackDiv.appendChild(artists);
            trackDiv.appendChild(album);
    
            //Append trackDiv to resultsContent
            resultsContent.appendChild(trackDiv);
        });
    }
    
    //Must add these to ensure that the quiz and results pages are invisible
    //when the web quiz is first launched
    document.getElementById("quiz").style.display = "none";
    document.getElementById("results").style.display = "none";


//SPOTIFY API PART OF CODE
//Creating the constants for client_id and client_secret
const client_id = 'd7ed26ea3e8d4b3096480eb9f06b86a2';
const client_secret = 'c1eac9aaa6c14ac2b482107a44994a18';

//An async function is used here so that our response is not given until the fetch is complete,
//Protecting us from having an execution order issue
//This function is meant to get the user's token to ensure that the token is valid before 
//allowing the function to continue
async function getToken(dominantGenre) {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token',
        {
            method: 'POST',
            body: new URLSearchParams({
                'grant_type': 'client_credentials',
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
            },
        });
    
        if(!response.ok){
            throw new error('Failed to fetch token');
        }
    
        return await response.json();
    }
    catch (error) {
        console.error("Error in getting token", error);
        throw error;
    }
}

//An async function is used here so that our response is not given until the fetch is complete,
//Protecting us from having an execution order issue
//This function gets track info about a specific track using our access_token 
async function getTrackInfo(access_token, genre) {
    //const response = await fetch("https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT", {

    //This line can be used to see all of the available genre seeds in the Spotify API
    //const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });
    
    return await response.json();
}

getToken(dominantGenre).then(async response => {
    // console.log("Token response: ", response);
    const trackInfo = await getTrackInfo(response.access_token, dominantGenre);
    // console.log("Track Info: ", trackInfo);
    displayRecommendedTracks(trackInfo);
}).catch(error => {
    console.error("Error getting token: ",error);
});


