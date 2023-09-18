require('dotenv').config();

const apiKey = process.env.WEATHER_API_KEY;

async function getLocation(city) {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return { lat: data[0].lat, lon: data[0].lon }
    } catch (error) {
        console.error(error);
    }
}

async function getWeather(interaction) {
    const location = await getLocation(interaction.options.getString('city'));
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&xclude=minutely`

    try {
        const response = await fetch(url);
        const data = await response.json();
        return `The weather in ${interaction.options.getString('city')} is ${data.current.temp.toFixed(0)}°C, ${data.current.weather[0].description}`;
    
    } catch (error) {   
        console.error(error);
    }
}

async function getWeather() {
    const location = {lat: 43.329479, lon: -79.805277};
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric&xclude=minutely`

    try {
        const response = await fetch(url);
        const data = await response.json();
        return `The weather in Burlinton is ${data.current.temp.toFixed(0)}°C, ${data.current.weather[0].description}`;
    
    } catch (error) {   
        console.error(error);
    }
}

module.exports = getWeather;