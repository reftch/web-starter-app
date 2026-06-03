import type { City, Coordinate } from "./model";

export const getCity = async (coordinate: Coordinate): Promise<City | undefined> => {
  const response = await fetch(`/api/v1/reverse?lat=${coordinate.latitude}&lon=${coordinate.longitude}`);
  if (!response.ok) {
    return
  }

  const json = await response.json();
  if (json) {
    const c: any = json.features[0];

    const city: City = {
      id: c.properties.osm_id,
      key: c.properties.osm_key,
      value: c.properties.osm_value,
      postcode: c.properties.postcode,
      housenumber: c.properties.housenumber,
      street: c.properties.street,
      type: c.properties.type,
      district: c.properties.district,
      city: c.properties.city,
      state: c.properties.state,
      country: c.properties.country,
      countrycode: c.properties.countrycode,
      elevation: 0,
      coordinate: coordinate,
      current: {
        temperature_2m: 0,
        interval: 0,
        time: '',
      },
    };
    return city;
  }

  return;
}

export const getCities = async (keyword: string): Promise<Array<City>> => {
  const array: Array<City> = []
  const response = await fetch(`/api/v1/cities?keyword=${keyword}`);
  if (!response.ok) {
    return array;
  }

  const json = await response.json();
  if (json && json.features.length > 0) {
    json.features.forEach((c: any) => array.push({
      id: c.properties.osm_id,
      city: c.properties.name,
      state: c.properties.state,
      country: c.properties.country,
      elevation: 0,
      coordinate: {
        latitude: c.geometry.coordinates[1],
        longitude: c.geometry.coordinates[0],
      },
      current: {
        temperature_2m: 0,
        interval: 0,
        time: '',
      },
    }));
  }

  return array;
}

// export const getMeteo = async (city: City): Promise<City> => {
//   const response = await fetch(`/api/v1/temperature?latidude=${city.coordinate.latitude}&longtitude=${city.coordinate.longitude}`);
//   if (!response.ok) {
//     return city;
//   }

//   const json = await response.json();
//   city.current = json.current;
//   city.elevation = json.elevation;
//   return city;
// }

// Add to web/src/lib/api.ts
export const getMeteo = async (city: City): Promise<City> => {
  const response = await fetch(`/api/v1/temperature?latidude=${city.coordinate.latitude}&longtitude=${city.coordinate.longitude}`);
  if (!response.ok) {
    return city;
  }

  const json = await response.json();
  city.current = json.current;
  city.elevation = json.elevation;

  // Handle daily forecast data from the API
  if (json.daily && json.daily.time && json.daily.temperature_2m_min &&
    json.daily.temperature_2m_max && json.daily.weather_code) {
    const daysCount = Math.min(json.daily.time.length, 7);
    city.daily_forecast = [];

    for (let i = 0; i < daysCount; i++) {
      city.daily_forecast.push({
        time: json.daily.time[i],
        temperature_2m_max: json.daily.temperature_2m_max[i],
        temperature_2m_min: json.daily.temperature_2m_min[i],
        sunrise: json.daily.sunrise[i],
        sunset: json.daily.sunset[i],
        weather_code: json.daily.weather_code[i],
        precipitation_sum: json.daily.precipitation_sum ? json.daily.precipitation_sum[i] : 0,
        wind_speed_10m_max: json.daily.wind_speed_10m_max ? json.daily.wind_speed_10m_max[i] : 0
      });
    }
  }

  return city;
}