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


# Stage 1: Build stage
# FROM gcc:13 AS builder

# RUN apt-get update && apt-get install -y \
#     cmake \
#     musl-dev \
#     musl-tools

# WORKDIR /app

# # Copy source files
# COPY src ./src
# COPY CMakeLists.txt ./

# # Simple build with static linking
# RUN cmake -S . -B build -DCMAKE_BUILD_TYPE=Release \
#     -DCMAKE_EXE_LINKER_FLAGS="-static" && \
#     cmake --build build -j$(nproc) && \
#     cp /app/build/web-starter /web-starter

# # Stage 2: Runtime stage
# FROM scratch
# COPY --from=builder /web-starter /web-starter

# ENTRYPOINT ["/web-starter"]