// const videoSection = document.querySelector('section');

// fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=never%20gonna%20give%20you%20up&type=video&videoEmbeddable=true&key=AIzaSyByxk2jK-t32JkvnCeza8q-Lfs2eLsXJPY')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.json(); 
//     })
//     .then(data => {
//         console.log('API Response Data:', data); 

//         if (!data.items) {
//             throw new Error('No items found in the response');
//         }

//         data.items.forEach(el => {
//             videoSection.innerHTML += `<h3>${el.snippet.title}</h3>`;
//         });
//     })
//     .catch(error => {
//         console.error('Error fetching YouTube API data:', error);
//     });


//API KEY = AIzaSyByxk2jK-t32JkvnCeza8q-Lfs2eLsXJPY

const videoSection = document.getElementById('videoSection'); // Correctly select the element by its ID

fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=never%20gonna%20give%20you%20up&type=video&videoEmbeddable=true&key=AIzaSyByxk2jK-t32JkvnCeza8q-Lfs2eLsXJPY')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Read and parse the response body as JSON
    })
    .then(data => {
        console.log('API Response Data:', data); // Log the actual data

        if (!data.items) {
            throw new Error('No items found in the response');
        }

        data.items.forEach(el => {
            const videoId = el.id.videoId; // Get the video ID from the API response
            const videoTitle = el.snippet.title; // Get the video title

            // Create an iframe element for the video
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}`;
            iframe.width = '560';
            iframe.height = '315';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;

            // Create a container div for each video and its title
            const videoContainer = document.createElement('div');
            videoContainer.className = 'video-container';
            videoContainer.innerHTML = `<h3>${videoTitle}</h3>`;
            videoContainer.appendChild(iframe);

            // Append the video container to the video section
            videoSection.appendChild(videoContainer);
        });
    })
    .catch(error => {
        console.error('Error fetching YouTube API data:', error);
    });



