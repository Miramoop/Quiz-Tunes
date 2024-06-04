import { getTrackInfo } from "./api/spotifyServices.js"; //getTrack would need to be added to import if add ability to save track to library
import { fetchYouTubeData } from "./api/youtubeApi.js";

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
    //console.log(questions); //Testing
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

let weights; 

  fetch('data/weights.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    weights = data;
    //console.log(weights); //Testing
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });

    let currentQuestionIndex = 0;  

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

        toggleClasses(document.getElementById("resultsContent"), "active", "hidden");
        toggleClasses(document.getElementById("buttonHolder"), "active", "hidden");

        fetchButton.disabled = false;
        spotifyTrack.disabled = false;

        const videoContent = document.getElementById("videoContent");
        videoContent.innerHTML = "";

        const spotifyContent = document.getElementById("spotifyContent");
        spotifyContent.innerHTML = "";

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
        toggleClasses(document.getElementById("resultsContent"), "hidden", "active");
        toggleClasses(document.getElementById("buttonHolder"), "hidden", "active");
 
        displayRecommendedTracks();
    }

    document.getElementById("quizComplete").addEventListener('click', displayResults);

    function calculateDominantGenre(weights) {
    let maxValue = -Infinity;
    let dominantGenre;

    for (const genre in weights) {
        if (weights.hasOwnProperty(genre)) {
           //console.log(`Genre: ${genre}, Weight: ${weights[genre]}`); // Testing

            if (weights[genre] > maxValue) {
                maxValue = weights[genre];
                dominantGenre = genre;
            }
        }
    }

    //console.log(`Dominant Genre: ${dominantGenre}`); // Testing
    return dominantGenre;
}
    async function displayRecommendedTracks(){
        dominantGenre = calculateDominantGenre(weights);
        const trackInfo = await getTrackInfo(localStorage.getItem('access_token'), dominantGenre);
        console.log(trackInfo);

        localStorage.setItem("track_Name",trackInfo.tracks[0].name);
        localStorage.setItem("artist_Name",trackInfo.tracks[0].artists[0].name);
        localStorage.setItem("spotify_Link",trackInfo.tracks[0].external_urls.spotify);
        
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
                </div>
            `;

            resultsContent.innerHTML = result;
            //localStorage.setItem("track_id",track.id); //only needed for saving track to library feature

            if(!result) {
                alert('Error in Displaying Results! Please Try Again!');
            }
        });
    }

const videoSection = document.getElementById('videoContent');
const fetchButton = document.getElementById('youtubeVideo');

const fetchYouTubeDataAndDisplay = async () => {

    fetchButton.disabled = true;

    // Get trackName and artistName from localStorage
    const trackName = localStorage.getItem("track_Name");
    const artistName = localStorage.getItem("artist_Name");

    // Fetch YouTube data and display videos
    try {
        const data = await fetchYouTubeData(trackName, artistName);
        console.log('API Response Data:', data);

        if (!data.items) {
            throw new Error('No items found in the response');
        }

        data.items.forEach(el => {
            const videoId = el.id.videoId;
            const videoTitle = el.snippet.title;

            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = '560';
            iframe.height = '315';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;

            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            videoContainer.innerHTML = `<h3>${videoTitle}</h3>`;
            videoContainer.appendChild(iframe);

            videoSection.appendChild(videoContainer);
        });

        // Remove the event listener after fetching and displaying the videos
       // fetchButton.removeEventListener('click', fetchYouTubeDataAndDisplay);
    } catch (error) {
        console.error('Error displaying YouTube videos:', error);
        fetchButton.disabled = false;
    }
};

fetchButton.addEventListener('click', fetchYouTubeDataAndDisplay);

const spotifyContent = document.getElementById('spotifyContent');
const spotifyTrack = document.getElementById('spotifyTrack');

const displaySpotifyLink = async () => {
    spotifyTrack.disabled = true;

    const spotifyLink = localStorage.getItem("spotify_Link");

    const result = `
                <div id="spotifyContent">
                <a id="spotifyLink" href=${spotifyLink} target="_blank">Link to Spotify</a>
            `;
    
    spotifyContent.innerHTML = result;

}

spotifyTrack.addEventListener('click', displaySpotifyLink);
///Would need to add if saving track feature gets added back
// document.getElementById("saveTrack").addEventListener('click', getTrack);



