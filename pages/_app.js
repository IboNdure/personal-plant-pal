import GlobalStyle from "../styles";
import Layout from "@/components/Layout";
import useSWR, { SWRConfig } from "swr";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import useLocalStorageState from "use-local-storage-state";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState("darkMode", {
    defaultValue: false,
  });
  const { data: plants, mutate: mutatePlants } = useSWR("/api/plants", fetcher);
  const { data: reminders, mutate: mutateReminders } = useSWR(
    "/api/reminders",
    fetcher
  );
  const [weatherData, setWeatherData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather(latitude, longitude) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
        );
        const data = await response.json();

        const currentWeather = data.current_weather;
        const humidity = data.hourly.relative_humidity_2m[0];

        setWeatherData({ ...currentWeather, humidity });
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    }

    function handleGeoSuccess(position) {
      const { latitude, longitude } = position.coords;
      fetchWeather(latitude, longitude);
    }

    function handleGeoError() {
      console.error("Unable to retrieve location.");
      setLoading(false);
    }

    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  async function toggleFavourite(id, isFavourite) {
    mutatePlants(
      (currentData) =>
        currentData.map((item) => {
          return item._id === id
            ? { ...item, isFavourite: !item.isFavourite }
            : item;
        }),
      false
    );

    const response = await fetch(`/api/plants/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isFavourite: !isFavourite }),
    });

    if (!response.ok) {
      mutatePlants("/api/plants");
      return;
    }
  }

  async function handleAddReminder(newReminder) {
    const response = await fetch("/api/reminders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReminder),
    });

    if (response.ok) {
      mutateReminders();
      return;
    }
  }

  async function handleEditReminder(reminderId, updatedReminder) {
    const response = await fetch(`/api/reminders/${reminderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedReminder),
    });

    if (response.ok) {
      mutateReminders();
    }
  }

  async function handleDeleteReminder(reminderId) {
    const response = await fetch(`/api/reminders/${reminderId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      mutateReminders();
    }
  }

  return (
    <>
      <SWRConfig value={{ fetcher }}>
        <SessionProvider session={session}>
          <Layout
            plants={plants}
            reminders={reminders}
            onEditReminder={handleEditReminder}
          >
            <GlobalStyle darkMode={isDarkMode} />
            <button onClick={toggleDarkMode}>
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <Component
              {...pageProps}
              plants={plants}
              weatherData={weatherData}
              toggleFavourite={toggleFavourite}
              reminders={reminders}
              onAddReminder={handleAddReminder}
              onEditReminder={handleEditReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          </Layout>
        </SessionProvider>
      </SWRConfig>
    </>
  );
}
