# Stage 1: Build stage
FROM alpine:3.20 AS build

RUN apk add --no-cache \
    build-base \
    cmake \
    musl-dev \
    git

WORKDIR /app

# Copy the source code into the container
COPY src ./src
COPY CMakeLists.txt ./CMakeLists.txt

# Compile in release mode  
RUN cmake -S . -B build -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_EXE_LINKER_FLAGS="-static"

RUN cmake --build build -j$(nproc) 

# Production 
FROM scratch

COPY --from=build /app/build/web-starter /web-starter

CMD [ "/web-starter" ]
