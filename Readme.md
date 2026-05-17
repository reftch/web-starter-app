# Web Starter application

## Running in docker
```
docker build --no-cache -t web-starter .
docker run --rm -p 8080:8080 web-starter:latest 
```

Docker compose start:
```
docker compose -f docker/compose.yml up -d
```
Docker compose sop:
```
docker compose -f docker/compose.yml down
```
