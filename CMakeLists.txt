cmake_minimum_required(VERSION 3.10)
project(web-starter)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

file(GLOB SOURCES "src/*.cc")

add_executable(web-starter ${SOURCES})

# -----------------------------
# OPTIONS (disable extras early)
# -----------------------------
option(BUILD_EXAMPLES OFF)
option(BUILD_TESTS OFF)

# -----------------------------
# Fetch dependency
# -----------------------------
include(FetchContent)

set(BUILD_EXAMPLES OFF CACHE INTERNAL "")
set(BUILD_TEST OFF CACHE INTERNAL "")

FetchContent_Declare(
    http-server
    GIT_REPOSITORY https://github.com/reftch/http-server-cpp.git
    GIT_TAG        v0.2.32
)

FetchContent_MakeAvailable(http-server)

target_link_libraries(web-starter PRIVATE http-server)

# -----------------------------
# SIZE OPTIMIZATION
# -----------------------------
target_compile_options(web-starter PRIVATE
    -Os
    -ffunction-sections
    -fdata-sections
    -fno-exceptions
    -fno-rtti
)

if(NOT APPLE)
target_link_options(web-starter PRIVATE
    -Wl,--gc-sections,-s
)
else()
target_link_options(web-starter PRIVATE
    -Wl,-dead_strip,-s
)
endif()

# -----------------------------
# LTO 
# -----------------------------
set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
