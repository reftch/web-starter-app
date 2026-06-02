import { useEffect, useState } from "preact/hooks";
import { BasicCard, SkeletonCard } from "./components/basic";
import { Content } from "./components/content";
import { Header, HeaderSearch, HeaderTitle } from "./components/header";
import { Button } from "./components/ui/button";
import { getCity, getMeteo } from "./lib/api";
import { getGeolocation } from "./lib/utils";

import type { City } from "./lib/model";

export function App() {
  const [city, setCity] = useState<City>();

  useEffect(() => {
    const loadCity = async () => {
      const json = sessionStorage.getItem("city-session");
      if (json) {
        onSearch(JSON.parse(json))
      } else {
        const coordinate = await getGeolocation();
        if (coordinate) {
          const c = await getCity(coordinate);
          onSearch(c!);
        }
      }
    };

    loadCity();
  }, []);

  const onSearch = async (city: City) => {
    if (city) {
      sessionStorage.setItem("city-session", JSON.stringify(city));
      city = await getMeteo(city);
      setCity(city);
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
            {/* {city ? <BasicCard city={city} /> : <SkeletonCard />} */}
            {city ? <BasicCard city={city} /> : null}
          </Content>

        </div>
      </section>
    </>
  )
}

