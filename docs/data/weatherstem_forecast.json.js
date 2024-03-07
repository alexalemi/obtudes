import { baseURL, latitude, longitude, apiKey, json, transformObjectToArray } from "./common.js";

const days = '15day';

const data = await json(`${baseURL}/v3/wx/forecast/hourly/${days}?geocode=${latitude},${longitude}&format=json&language=en-US&units=e&apiKey=${apiKey}`);

process.stdout.write(JSON.stringify(transformObjectToArray(data)));
