
import { json, baseURL, latitude, longitude, apiKey } from "./common.js";

const data = await json(`${baseURL}/v3/alerts/headlines?geocode=${latitude},${longitude}&format=json&language=en-US&apiKey=${apiKey}`);

process.stdout.write(JSON.stringify(data));
