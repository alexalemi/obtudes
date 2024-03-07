
import { json, latitude, longitude } from "./common.js";

const apiKey = process.env.ACCUWEATHER;

const data = await json(`http://dataservice.accuweather.com/forecasts/v1/minute?q=${latitude},${longitude}&apikey=${apiKey}`);

process.stdout.write(JSON.stringify(data));
