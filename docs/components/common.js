
export const baseURL = "https://data.weatherstem.com"
export const apiKey = process.env.WEATHERSTEM2;
export const station = "fswnlakefront@osceola.weatherstem.com";
export const longitude = -81.40;
export const latitude = 28.29;

export async function json(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
	return await response.json();
}

export function transformObjectToArray(obj) {
  // Assuming all arrays in the object are of the same length
  const length = obj[Object.keys(obj)[0]].length;
  const result = [];

  for (let i = 0; i < length; i++) {
    let tempObj = {};
    for (let key in obj) {
      // Assuming the object keys are consistent with the desired property names
      tempObj[key] = obj[key][i];
    }
    result.push(tempObj);
  }

  return result;
}

