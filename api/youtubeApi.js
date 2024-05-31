const fetchYouTubeData = async (trackName, artistName) => {
    const BASE_URL = 'https://youtube.googleapis.com/youtube/v3/search';
    const API_KEY = 'AIzaSyByxk2jK-t32JkvnCeza8q-Lfs2eLsXJPY';
    const PART = 'snippet';
    const MAX_RESULTS = 1;
    const QUERY = `${trackName} by ${artistName}`;
    const TYPE = 'video';
    const VIDEO_EMBEDDABLE = 'true';

    const fetchUrl = `${BASE_URL}?part=${PART}&maxResults=${MAX_RESULTS}&q=${encodeURIComponent(QUERY)}&type=${TYPE}&videoEmbeddable=${VIDEO_EMBEDDABLE}&key=${API_KEY}`;

    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching YouTube API data:', error);
        throw error;
    }
};

export { fetchYouTubeData };




