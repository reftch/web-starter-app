import { useEffect, useState } from "preact/hooks";
import { BasicCard, SkeletonCard } from "./components/basic";
import { Content } from "./components/content";
import { Header, HeaderSearch, HeaderTitle } from "./components/header";
import { Button } from "./components/ui/button";
import type { City } from "./lib/model";
import { getReverse } from "./lib/api";

export function App() {
  const [city, setCity] = useState<City>();

  useEffect(() => {
    const json = sessionStorage.getItem("city-session");
    if (json) {
      onSearch(JSON.parse(json))
    } else if (navigator.geolocation) {
      // Get current position
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          console.log("Latitude: " + position.coords.latitude);
          console.log("Longitude: " + position.coords.longitude);
          console.log("Accuracy: " + position.coords.accuracy + " meters");
          const c = await getReverse({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          onSearch(c!);
        },
        function (error) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.log("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.log("The request to get user location timed out.");
              break;
            default:
              console.log("An unknown error occurred.");
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  const onSearch = (city: City) => {
    if (city) {
      // console.log("Meteo for city:", city);
      sessionStorage.setItem("city-session", JSON.stringify(city));

      fetch(`/api/v1/temperature?latidude=${city.coordinate.latitude}&longtitude=${city.coordinate.longitude}`)
        .then((response) => response.json())
        .then((json) => {
          city.current = json.current;
          city.elevation = json.elevation;
          setCity(city);
        })
    }
  }

  return (
    <>
      <section id="center" className="flex justify-center">
        <div className="max-w-6xl w-full">
          <Header>
            <HeaderTitle>Weather Service</HeaderTitle>
            <HeaderSearch onSearch={(city) => onSearch(city as City)} />
            <Button variant="default" disabled>Sign In</Button>
          </Header>

          <Content>
            {city ? <BasicCard city={city} /> : <SkeletonCard />}
          </Content>

        </div>
      </section>
    </>
  )
}

