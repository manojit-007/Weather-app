const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const Month = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
let place = document.querySelector(".place .name");
let dateElement = document.querySelector(".place .date");

async function newKey() {
    let key = prompt("Enter your API key");
    return key;
}

const backUpKey = "bd5e378503939ddaee76f12ad7a97608";

async function backupKeyTest() {
    if (typeof keyByOwner !== "undefined") {
        return keyByOwner 
    } else {
        const response = await fetch(apiUrl + city + `&appid=${backUpKey}`);
        if (!response.ok) {
            return backUpKey;
        } else {
            const data = await response.json();
            return data.key; 
        }
    }
}

const key = backupKeyTest()


const keyFromKey = async function getKey() {
    try {
        let apiKey = (typeof key !== 'undefined') ? key : localStorage.getItem('apiKey');
        if (!apiKey) {
            console.log("API key not found, prompting for a new one.");
            apiKey = await newKey();
            localStorage.setItem('apiKey', apiKey);
        } 
        return apiKey;
    } catch (error) {
        console.error("Error occurred:", error);
        throw new Error('Failed to retrieve API key');
    }
}

const getWeather = async (city) => {
    try {
        const apiKey =  await keyFromKey();
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        console.log(data);
        place.textContent = data.name;
        const dataOfDate = data.dt * 1000;
        await dateOfPlace(dataOfDate);
        updateWeather(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function dateOfPlace(dataOfDate) {
    const dateOfPlace = new Date(dataOfDate);
    let monthIndex = dateOfPlace.getMonth();
    let day = dateOfPlace.getDate();
    let year = dateOfPlace.getFullYear();
    dateElement.textContent = `${day} ${Month[monthIndex]} ${year}`;
}

function updateWeather(data) {
    let temp = document.getElementById("temp");
    temp.innerHTML = Math.floor(data.main.temp) + "°C";
    let humidity = document.getElementById("humidity");
    humidity.innerHTML = Math.floor(data.main.humidity) + "%";
    let wind = document.getElementById("wind");
    wind.innerHTML = Math.floor(data.wind.speed) + " km/h";
    let pressure = document.getElementById("pressure");
    pressure.innerHTML = Math.floor(data.main.pressure) + " hPa";
    let visibility = document.getElementById("visibility");
    visibility.innerHTML = Math.floor(data.visibility) + " Km";
    let temp_max = document.getElementById("temp_max");
    temp_max.innerHTML = Math.floor(data.main.temp_max) + "°C";
    let temp_min = document.getElementById("temp_min");
    temp_min.innerHTML = Math.floor(data.main.temp_min) + "°C";
}

let btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
    let input = document.getElementById("city");
    let city = input.value;
    let data = await getWeather(city);
    updateWeather(data);
    input.value = "";
});

getWeather("Mumbai");
