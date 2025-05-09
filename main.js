import { getTrackInfo, getToken } from "./api/spotifyApi.js";
import { fetchYouTubeData } from "./api/youtubeApi.js";

let questions;
let weights;
let currentQuestionIndex = 0;
let dominantGenre;

function toggleClasses(element, removeClass, addClass) {
  element.classList.remove(removeClass);
  element.classList.add(addClass);
}

fetch("data/questions.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    questions = data;
    displayQuestion(0);
  })
  .catch((error) => {
    toggleClasses(document.getElementById("home"), "active", "hidden");
    toggleClasses(document.getElementById("errorScreen"), "hidden", "active");

    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent =
      "An error occurred in displaying the questions data. Please try again!";
    errorContainer.setAttribute("role", "alert");
    document
      .getElementById("resetQuizAfterErrorButton")
      .addEventListener("click", resetQuiz);
  });

fetch("data/weights.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    weights = data;
  })
  .catch((error) => {
    toggleClasses(document.getElementById("home"), "active", "hidden");
    toggleClasses(document.getElementById("errorScreen"), "hidden", "active");

    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent =
      "An error occurred in displaying the questions data. Please try again!";
    errorContainer.setAttribute("role", "alert");
    document
      .getElementById("resetQuizAfterErrorButton")
      .addEventListener("click", resetQuiz);
  });

function startQuiz() {
  toggleClasses(document.getElementById("home"), "active", "hidden");
  toggleClasses(document.getElementById("quiz"), "hidden", "active");
  getToken()
    .then(() => {
      displayQuestion(0);
    })
    .catch((error) => {
      console.error("Error getting token:", error);
    });
}

document.getElementById("startQuizButton").addEventListener("click", startQuiz);
document
  .getElementById("startQuizButton")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startQuiz();
    }
  });

function resetQuiz() {
  toggleClasses(document.getElementById("quiz"), "active", "hidden");
  toggleClasses(document.getElementById("results"), "active", "hidden");
  toggleClasses(document.getElementById("resultsContent"), "active", "hidden");
  toggleClasses(document.getElementById("buttonHolder"), "active", "hidden");
  toggleClasses(document.getElementById("home"), "hidden", "active");
  toggleClasses(document.getElementById("errorScreen"), "active", "hidden");

  fetchButton.disabled = false;
  spotifyTrackButton.disabled = false;

  const videoContent = document.getElementById("videoContent");
  videoContent.innerHTML = "";

  const spotifyContent = document.getElementById("spotifyContent");
  spotifyContent.innerHTML = "";

  currentQuestionIndex = 0;
  displayQuestion(0);

  location.reload();
}

document.getElementById("resetQuizButton").addEventListener("click", resetQuiz);
document
  .getElementById("resetQuizButton")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      resetQuiz();
    }
  });

function displayQuestion(index) {
  const questionContainer = document.getElementById("questionText");
  const choicesContainer = document.getElementById("choicesText");
  const questionImage = document.getElementById("questionImage");
  const progressImage = document.getElementById("progressImage");
  const currentQuestion = questions[index];

  questionContainer.textContent = currentQuestion.question;

  questionImage.setAttribute("src", questions[index].questionImage.src);
  questionImage.setAttribute("alt", questions[index].questionImage.alt);

  progressImage.setAttribute("src", questions[index].progressImage.src);
  progressImage.setAttribute("alt", questions[index].progressImage.alt);

  let choicesHTML = "";
  currentQuestion.choices.forEach((choiceObj, idx) => {
    choicesHTML += `
      <button id="choice-${idx}" type="button" tabindex="0" aria-label="Choice ${
      idx + 1
    }: ${choiceObj.choice}">
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
      if (event.key === "Enter" || event.key === " ") {
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
    toggleClasses(document.getElementById("quiz"), "active", "hidden");
    toggleClasses(document.getElementById("quizComplete"), "hidden", "active");
  }
}

document
  .getElementById("quizComplete")
  .addEventListener("click", displayResults);

function displayResults() {
  toggleClasses(document.getElementById("quizComplete"), "active", "hidden");
  toggleClasses(document.getElementById("results"), "hidden", "active");
  toggleClasses(document.getElementById("resultsContent"), "hidden", "active");
  toggleClasses(document.getElementById("buttonHolder"), "hidden", "active");

  displayRecommendedTracks();
}

document
  .getElementById("calculateResults")
  .addEventListener("click", displayResults);

document
  .getElementById("calculateResults")
  .removeEventListener("click", displayResults);

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
      localStorage.getItem("access_token"),
      dominantGenre
    );

    localStorage.setItem("track_Name", trackInfo.tracks.items[0].name);
    localStorage.setItem(
      "artist_Name",
      trackInfo.tracks.items[0].artists[0].name
    );
    localStorage.setItem(
      "spotify_Link",
      trackInfo.tracks.items[0].external_urls.spotify
    );

    const resultsContent = document.getElementById("resultsContent");
    resultsContent.setAttribute("role", "region");
    resultsContent.setAttribute("aria-live", "polite");
    resultsContent.setAttribute("aria-atomic", "true");
    resultsContent.innerHTML = "";

    trackInfo.tracks.items.forEach((track) => {
      const trackDiv = document.createElement("div");
      trackDiv.setAttribute("id", "trackDiv");
      trackDiv.setAttribute("role", "article");
      trackDiv.setAttribute("aria-live", "assertive");
      trackDiv.setAttribute("aria-atomic", "true");
      trackDiv.innerHTML = `
        <img src="${track.album.images[1].url}" alt="Album Cover for ${
        track.album.name
      }">
        <p>Track Name: ${track.name}</p>
        <p>Artist: ${track.artists.map((artist) => artist.name).join(", ")}</p>
        <p>Album: ${track.album.name}</p>
        <p>Genre: ${
          dominantGenre.charAt(0).toUpperCase() + dominantGenre.slice(1)
        }</p>
      `;

      resultsContent.appendChild(trackDiv);
    });
  } catch (error) {
    toggleClasses(document.getElementById("quizComplete"), "active", "hidden");
    toggleClasses(document.getElementById("results"), "active", "hidden");
    toggleClasses(
      document.getElementById("resultsContent"),
      "active",
      "hidden"
    );
    toggleClasses(
      document.getElementById("spotifyContent"),
      "active",
      "hidden"
    );
    toggleClasses(document.getElementById("buttonHolder"), "active", "hidden");
    toggleClasses(document.getElementById("errorScreen"), "hidden", "active");
    toggleClasses(
      document.getElementById("errorContainer"),
      "hidden",
      "active"
    );

    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent =
      "An error occurred in displaying recommended track. Please try again!";
    errorContainer.setAttribute("aria-label", errorContainer.textContent);
    document
      .getElementById("resetQuizAfterErrorButton")
      .addEventListener("click", resetQuiz);
  }
}

const videoSection = document.getElementById("videoContent");
const fetchButton = document.getElementById("youtubeVideoButton");

const fetchYouTubeDataAndDisplay = async () => {
  fetchButton.disabled = true;

  const trackName = localStorage.getItem("track_Name");
  const artistName = localStorage.getItem("artist_Name");

  try {
    const data = await fetchYouTubeData(trackName, artistName);

    if (!data.items) {
      throw new Error("No items found in the response");
    }

    data.items.forEach((el) => {
      const videoId = el.id.videoId;
      const videoTitle = el.snippet.title;

      const videoLink = `https://www.youtube.com/watch?v=${videoId}`;

      const iframe = document.createElement("iframe");
      iframe.title = `${videoTitle}`;
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.frameBorder = "0";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;

      const videoContainer = document.createElement("div");
      videoContainer.className = "video-container";
      videoContainer.innerHTML = `<h2>${videoTitle}</h2>`;
      videoContainer.appendChild(iframe);

      const noScript = document.createElement("noscript");
      noScript.innerHTML = `<a href="${videoLink}"> Your browser does not support this type of embed. Watch the video here instead`;
      videoContainer.appendChild(noScript);

      videoSection.appendChild(videoContainer);
    });
  } catch (error) {
    toggleClasses(document.getElementById("quizComplete"), "active", "hidden");
    toggleClasses(document.getElementById("results"), "active", "hidden");
    toggleClasses(
      document.getElementById("resultsContent"),
      "active",
      "hidden"
    );
    toggleClasses(
      document.getElementById("spotifyContent"),
      "active",
      "hidden"
    );
    toggleClasses(document.getElementById("buttonHolder"), "active", "hidden");
    toggleClasses(document.getElementById("errorScreen"), "hidden", "active");

    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent =
      "An error occurred in displaying YouTube video. Please try again!";
    errorContainer.setAttribute("aria-label", errorContainer.textContent);
    document
      .getElementById("resetQuizAfterErrorButton")
      .addEventListener("click", resetQuiz);

    fetchButton.disabled = false;
  }
};

fetchButton.addEventListener("click", fetchYouTubeDataAndDisplay);
fetchButton.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    fetchYouTubeDataAndDisplay();
  }
});

const spotifyContent = document.getElementById("spotifyContent");
const spotifyTrackButton = document.getElementById("spotifyTrackButton");

const displaySpotifyLink = async () => {
  try {
    spotifyTrackButton.disabled = true;

    const spotifyLink = localStorage.getItem("spotify_Link");

    const result = `
                  <div id="spotifyContent">
                  <a id="spotifyLink" href=${spotifyLink} target="_blank">Link to Spotify</a>
              `;

    spotifyContent.innerHTML = result;
  } catch (error) {
    toggleClasses(document.getElementById("quizComplete"), "active", "hidden");
    toggleClasses(document.getElementById("results"), "active", "hidden");
    toggleClasses(
      document.getElementById("resultsContent"),
      "active",
      "hidden"
    );
    toggleClasses(
      document.getElementById("spotifyContent"),
      "active",
      "hidden"
    );
    toggleClasses(document.getElementById("buttonHolder"), "active", "hidden");
    toggleClasses(document.getElementById("errorScreen"), "hidden", "active");

    const errorContainer = document.getElementById("errorContainer");
    errorContainer.textContent =
      "An error occurred in displaying Spotify Link. Please try again!";
    errorContainer.setAttribute("aria-label", errorContainer.textContent);
    document
      .getElementById("resetQuizAfterErrorButton")
      .addEventListener("click", resetQuiz);
  }
};

spotifyTrackButton.addEventListener("click", displaySpotifyLink);
spotifyTrackButton.addEventListener("keydown", function (event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    displaySpotifyLink();
  }
});
