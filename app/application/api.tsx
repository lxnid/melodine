const client_id = "b6d11cde34b9484f800e6f6db3cfc5ed";
const client_secret = "92b1f69814e644cc81d43a07d7ae5c4f";

export default async function getData() {
	getToken().then((response) => {
		getTrackInfo(response.access_token).then((profile) => {
			console.log(JSON.stringify(profile, null, 2));
		});
	});
}

async function getToken() {
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
}

async function getTrackInfo(access_token: string) {
	const response = await fetch(
		"https://api.spotify.com/v1/tracks/4cOdK2wGLETKBW3PvgPWqT",
		{
			method: "GET",
			headers: { Authorization: "Bearer " + access_token },
		}
	);

	return await response.json();
}