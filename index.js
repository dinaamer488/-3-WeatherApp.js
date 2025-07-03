let API_KEY = "501637b900db414895f83710250105";
let btn = document.getElementById("getweather");
let loadingSpinner = document.getElementById("loadingSpinner");
let targetcontainer=document.querySelector(".container");
let cityname= document.getElementById("cityName");
let targetDays=   document.getElementById("day");
let targetMonths=  document.getElementById("month");
let targetdayNum=document.getElementById("daynum");
let targetTemp=  document.getElementById("temperature");
let targetweatherIcons=document.getElementById("weatherIcon");

window.addEventListener("load", function () {
    btn.addEventListener("click", async function () {
         let targetdays=document.getElementById("dailyForecast");
         targetdays.style.display="block";
        fetchWeatherData();
    });
});

async function fetchWeatherData() {
    let city = document.getElementById("cityInput").value.trim();
    if (city === "") {
        alert("Please enter a city name");
        return;
    }

   
    loadingSpinner.style.display = "block";

    try {
        let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&alerts=no`);
        if (!response.ok) {
            throw new Error("Invalid city name or Network issues");
        }
        let finaldata = await response.json();

                let todayDate = new Date();
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let daynum=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
       cityname.innerText = finaldata.location.name;
      targetDays.innerText = days[todayDate.getDay()];
        targetMonths.innerText = months[todayDate.getMonth()];
       targetdayNum.innerText = todayDate.getDate();
   
        let forecast = finaldata.forecast.forecastday[0].day;
      targetTemp.innerText = `${forecast.maxtemp_c}°/${Math.round(forecast.mintemp_c)}°`;
       targetweatherIcons.src = "https://cdn.weatherapi.com/weather/64x64/night/113.png";

   
        let forecastContainer = document.getElementById("daysforecast");
        forecastContainer.innerHTML = `<p class="p">7-DAY FORECAST</p>`;
        finaldata.forecast.forecastday.forEach(day => {
            let dateObj = new Date(day.date);
            let forecastDay = document.createElement("div");
            forecastDay.className = 'forecast-day';
            forecastDay.innerHTML = `
                <div class="date1">
                    <span>${dateObj.getDate()}</span>
                    <span>${dateObj.toLocaleString('default', { month: 'long' })}</span>
                    <span>${dateObj.toLocaleString('default', { weekday: 'long' })}</span>
                </div>
                <div class="con">
                    <img class="forecast-icon" src="https:${day.day.condition.icon}">
                    <p class="des">${day.day.condition.text}</p>
                </div>
                <p class="temp">${Math.round(day.day.maxtemp_c)}°/${Math.round(day.day.mintemp_c)}°</p>
            `;
            forecastContainer.appendChild(forecastDay);
        });

        let hourForecast = document.getElementById("hourlyForecast");
        hourForecast.innerHTML = `<p class="p1">TODAY'S FORECAST</p>`;
        finaldata.forecast.forecastday[0].hour.forEach(hourData => {
            let timeParts = hourData.time.split(" ")[1].split(":");
            let hours = parseInt(timeParts[0]);
            let minutes = timeParts[1];
            let amPm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12;

            let foreachHour = document.createElement("div");
            foreachHour.className = 'forecast-hour';
            foreachHour.innerHTML = `
                <div>
                    <p class="time">${hours}:${minutes} ${amPm}</p>
                    <img class="forecast-icon" src="https:${hourData.condition.icon}">
                    <p class="temp">${Math.round(hourData.temp_c)}°</p>
                </div>
            `;
            hourForecast.appendChild(foreachHour);
        });

        let weatherContainer = document.getElementById("weatherDetails");
        weatherContainer.innerHTML = "";
        let weatherCard = document.createElement('div');
        weatherCard.className = 'weather-card';

        let title = document.createElement('h3');
        title.className = 'weather-title';
        title.textContent = 'Weather Details';
        weatherCard.appendChild(title);

        let itemsContainer = document.createElement('div');
        itemsContainer.className = 'weather-items-container';

        let weatherData = [
            { name: "Sunrise", value: finaldata.forecast.forecastday[0].astro.sunrise, img: `assats/mingcute_sunrise-line.svg` },
            { name: "Sunset", value: finaldata.forecast.forecastday[0].astro.sunset, img: `assats/mingcute_sunset-line.svg` },
            { name: "Chance of Rain", value: `${finaldata.forecast.forecastday[0].day.daily_chance_of_rain}%`, img: `assats/material-symbols_water-drop.svg` },
            { name: "Wind", value: `${finaldata.current.wind_kph} km/h`, img: `assats/tabler_wind.svg` },
            { name: "UV Index", value: finaldata.current.uv, img: `assats/mingcute_sun-fill.svg` },
            { name: "Feels Like", value: `${finaldata.current.feelslike_c}°`, img: `assats/fluent_temperature-16-filled.svg` }
        ];

        weatherData.forEach(item => {
            let weatherItem = document.createElement('div');
            weatherItem.className = 'weather-item';

            let name = document.createElement('div');
            name.className = 'name';
            name.textContent = item.name;

            let value = document.createElement('div');
            value.className = 'value';
            value.textContent = item.value;

            let icon = document.createElement('img');
            icon.className = 'weather-icon';
            icon.src = item.img;

            weatherItem.appendChild(icon);
            weatherItem.appendChild(name);
            weatherItem.appendChild(value);
            itemsContainer.appendChild(weatherItem);
        });

        weatherCard.appendChild(itemsContainer);
        weatherContainer.appendChild(weatherCard);

        let sectionsToObserve = [weatherContainer, forecastContainer, hourForecast];
        let observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1"; 
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sectionsToObserve.forEach(section => {
            if (section) {
                section.style.opacity = "0"; 
                section.style.transform = "translateY(30px)";
                section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
                observer.observe(section);
            }
        });

    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }

   
    loadingSpinner.style.display = "none";
   
  
    
}


