// import { getTrackInfo } from './api/spotifyServices.js'; //getTrack would need to be added to import if add ability to save track to library
import { getTrackInfo, getToken } from './api/spotifyApi.js';
import { fetchYouTubeData } from './api/youtubeApi.js';

let questions;
let weights;
let currentQuestionIndex = 0;
let dominantGenre;

fetch('data/questions.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    questions = data;
    displayQuestion(0); 
  })
  .catch((error) => {
    // const errorContainer = document.getElementById('errorContainer');
    // errorContainer.textContent = 'An error occurred while loading data. Please try again later.';
    // errorContainer.setAttribute('aria-live', 'assertive');
    console.error('Error loading JSON:', error);
  });

fetch('data/weights.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    weights = data;
  })
  .catch((error) => {
    // const errorContainer = document.getElementById('errorContainer');
    // errorContainer.textContent = 'An error occurred while loading data. Please try again later.';
    // errorContainer.setAttribute('aria-live', 'assertive');
    console.error('Error loading JSON:', error);
  });

function toggleClasses(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}

function startQuiz() {
  toggleClasses(document.getElementById('home'), 'active', 'hidden');
  toggleClasses(document.getElementById('quiz'), 'hidden', 'active');
  getToken()
      .then(() => {
          displayQuestion(0); 
      })
      .catch(error => {
          console.error("Error getting token:", error);
      });
}

document.getElementById('startQuizButton').addEventListener('click', startQuiz);

function resetQuiz() {
  toggleClasses(document.getElementById('quiz'), 'active', 'hidden');
  toggleClasses(document.getElementById('results'), 'active', 'hidden');
  toggleClasses(document.getElementById('resultsContent'), 'active', 'hidden');
  toggleClasses(document.getElementById('buttonHolder'), 'active', 'hidden');
  toggleClasses(document.getElementById('home'), 'hidden', 'active');

  fetchButton.disabled = false;
  spotifyTrackButton.disabled = false;

  const videoContent = document.getElementById('videoContent');
  videoContent.innerHTML = '';

  const spotifyContent = document.getElementById('spotifyContent');
  spotifyContent.innerHTML = '';

  currentQuestionIndex = 0;
  displayQuestion(0);
}

document.getElementById('resetQuizButton').addEventListener('click', resetQuiz);

// By passing in the index of the question we want to display we can more easily load the first question.
// This will also give us options down the road to add features such as being able to click on the progress dots to go back to a specific question.
function displayQuestion(index) {
  const questionContainer = document.getElementById('questionText');
  const choicesContainer = document.getElementById('choicesText');
  const questionImage = document.getElementById('questionImage');
  const progressImage = document.getElementById('progressImage');
  const currentQuestion = questions[index];

  questionContainer.textContent = currentQuestion.question;

  questionImage.setAttribute('src', questions[index].questionImage.src);
  questionImage.setAttribute('alt', questions[index].questionImage.alt);
  
  progressImage.setAttribute('src', questions[index].progressImage.src);
  progressImage.setAttribute('alt', questions[index].progressImage.alt);
    
  let choicesHTML = '';
  currentQuestion.choices.forEach((choiceObj, idx) => {
    choicesHTML += `
    <button id="choice-${idx}" type="button" tabindex="0" aria-label="Choice ${idx + 1}: ${choiceObj.choice}">
    ${choiceObj.choice}
    </button>
    `;
  });
    
  choicesContainer.innerHTML = choicesHTML;
  
  currentQuestion.choices.forEach((choiceObj, idx) => {
    const button = document.getElementById(`choice-${idx}`);
    button.onclick = () => {    
      updateChoiceWeights(choiceObj.weights);
      handleQuestionUpdate();
    };

    button.onkeydown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        updateChoiceWeights(choiceObj.weights);
        handleQuestionUpdate();
      }
    };
  });

    questionContainer.focus();
}

function updateChoiceWeights(choiceWeights) {   
  for (let choice in choiceWeights) {
    if (weights.hasOwnProperty(choice)) {
      weights[choice] += choiceWeights[choice];
    } else {
      weights[choice] = choiceWeights[choice];
    }
  }
}

function handleQuestionUpdate() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion(currentQuestionIndex);
  } else {
    toggleClasses(document.getElementById('quiz'), 'active', 'hidden');
    toggleClasses(document.getElementById('quizComplete'), 'hidden', 'active');
  }
}

function displayResults() {
  toggleClasses(document.getElementById('quizComplete'), 'active', 'hidden');
  toggleClasses(document.getElementById('results'), 'hidden', 'active');
  toggleClasses(document.getElementById('resultsContent'), 'hidden', 'active');
  toggleClasses(document.getElementById('buttonHolder'), 'hidden', 'active');

  displayRecommendedTracks();
}

document
  .getElementById('quizComplete')
  .addEventListener('click', displayResults);

function calculateDominantGenre(weights) {
  let maxValue = -Infinity;
  let dominantGenre;

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

async function displayRecommendedTracks() {
  try {
    dominantGenre = calculateDominantGenre(weights);
    const trackInfo = await getTrackInfo(
      localStorage.getItem('access_token'),
      dominantGenre
    );

    console.log(trackInfo);

    localStorage.setItem('track_Name', trackInfo.tracks[0].name);
    localStorage.setItem('artist_Name', trackInfo.tracks[0].artists[0].name);
    localStorage.setItem(
      'spotify_Link',
      trackInfo.tracks[0].external_urls.spotify
    );

    //test this w/ screen reader & add to calculating results page?
    const resultsContent = document.getElementById('resultsContent');
    resultsContent.setAttribute('role', 'region');
    resultsContent.setAttribute('aria-live', 'polite');
    resultsContent.setAttribute('aria-atomic', 'true');
    resultsContent.innerHTML = ''; // Clear previous content

    trackInfo.tracks.forEach((track) => {
      const trackDiv = document.createElement('div');
      trackDiv.setAttribute('id', 'trackDiv');
      trackDiv.setAttribute('role', 'article');
      trackDiv.setAttribute('aria-live', 'assertive');
      trackDiv.setAttribute('aria-atomic', 'true');
      trackDiv.innerHTML = `
        <img src="${track.album.images[1].url}" alt="Album Cover for ${track.album.name}">
        <p>Track Name: ${track.name}</p>
        <p>Artist: ${track.artists.map((artist) => artist.name).join(', ')}</p>
        <p>Album: ${track.album.name}</p>
        <p>Genre: ${dominantGenre.charAt(0).toUpperCase() + dominantGenre.slice(1)}</p>
      `;

      resultsContent.appendChild(trackDiv);
    });
  } catch (error) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = 'Error in Displaying Results. Please try again.';
    errorContainer.setAttribute('role', 'alert');
    console.error('Error in Displaying Results. Please try again.', error);
  }
}

//original function
// async function displayRecommendedTracks() {
//   dominantGenre = calculateDominantGenre(weights);
//   const trackInfo = await getTrackInfo(
//     localStorage.getItem('access_token'),
//     dominantGenre
//   );
//   console.log(trackInfo);

//   localStorage.setItem('track_Name', trackInfo.tracks[0].name);
//   localStorage.setItem('artist_Name', trackInfo.tracks[0].artists[0].name);
//   localStorage.setItem(
//     'spotify_Link',
//     trackInfo.tracks[0].external_urls.spotify
//   );

//   trackInfo.tracks.forEach((track) => {
//     const result = `
//                 <div id="resultsContent">
//                     <h2>Your Recommended Song is: </h2>
                
//                 <div id="trackDiv">
//                     <img src="${track.album.images[1].url}" alt="Album Cover for ${track.album.name}">
//                     <p>Track Name: ${track.name}</p>
//                     <p>Artist: ${track.artists
//                       .map((artist) => artist.name)
//                       .join(', ')}</p>
//                     <p>Album: ${track.album.name}</p>
//                     <p>Genre: ${
//                       dominantGenre.charAt(0).toUpperCase() +
//                       dominantGenre.slice(1)
//                     }</p>
//                 </div>
//                 </div>
//             `;

//     resultsContent.innerHTML = result;
//     //localStorage.setItem("track_id",track.id); //only needed for saving track to library feature

//     if (!result) {
//     const errorContainer = document.getElementById('errorContainer');
//     errorContainer.textContent = 'Error in Displaying Results. Please try again.';
//     errorContainer.setAttribute('aria-live', 'assertive');
//     console.error('Error in Displaying Results. Please try again.', error);
//     }
//   });
// }

const videoSection = document.getElementById('videoContent');
const fetchButton = document.getElementById('youtubeVideoButton');

//To Do - Make the items within the data.items.forEach(el => {}) into html elements similar to displayRecommendedTracks
const fetchYouTubeDataAndDisplay = async () => {
  fetchButton.disabled = true;

  // Get trackName and artistName from localStorage
  const trackName = localStorage.getItem('track_Name');
  const artistName = localStorage.getItem('artist_Name');

  // Fetch YouTube data and display videos
  try {
    const data = await fetchYouTubeData(trackName, artistName);
    console.log('API Response Data:', data);

    if (!data.items) {
      throw new Error('No items found in the response');
    }

    data.items.forEach((el) => {
      const videoId = el.id.videoId;
      const videoTitle = el.snippet.title;

      const iframe = document.createElement('iframe');
      iframe.title = `${videoTitle}`;
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.frameBorder = '0';
      iframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      const videoContainer = document.createElement('div');
      videoContainer.className = 'video-container';
      videoContainer.innerHTML = `<h2>${videoTitle}</h2>`;
      videoContainer.appendChild(iframe);

      videoSection.appendChild(videoContainer);
    });

    // Remove the event listener after fetching and displaying the videos
    // fetchButton.removeEventListener('click', fetchYouTubeDataAndDisplay);
  } catch (error) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = 'Error in Displaying YouTube Video. Please try again.';
    errorContainer.setAttribute('aria-live', 'assertive');
    console.error('Error displaying YouTube videos:', error);
    fetchButton.disabled = false;
  }
};

fetchButton.addEventListener('click', fetchYouTubeDataAndDisplay);

const spotifyContent = document.getElementById('spotifyContent');
const spotifyTrackButton = document.getElementById('spotifyTrackButton');

const displaySpotifyLink = async () => {
  spotifyTrackButton.disabled = true;

  const spotifyLink = localStorage.getItem('spotify_Link');

  const result = `
                <div id="spotifyContent">
                <a id="spotifyLink" href=${spotifyLink} target="_blank">Link to Spotify</a>
            `;

  spotifyContent.innerHTML = result;
};

spotifyTrackButton.addEventListener('click', displaySpotifyLink);
///Would need to add if saving track feature gets added back
// document.getElementById("saveTrack").addEventListener('click', getTrack);
