
import { json } from "../components/common.js"; 

const data = await json(`https://cdn.weatherstem.com/dashboard/data/dynamic/lightning/30minutesarrayfull.json`);

process.stdout.write(JSON.stringify(data.map(([ts, lat, lon, type, mag]) => ({
 timestamp: ts,
 latitude: lat,
 longitude: lon,
 type: type,
 magnitude: parseFloat(mag)}))));
