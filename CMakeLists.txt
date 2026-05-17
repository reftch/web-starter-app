cmake_minimum_required(VERSION 3.10)
project(web-starter)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT APPLE)
    set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -static")
endif()

file(GLOB SOURCES "src/*.cc")

add_executable(web-starter-app ${SOURCES})

include(FetchContent)
FetchContent_Declare(
    http-server
    GIT_REPOSITORY https://github.com/reftch/http-server-cpp.git
    GIT_TAG        v0.2.0
)

# Repo has a flag to disable examples & tests, set it:
set(BUILD_EXAMPLES OFF CACHE INTERNAL "")
set(BUILD_TEST OFF CACHE INTERNAL "")

FetchContent_MakeAvailable(http-server)

target_link_libraries(web-starter-app http-server)

# copy assests
file(COPY assets DESTINATION ${CMAKE_BINARY_DIR})
