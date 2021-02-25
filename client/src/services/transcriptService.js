import config from "../config";

function getKeywords(params) {
    return fetch(`${config.SERVER_BASE_URL}/api/transcript/keywords?${params}`)
            .then(res => res.json());
}

function getTranslation(params) {
    return fetch(`${config.SERVER_BASE_URL}/api/transcript/translation?${params}`)
            .then(res => res.json());
}

function getWordCloud(params) {
    return fetch(`${config.SERVER_BASE_URL}/api/transcript/wordcloud?${params}`)
            .then(res => res.json());
}

export { getKeywords, getTranslation, getWordCloud };
