import config from "../config";

function getWatsonToken () {
    return fetch(`${config.SERVER_BASE_URL}/api/stt/token/`)
            .then(res => res.json());
}

export { getWatsonToken };