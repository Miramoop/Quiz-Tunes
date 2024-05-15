//Basic JavaScript Code found at: https://github.com/spotify/web-api-examples/blob/master/authorization/client_credentials/app.js
//It is a basic node.js script that performs the Client Credentials Authorization to authenticate against the Spotify Accounts 


//Creating the constants for client_id and client_secret
const client_id = 'd7ed26ea3e8d4b3096480eb9f06b86a2';
const client_secret = 'c1eac9aaa6c14ac2b482107a44994a18';


//An async function is used here so that our response is not given until the fetch is complete,
//Protecting us from having an execution order issue
//This function is meant to get the user's token to ensure that the token is valid before 
//allowing the function to continue
async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token',
    {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        },
    });

    return await response.json();
}


//An async function is used here so that our response is not given until the fetch is complete,
//Protecting us from having an execution order issue
//This function gets track info about a specific track using our access_token 
async function getTrackInfo(access_token) {
    //const response = await fetch("https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT", {

    //This line can be used to see all of the available genre seeds in the Spotify API
    //const response = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
    const response = await fetch("https://api.spotify.com/v1/recommendations?limit=1&seed_genres=chill", {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });

    return await response.json();
}

getToken().then(response => {
    getTrackInfo(response.access_token).then(profile => {
        console.log(profile)
    })
});