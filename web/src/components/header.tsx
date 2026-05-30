import { createRef, useEffect, useRef, useState } from "preact/compat"
import { Button } from "./ui/button"
import { Field } from "./ui/field"
import { cn } from "../lib/utils"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "./ui/input-group"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

function HeaderTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground text-lg font-medium",
        className
      )}
      {...props}
    />
  )
}

const people = [
  {
    username: "shadcn",
    avatar: "https://github.com/shadcn.png",
    email: "shadcn@vercel.com",
  },
  {
    username: "maxleiter",
    avatar: "https://github.com/maxleiter.png",
    email: "maxleiter@vercel.com",
  },
  {
    username: "evilrabbit",
    avatar: "https://github.com/evilrabbit.png",
    email: "evilrabbit@vercel.com",
  },
]


type HeaderSearchProps = React.ComponentProps<"div"> & {
  onSearch: (value: string) => void
}

type City = {
  id: number
  name: string
  latidude: number
  longtitude: number;
}

function HeaderSearch({ className, onSearch, ...props }: HeaderSearchProps) {
  const [value, setValue] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  // const inputRef = createRef();

  const [cities, setCities] = useState<Array<City>>([])
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  // Filter cities based on input
  useEffect(() => {
    if (value.trim() === "") {
      setFilteredCities([]);
      setIsSearchOpen(false);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      if (filtered.length > 0) {
        setIsSearchOpen(true);
      }
    }
  }, [value, cities]);

  const handleChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    setValue(input.value)

    fetch(`/api/v1/cities?keyword=${input.value}`)
      .then((response) => response.json())
      .then((json) => {
        // {
        //     "type": "Feature",
        //     "properties": {
        //         "osm_type": "R",
        //         "osm_id": 52822,
        //         "osm_key": "place",
        //         "osm_value": "country",
        //         "type": "country",
        //         "name": "Sverige",
        //         "country": "Sverige",
        //         "countrycode": "SE",
        //         "extent": [
        //             10.5935025,
        //             69.0599735,
        //             24.177685,
        //             55.1370957
        //         ]
        //     },
        //     "geometry": {
        //         "type": "Point",
        //         "coordinates": [
        //             14.5208584,
        //             59.6749712
        //         ]
        //     }
        // }
        console.log(json)
        const array: Array<City> = []
        if (json.features.length > 0) {
          json.features.forEach((c: any) => array.push({
            id: c.properties.osm_id,
            name: c.properties.name,
            latidude: c.geometry.coordinates[1],
            longtitude: c.geometry.coordinates[0],
          }));

          console.log(array)
          setCities(array);
        }
      })

  };

  const handleCitySelect = (city: City) => {
    setIsSearchOpen(false);
    setValue(city.name);
    onSearch(`${city.latidude},${city.longtitude}`);
  };

  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground",
        className
      )}
      {...props}
    >
      <Field orientation="horizontal">
        <InputGroup className="rounded">
          <InputGroupInput
            // ref={inputRef}
            className="w-[20rem]"
            type="search"
            placeholder="Search..."
            value={value}
            onInput={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(value);
              }
            }}
          />
          <InputGroupAddon>
            <Popover open={isSearchOpen}>
              <PopoverTrigger asChild>
                <button className="invisible" tabIndex={-1} aria-hidden="true"></button>
              </PopoverTrigger>
              <PopoverContent align="start" className="mt-4 w-[20rem]">
                <div className="flex flex-col max-h-80 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city: City) => (
                      <Button
                        variant="ghost"
                        key={city.id}
                        tabIndex={-1}
                        onClick={() => handleCitySelect(city)}
                        className="justify-start"
                      >
                        {city.name}
                      </Button>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500">No cities found</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>

        </InputGroup>

        <Button className="cursor-pointer" onClick={() => onSearch(value)}>Search</Button>
      </Field>
    </div>
  )
}

function Header({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex justify-between gap-6 border-b py-4 items-center px-4",
        className
      )}
      {...props}
    />
  )
}

export { Header, HeaderTitle, HeaderSearch }