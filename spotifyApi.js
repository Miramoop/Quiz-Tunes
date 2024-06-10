// import {dominantGenre} from 'main.js';

let dominantGenre = "chill";

const client_id = '8a649d0e1cf74b1c89b6874845b17646';
const client_secret = '';

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

async function getTrackInfo(access_token, genre) {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    console.log(response);

    return await response.json();
}

getToken(dominantGenre)
  .then(async (response) => {
    // console.log("Token response: ", response);
    const trackInfo = await getTrackInfo(response.access_token, dominantGenre);
    console.log("Track Info: ", trackInfo);
  });