
const client_id = "b6d11cde34b9484f800e6f6db3cfc5ed";
const client_secret = "92b1f69814e644cc81d43a07d7ae5c4f";
const base_url = "https://api.spotify.com/v1/";
const TOKEN = await getToken();

export default async function getSearchData(trackName?: string) {
	// getToken().then((response) => {
	// 	getTracks(response.access_token,trackName).then((tracks) => {
	// 		// console.log(JSON.stringify(tracks, null, 2));
	// 		// console.log(tracks);
	// 		return tracks;
	// 	});
	// });
	if (trackName) {
		const tracks = await getTracks(TOKEN.access_token, trackName);
		return tracks
	} else {
		const tracks = await getRecommended(TOKEN.access_token);
		return tracks
	}
}

async function getToken() {
	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			body: new URLSearchParams({
				grant_type: "client_credentials",
			}),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization:
					"Basic " +
					Buffer.from(client_id + ":" + client_secret).toString("base64"),
			},
		});
		return await response.json();
	} catch (error) {
		console.log("Authentication Failure", error);
	}
}

async function getTracks(access_token: string, query: string) {
	try {
		const response = await fetch(
			`${base_url}search?q=${query}&type=track`,
			{
				method: "GET",
				headers: { Authorization: "Bearer " + access_token },
			}
		);
	
		return await response.json();
	} catch (error) {
		console.log("Error fetching Tracks", error);
	}
}

async function getRecommended(access_token: string) {
	try {
		const response = await fetch(
			`${base_url}recommendations?seed_genres=pop`,
			{
				method: "GET",
				headers: { Authorization: "Bearer " + access_token },
			}
		);
		return await response.json();
	} catch (error) {
		console.log("Error fetching recommended Tracks", error);
	}
}

interface TrackData {
    tracks: Array<{
        artists: Array<{ id: string }>;
    }>;
}

export async function getArtists(tracks_data: TrackData) {
	const data = tracks_data.tracks;
	// console.log(data);
	
	let constructor = "";

	for (const track in data) {
		const subArtists = data[track].artists;
		for (let i = 0; i < subArtists.length; i++) {
			constructor += data[track].artists[i].id + ","
		}
	}
	// console.log(constructor);

	try {
		const response = await fetch(
			`${base_url}artists?ids=${constructor}`,
			{
				method: "GET",
				headers: { Authorization: "Bearer " + TOKEN.access_token },
			}
		);
	
		return await response.json();
	} catch (error) {
		console.log("Error fetching recommended Artists", error);
	}
}
