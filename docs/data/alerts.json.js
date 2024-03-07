
import { longitude, latitude, json, baseURL, apiKey } from "./common.js";

const data = json(`${baseURL}/v3/alerts/headlines?geocode=${latitude},${longitude}&format=json&language=en-US&apiKey=${apiKey}`);

process.stdout.write(JSON.stringify(data));
