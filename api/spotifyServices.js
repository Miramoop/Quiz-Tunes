const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const codeVerifier = generateRandomString(64);

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}

const getCodeChallenge = async (verifier) => {
  const hashed = await sha256(verifier);
  return base64encode(hashed);
}

const clientId = '8a649d0e1cf74b1c89b6874845b17646';

const redirectUri = 'http://localhost:5500';
// const redirectUri = 'https://miramoop.github.io/QuizTunes/';
const scope = 'user-read-private user-read-email user-library-modify user-library-read';
const authUrl = new URL("https://accounts.spotify.com/authorize");

//to stop api calls, comment out this code (useful when testing)
const initiateAuthFlow = async () => {
  const codeChallenge = await getCodeChallenge(codeVerifier);
  window.localStorage.setItem('code_verifier', codeVerifier);

  const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();
}

const getToken = async (code) => {
  const url = "https://accounts.spotify.com/api/token";
  const storedCodeVerifier = localStorage.getItem('code_verifier');

  if (!storedCodeVerifier) {
      console.error("Code verifier not found in localStorage");
      return;
  }

  const payload = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          code_verifier: storedCodeVerifier,
      }),
  }

  const response = await fetch(url, payload);
  const data = await response.json();

  if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
  } else {
      console.error("Error getting token: ", data);
  }
}

const getTrackInfo = async (access_token, genre) => {
  access_token = localStorage.getItem('access_token');

  const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + access_token },
  });

  return await response.json();
}

const handleRedirect = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
      await getToken(code);
  } else {
      console.log("Authorization code not found in URL parameters.");
  }
}

const checkAuth = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
      await initiateAuthFlow();
  } else {
      await handleRedirect();
  }
}

checkAuth().catch(error => {
  console.error("Error in checkAuth function: ", error);
});

export {getTrackInfo};



//Used for Saving Track (Feature is on hold right now)
//getTrack would need to be added to export if saving track to library is included feature

// const getTrack = async (access_token, trackId) => {
//   access_token = localStorage.getItem('access_token');
//   trackId = localStorage.getItem('track_id');

//   try {
//     const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
//       method: 'PUT',
//       body: {
//         ids: "string"
//       },
//       headers: {
//         'Authorization': `Bearer ${access_token}`,
//         'Content-Type': 'application/json'
//       },
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       alert('Error in Saving Track! Please Try Again');
//       throw new Error(`Error ${response.status}: ${errorData.message}`);
//     }

//     alert('Track was Saved Successfully!');
//     return response.status === 200 ? 'Track saved successfully' : await response.json();
//   } catch (error) {
//     console.error('There was an error with the fetch operation:', error);
//     throw error;
//   }
// };




  


