# Stage 1: Build stage
FROM ubuntu:latest AS build

# Install build-essential for compiling C++ code
RUN apt-get update && apt-get install -y build-essential cmake git

# Set the working directory
WORKDIR /app

# Copy the source code into the container
COPY . .

# Compile in release mode  
RUN cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DCMAKE_EXPORT_COMPILE_COMMANDS=YES
RUN cmake --build build

# Stage 2: Runtime stage
FROM scratch

# Copy the static binary from the build stage
COPY --from=build /app/build/web-starter-app /web-starter-app
COPY --from=build /app/build/assets /assets

# Command to run the binary
CMD ["/web-starter-app"]