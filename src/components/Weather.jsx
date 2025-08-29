import { useRef, useState } from "react";

export default function Weather() {
  const city = useRef();
  const [info, setInfo] = useState();
  const [weatherIcon, setWeatherIcon] = useState("");
  const [error,setError] = useState(false)
  const API_KEY = "1dc02c2cda3d32eda98eede7405d0e42";
  const BASE = "https://api.openweathermap.org/data/2.5/weather";
  function normalizeText(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
  }

  async function checkWeather() {
    const cityName = normalizeText(city.current.value)
    const url = `${BASE}?${new URLSearchParams({
      q: cityName,
      units: "metric",
      appid: API_KEY,
    }).toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        setInfo(null);
        setError(true)
        
        city.current.value = "";
        return;
      }
    console.log(res);

    const data = await res.json();
    setError(false)
    console.log(data);
    
    //set Time
    const local = new Date((data.dt + data.timezone) * 1000); // cộng offset (giây)

    // Dùng getUTC* vì đã cộng offset vào epoch ở trên
    const hh = String(local.getUTCHours()).padStart(2, "0");
    const mm = String(local.getUTCMinutes()).padStart(2, "0");
    const dd = String(local.getUTCDate()).padStart(2, "0");
    const mo = String(local.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = local.getUTCFullYear();

    const timeStr = `${hh}:${mm}`; // ví dụ: "09:27"
    const dateStr = `${dd}/${mo}/${yyyy}`; // ví dụ: "29/08/2025"
    //--------------------------
    setInfo({
      name: data.name,
      temp: Math.round(data.main.temp),
      feel_like: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      dt: data.dt,
      localDate: dateStr,
      localTime: timeStr,
      localhours: Number(hh),

    });
      console.log(city.current.value);
      city.current.value = ""

    const main = data.weather[0].main;
      if (main === "Clouds") setWeatherIcon("img/clouds.png");
      else if (main === "Mist") setWeatherIcon("img/Mist.png");
      else if (main === "Rain") setWeatherIcon("img/rain.png");
      else if (main === "Drizzle") setWeatherIcon("img/drizzle.png");
      else if (main === "Clear") setWeatherIcon("img/clear.png");
      else if (main === "Snow") setWeatherIcon("img/snow.png");
      else if (main === "Haze") setWeatherIcon("img/haze.png");
    } catch (e) {
      console.error(e);
      alert("Network error.");
      city.current.value = "";
    }
  }

  function handleClick() {
    checkWeather();
  }
  return (
    <>
      {/* thanh search */}
      <div className="search">
        <input type="text" ref={city} onKeyDown={(e) => e.key === "Enter" && handleClick()} placeholder="Enter city..."/>
        <button onClick={handleClick}>Search</button>
      </div>
      {error?<p id="alert">city does not exist, please re-enter</p>:undefined}
      {/* card thời tiết */}
      {info? (
        <div className="show-weather">
          {/* từ 18h-6h icon sẽ màu tối */}
          <img id={(info.localhours>=18||info.localhours<=6)?"icon-weather-dark":undefined} src={weatherIcon} alt="icon-weather" />
          <p id="temp">{info.temp} °C</p>
          <p>feel like ~{info.feel_like}°C</p>
          <p>description: {info.description}</p>
          <h2>{info.name}</h2>
          {/* details here */}
          <div className="detail-weather">
            <div className="column">
              <img src="img/humidity.png" alt="icon-humidity" />
              <div className="humidity">
                <p>{info.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
            <div className="column">
              <img src="img/wind.png" alt="icon-wind" />
              <div className="wind">
                <p>{info.wind} m/s</p>
                <p>wind</p>
              </div>
            </div>
          </div>
          <div className="detail-date">
            <p>{info.localTime} {info.localDate}</p>

          </div>
        </div>
      ):<p>Search for city name or city name, country name to show weather</p>}
    </>
  );
}
