const Config = require('./config.json');

function RequestURL(Endpoint) {
    return {
        url: Config.Panel_URL + Endpoint,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + Config.API_Token,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "DBH",
            "Cache-Control": "no-store"
        }
    };
};

module.exports = { RequestURL };