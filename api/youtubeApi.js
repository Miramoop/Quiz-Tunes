//import { getTrackInfo } from "./spotifyServices";

//API KEY = AIzaSyByxk2jK-t32JkvnCeza8q-Lfs2eLsXJPY

//Testing
const track = {
    name: "Never Gonna Give You Up",
    artist: {
        name: "Rick Astley"
    }
};

// Define constants
const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyByxk2jK-t32JkvnCeza8q-Lfs2eLsXJPY';
const PART = 'snippet';
const MAX_RESULTS = 1;
const QUERY = `${track.name} by ${track.artist.name}`;
const TYPE = 'video';
const VIDEO_EMBEDDABLE = 'true';

const fetchUrl = `${BASE_URL}?part=${PART}&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(QUERY)}&type=${TYPE}&videoEmbeddable=${VIDEO_EMBEDDABLE}&key=${API_KEY}`;

const videoSection = document.getElementById('videoSection'); 

fetch(fetchUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); 
    })
    .then(data => {
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
    })
    .catch(error => {
        console.error('Error fetching YouTube API data:', error);
    });




