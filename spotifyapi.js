// //Song Recommender App
// const client_id = 'eb9584f3368842e2963869356c4cd09a';
// const client_secret = '0ae2f080ee224ca9bd236079d4083f20';

//Album Recommender App
// const client_id = 'd7ed26ea3e8d4b3096480eb9f06b86a2';
// const client_secret = 'c1eac9aaa6c14ac2b482107a44994a18';

//An async function that takes in the parameter of dominantGenre
//It contains try and catch blocks to ensure that any errors will
//be caught. The fetch request is sending a POST request to the 
//Spotify token endpoint to obtain an access token which can be used 
//in later API requests to obtain information such as a track

//DON'T NEED THIS CODE BECAUSE SPOTIFYAUTHORIZATION.js ALREADY DOES THIS
// async function getToken(dominantGenre) {
//     try {
//         const response = await fetch('https://accounts.spotify.com/api/token',
//         {
//             method: 'POST',
//             body: new URLSearchParams({
//                 'grant_type': 'client_credentials',
//             }),
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
//             },
//         });
    
//         if(!response.ok){
//             throw new error('Failed to fetch token');
//         }
    
//         return await response.json();
//     }
//     catch (error) {
//         console.error("Error in getting token", error);
//         throw error;
//     }
// }

//An async function that takes in the parameters of our access token and genre.
//Then makes a GET request to the Spotify API Recommendations endpoint to 
//receive data about a random track within the specified dominantGenre
//It outputs this into the console for testing purposes. Then parses the response
//into the json file.

//WILL STILL NEED THIS SO THAT THIS API REQUEST OCCURS
async function getTrackInfo(access_token, genre) {
    const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + access_token },
    });
    
    console.log(response); //Testing
    
    return await response.json();
}

//A function that explains the order of the previous functions, first an access
//token is received by the getToken function then the recommended track info is 
//gathered by the getTrackInfo fucntion which then passes that data into the 
//displayRecommendedTracks function. There is a catch block implemented that 
//ouputs whether a token was able to be received
// getToken(dominantGenre).then(async response => {
//     const trackInfo = await getTrackInfo(response.access_token, dominantGenre);
//     displayRecommendedTracks(trackInfo);
// }).catch(error => {
//     console.error("Error getting token: ",error);
// });