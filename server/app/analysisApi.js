function analysisApi(app) {
    const config = require('../config.json');
    const { IamTokenManager } = require('ibm-watson/auth');

    const sttAuthenticator = new IamTokenManager({
        apikey: config.sttApiKey
    });
    
    //refer to https://github.com/watson-developer-cloud/speech-javascript-sdk/tree/master/examples/
    app.get('/api/stt/token', (req, res) => {
        return sttAuthenticator
        .requestToken()
        .then(({ result }) => {
          res.json({ accessToken: result.access_token, url: config.sttUrl });
        })
        .catch(console.error);
    });

    app.get('/api/transcript/keywords', (req, res) => {
        
        //save transprips into database
        //get keywords with submitted transcripts from the external analysis API
        const transcripts = req.query.transcripts;

        //sample response
        res.json({keywords: ['부작용', '효과', '진단']});
    });

    app.get('/api/transcript/translation', (req, res) => {
        //sample response
        res.json({keywords: ['side effect', 'similarity', 'diagnosis']});
    });

    app.get('/api/transcript/wordcloud', (req, res) => {
        //sample response
        const words = [
            '림프', '남성호르몬', '뇌척수염', '대동맥', '독소', '디옥시리보스', '저혈당', '적혈구',
            '흉통', '불안증', '고혈압', '두근거림', '포도당', '글루카곤', '당뇨', '항히스타민제', '해열제', '헤르니아', '레티노산', '리보플라빈'
        ];

        res.json({
            words: words.map(word => {
                    return {
                        text: word,
                        value: Math.floor(Math.random() * 90) + 10
                    }
            })
        });
    });
}

module.exports = analysisApi;