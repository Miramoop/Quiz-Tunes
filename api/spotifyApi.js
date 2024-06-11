const client_id = '';
const client_secret = '';

async function getToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
        },
    }

    try {
        const response = await fetch(url, payload);
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            return data; 
        } else {
            throw new Error("Failed to fetch token: " + data.error);
        } 
    } catch (error) {
        displayError("Error getting token: " + error.message);
        console.error("Error getting token: ", error);
        throw error;
    }
}

async function getTrackInfo(access_token, genre) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + access_token },
        });

        //throwing error to test the response
        // if (true) throw new Error('Simulated API Error');

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Failed to fetech track info: " + errorData.error);
        }

        return await response.json();
    } catch (error) {
        displayError("Error fetching track info: " + error.message);
        console.error("Error fetching track info: ", error);
        throw error;
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = message;
    toggleClasses(document.getElementById('errorContainer'), 'hidden', 'active');
}

export { getTrackInfo, getToken }; 
