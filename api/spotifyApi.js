const client_id = "563031c8ba504ecd96294195d65287e1";
const client_secret = "f934f45250104966b97000a02bfe2029";

async function getToken() {
  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
  };

  const response = await fetch(url, payload);
  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("access_token", data.access_token);
    return data;
  } else {
    console.error("Error getting token: ", data);
    throw new Error("Failed to fetch token");
  }
}

async function getTrackInfo(access_token, genre) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=genre=${genre}&type=track&limit=1`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + access_token },
    }
  );

  const data = await response.json();

  console.log(data);

  return data;

  //   console.log(response);

  //   return await response.json();
}

export { getTrackInfo, getToken };
