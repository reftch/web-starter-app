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