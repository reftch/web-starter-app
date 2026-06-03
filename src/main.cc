#define CLIENT_TIMEOUT_SECONDS 1000

#include <chrono>
#include <iomanip>
#include <sstream>

#include "client.h"
#include "server.h"

int main() {
    static auto& log = http::Logger::getInstance();
    static http::Client meteo("https://api.open-meteo.com");
    static http::Client komoot("https://photon.komoot.io");
    http::Server s("0.0.0.0", 8080);

    // Register signal handler with capture
    static auto s_ptr = &s;
    signal(SIGINT, [](int) {
        s_ptr->Stop();
    });

    s.SetRoute<http::HttpMethod::GET>("/", [](const http::Request&, http::Response& res) {
        res.SetContent<http::ContentType::HTML>("index.html");
    });

    s.SetRoute<http::HttpMethod::GET>("/api/v1/temperature", [](const http::Request& req, http::Response& res) {
        std::string latidude = req.query().at("latidude");
        std::string longtitude = req.query().at("longtitude");
        log.Info("Request for meteo {}, {}", latidude, longtitude);
        auto client_res =
            meteo.Get("/v1/forecast?latitude=" + latidude + "&longitude=" + longtitude + 
                      "&current=temperature_2m&current=weather_code&current=wind_speed_10m&current=cloud_cover" +
                      "&hourly=temperature_2m,precipitation_probability,wind_speed_10m,cloud_cover" +
                      "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code,precipitation_sum,wind_speed_10m_max" +
                      "&forecast_days=7&timezone=auto");
        res.SetContent<http::ContentType::JSON>(client_res->content());
    });

    s.SetRoute<http::HttpMethod::GET>("/api/v1/cities", [](const http::Request& req, http::Response& res) {
        std::string keyword = req.query().at("keyword");
        log.Info("Request for cities {}", keyword);
        auto client_res = komoot.Get("/api/?q=" + keyword);
        res.SetContent<http::ContentType::JSON>(client_res->content());
    });

    s.SetRoute<http::HttpMethod::GET>("/api/v1/reverse", [](const http::Request& req, http::Response& res) {
        std::string lat = req.query().at("lat");
        std::string lon = req.query().at("lon");
        log.Info("Request for search a city {}, {}", lat, lon);
        auto client_res = komoot.Get("/reverse?lat=" + lat + "&lon=" + lon);
        res.SetContent<http::ContentType::JSON>(client_res->content());
    });

    s.Start();

    return 0;
}