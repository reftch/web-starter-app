import type { City, Coordinate } from "./model";

export const getReverse = async (coordinate: Coordinate): Promise<City | undefined> => {
    const response = await fetch(`/api/v1/reverse?lat=${coordinate.latitude}&lon=${coordinate.longitude}`);
    if (!response.ok) {
        return undefined
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

    return undefined;
}