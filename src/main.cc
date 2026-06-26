#include "server.h"

int main() {
    http::Server s;

    s.setRoute<http::HttpMethod::GET>("/", [](const http::Request&, http::Response& res) {
        res.setContent<http::ContentType::PLAIN_TEXT>("Hello, world!");
    });

    s.start();

    return 0;
}