const apiKey = "YOUR_API_KEY"; // PASTE YOUR API KEY HERE!

const modeBtn = document.getElementById("mode");

modeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    
    if (document.body.classList.contains("dark")) {
        modeBtn.textContent = " Light Mode";
    } else {
        modeBtn.textContent = " Dark Mode";
    }
});
async function getWeather() {
    
    let city = document.getElementById("cityInput").value;
    
    if (city === "") {
        alert("Please type a city name!");
        return;
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    
    try {
        // Fetch current weather
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) {
            alert("City not found! Try again.");
            return;
        }
        
        const weatherData = await weatherResponse.json();
        
        // Show current weather
        document.getElementById("city").innerHTML = weatherData.name + ", " + weatherData.sys.country;
        document.getElementById("temperature").innerHTML = Math.round(weatherData.main.temp) + " °C";
        document.getElementById("description").innerHTML = weatherData.weather[0].description;
        document.getElementById("humidity").innerHTML = weatherData.main.humidity + "%";
        document.getElementById("pressure").innerHTML = weatherData.main.pressure + " hPa";
        document.getElementById("wind").innerHTML = weatherData.wind.speed + " m/s";
        document.getElementById("icon").src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        // Fetch forecast
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        
        showForecast(forecastData);
        
    } catch (error) {
        console.log("Error:", error);
        alert("Something went wrong! Check your internet.");
    }
}

function showForecast(data) {
    const forecastDiv = document.getElementById("forecast");
    forecastDiv.innerHTML = "";
    
    for (let i = 0; i < data.list.length; i++) {
        const item = data.list[i];
        
        if (item.dt_txt.includes("12:00:00")) {
            
            const card = document.createElement("div");
            card.className = "card";
            
            const date = new Date(item.dt * 1000);
            const dateText = date.toDateString().slice(0, 10);
            
            card.innerHTML = 
                '<p class="date">' + dateText + '</p>' +
                '<img src="https://openweathermap.org/img/wn/' + item.weather[0].icon + '@2x.png">' +
                '<h3>' + Math.round(item.main.temp) + ' °C</h3>' +
                '<p>' + item.weather[0].description + '</p>';
            
            forecastDiv.appendChild(card);
        }
    }
}

//  SEARCH 

document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});