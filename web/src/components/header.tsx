import { useEffect, useState } from "preact/compat";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Field } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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

type HeaderSearchProps = React.ComponentProps<"div"> & {
  onSearch: (value: string) => void
}

type City = {
  id: number
  name: string
  state: string
  country: string
  latidude: number
  longtitude: number;
}

function HeaderSearch({ className, onSearch, ...props }: HeaderSearchProps) {
  const [value, setValue] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
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
      if (filtered.length > 0 && filtered[0].name != value) {
        setIsSearchOpen(true);
      }
    }
  }, [value, cities]);

  useEffect(() => {
    if (isSearchOpen) {
      queueMicrotask(() => {
        const el = document.querySelector('#search-input') as HTMLInputElement;
        el?.focus();
      });
    }
  }, [isSearchOpen]);

  const handleChange = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    setValue(input.value)

    fetch(`/api/v1/cities?keyword=${input.value}`)
      .then((response) => response.json())
      .then((json) => {
        const array: Array<City> = []
        if (json.features.length > 0) {
          json.features.forEach((c: any) => array.push({
            id: c.properties.osm_id,
            name: c.properties.name,
            state: c.properties.state,
            country: c.properties.country,
            latidude: c.geometry.coordinates[1],
            longtitude: c.geometry.coordinates[0],
          }));

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
            id="search-input"
            className="w-[20rem]"
            type="search"
            placeholder="Search..."
            value={value}
            onInput={handleChange}
            tabIndex={1}
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
                      <div
                        className="justify-start w-full p-1 hover:bg-muted cursor-pointer"
                        key={city.id}
                        tabIndex={-1}
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex flex-col w-full">
                          <div className="font-medium">{city.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {[city.state, city.country].filter(Boolean).join(', ')}
                          </div>
                        </div>
                      </div>
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

export { Header, HeaderSearch, HeaderTitle };

