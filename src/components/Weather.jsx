import { useRef, useState } from "react";

export default function Weather() {
  const city = useRef();
  const [info, setInfo] = useState();
  const [weatherIcon, setWeatherIcon] = useState("");
  const API_KEY = "1dc02c2cda3d32eda98eede7405d0e42";
  const BASE = "https://api.openweathermap.org/data/2.5/weather";

  async function checkWeather() {
    const url = `${BASE}?${new URLSearchParams({
      q: city.current.value,
      units: "metric",
      appid: API_KEY,
    }).toString()}`;

    const res = await fetch(url);
    if (!res.ok) {
      setInfo(null);
      alert(`city does not exist, please re-enter
thành phố không tồn tại vui lòng nhập lại bằng tiếng anh`);
      return;
    }
    console.log(res);

    const data = await res.json();
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
      humidity: data.main.humidity,
      wind: data.wind.speed,
      main: data.main.weather?.[0]?.main,
      dt: data.dt,
      localDate: dateStr,
      localTime: timeStr,
    });
    console.log(city.current.value);
    if (data.weather[0].main == "Clouds") {
      setWeatherIcon("img/clouds.png");
    } else if (data.weather[0].main == "Mist") {
      setWeatherIcon("img/Mist.png");
    } else if (data.weather[0].main == "Rain") {
      setWeatherIcon("img/rain.png");
    } else if (data.weather[0].main == "Drizzle") {
      setWeatherIcon("img/drizzle.png");
    } else if (data.weather[0].main == "Clear") {
      setWeatherIcon("img/clear.png");
    } else if (data.weather[0].main == "Snow") {
      setWeatherIcon("img/snow.png");
    } else if (data.weather[0].main == "Haze") {
      setWeatherIcon("img/haze.png");
    }
  }

  function handleClick() {
    checkWeather();
  }
  return (
    <>
      {/* thanh search */}
      <div className="search">
        <input type="text" ref={city} />
        <button onClick={handleClick}>Search</button>
      </div>
      {/* card thời tiết */}
      {info && (
        <div className="show-weather">
          <img src={weatherIcon} alt="icon-weather" />
          <h1>{info.temp} °C</h1>
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
                <p>{info.wind} km/h</p>
                <p>wind</p>
              </div>
            </div>
          </div>
          <div className="detail-date">
            <p>{info.localTime}</p>
            <p>{info.localDate}</p>
          </div>
        </div>
      )}
    </>
  );
}
