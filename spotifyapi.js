//SPOTIFY API PART OF CODE
//Creating the constants for client_id and client_secret
//Song Recommender
const client_id = 'eb9584f3368842e2963869356c4cd09a';
const client_secret = '0ae2f080ee224ca9bd236079d4083f20';

//Album Recommender
// const client_id = 'd7ed26ea3e8d4b3096480eb9f06b86a2';
// const client_secret = 'c1eac9aaa6c14ac2b482107a44994a18';

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
    //This line can be used to see all of the available genre seeds in the Spotify API
    //const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });
    
    console.log(response);
    
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