const client_id = "b6d11cde34b9484f800e6f6db3cfc5ed";
const client_secret = "92b1f69814e644cc81d43a07d7ae5c4f";
const base_url = "https://api.spotify.com/v1/";
const TOKEN = await getToken();


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
					Buffer.from(client_id + ":" + client_secret).toString(
						"base64"
					),
			},
		});
		return await response.json();
	} catch (error) {
		console.log("Authentication Failure", error);
	}
}

export async function getTracks( query: string) {
	try {
		const response = await fetch(
			`${base_url}search?q=${query}&type=track`,
			{
				method: "GET",
				headers: { Authorization: "Bearer " + TOKEN.access_token },
			}
		);

		return await response.json();
	} catch (error) {
		console.log("Error fetching Tracks", error);
	}
}

export async function getRecommended( retries:number = 3) {
	try {
		const response = await fetch(
			`${base_url}recommendations?seed_genres=pop`,
			{
				method: "GET",
				headers: { Authorization: "Bearer " + TOKEN.access_token },
			}
		);

		// Check if the response is not OK
		if (response.status === 429) {
			const retryAfter = response.headers.get("Retry-After");
			const waitTime = retryAfter
				? parseInt(retryAfter, 10) * 1000
				: 1000;
			console.warn(
				`Rate limited. Retrying after ${waitTime / 1000} seconds...`
			);
			if (retries > 0) {
				await new Promise((resolve) => setTimeout(resolve, waitTime));
				return getRecommended(retries - 1); // Retry with one less attempt
			} else {
				console.error("Max retries reached");
				return null;
			}
		}

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

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
	const uniqueIds = new Set();

	for (const track in data) {
		const subArtists = data[track].artists;
		for (let i = 0; i < subArtists.length; i++) {
			uniqueIds.add(data[track].artists[i].id);
		}
	}

	// Join unique IDs into a single string, separated by commas
	constructor = Array.from(uniqueIds).slice(0,20).join(",");

	// console.log(constructor);

	try {
		const response = await fetch(`${base_url}artists?ids=${constructor}`, {
			method: "GET",
			headers: { Authorization: "Bearer " + TOKEN.access_token },
		});

		return await response.json();
	} catch (error) {
		console.log("Error fetching recommended Artists", error);
	}
}
