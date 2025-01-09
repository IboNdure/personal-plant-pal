import { useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import WeatherIcon from "@/components/WeatherIcon";
import { getAllWeatherDescription } from "@/utils/getweatherdeatails";
import Link from "next/link";

export default function WeatherForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeather(latitude, longitude) {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode&timezone=auto`
        );
        const data = await response.json();
        setForecast(data);
      } catch (err) {
        setError("Error fetching weather data.");
      } finally {
        setLoading(false);
      }
    }

    function handleGeoSuccess(position) {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    }

    function handleGeoError() {
      setError("Unable to retrieve location.");
      setLoading(false);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeoSuccess,
        handleGeoError
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  }, []);

  if (loading) return <StyledLoading>Loading weather data...</StyledLoading>;
  if (error) return <p>{error}</p>;

  return (
    <ForecastContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "easeOut", duration: 1 }}
    >
      <h1>7-Day Weather Forecast</h1>
      <Link href={"/"}>Back to Homepage</Link>
      <ForecastGrid>
        {forecast?.daily?.temperature_2m_max?.map((temp, index) => (
          <ForecastCard key={index}>
            <h3>{new Date(forecast.daily.time[index]).toLocaleDateString()}</h3>
            <WeatherIconContainer>
              <WeatherIcon weatherData={forecast.daily.weathercode[index]} />
              <p>
                {getAllWeatherDescription(forecast.daily.weathercode[index])}
              </p>
            </WeatherIconContainer>
            <p>Max Temp: {temp}°C</p>
            <p>Min Temp: {forecast.daily.temperature_2m_min[index]}°C</p>
            <p>Wind: {forecast.daily.windspeed_10m_max[index]} km/h</p>
          </ForecastCard>
        ))}
      </ForecastGrid>
    </ForecastContainer>
  );
}

const ForecastContainer = styled(motion.div)`
  padding: 20px;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
`;

const ForecastCard = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
`;

const WeatherIconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;

  p {
    margin: 5px 0 0;
    font-size: 0.9rem;
    color: #555;
  }
`;

const StyledLoading = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
`;
