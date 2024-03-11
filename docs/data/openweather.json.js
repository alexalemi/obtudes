

import { json, latitude, longitude } from "../components/common.js";

const apiKey = process.env.WEATHERSTEM;

const data = await json(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);

process.stdout.write(JSON.stringify(data));
