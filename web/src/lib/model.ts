export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type DailyForecast = {
  time: string;
  temperature_2m_max: number;
  temperature_2m_min: number;
  sunrise: string;
  sunset: string;
  weather_code: number;
  precipitation_sum: number;
  wind_speed_10m_max: number;
};

export type City = {
  id: number
  key?: string
  type?: string
  value?: string
  postcode?: string
  housenumber?: number
  city: string
  street?: string
  district?: string
  state: string
  country: string
  countrycode?: string
  coordinate: Coordinate
  current: {
    temperature_2m: number
    interval: number
    time: string
  }
  elevation: number
  daily_forecast?: DailyForecast[]
};
