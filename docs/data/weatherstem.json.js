
const baseURL = "https://api.weatherstem.com/api";
const apiKey = process.env.WEATHERSTEM;
const stations = ["fswnlakefront@osceola.weatherstem.com"];

async function json(url) {
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(
			{ api_key: apiKey,
				stations: stations })
	});
	if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
	return await response.json();
}

const data = await json(baseURL);

process.stdout.write(JSON.stringify(data));
