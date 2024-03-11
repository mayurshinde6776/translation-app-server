import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(cors());

// Rapid API key and translation endpoint URL
const apiKey = '55c173d041msh9a67660f610a926p157966jsn855ad1153ea4';
const translationEndpoint = 'https://google-translate1.p.rapidapi.com/language/translate/v2';

app.post('/translate', async (req, resp) => {
    const { text } = req.body;

    if (!text) {
        resp.status(400).json({ error: 'Request body not having text' });
        return;
    }

    //parameters for the translation API using URLSearchParams
    const encodedParams = new URLSearchParams();
    encodedParams.set('q', text);
    encodedParams.set('target', 'fr');
    encodedParams.set('source', 'en');

    const options = {
        method: 'POST',
        url: translationEndpoint,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: encodedParams,
    };

    try {
        //  request to  translation API
        const response = await axios.request(options);
        
        // Extract the translated text from the API response
        const translatedText = response.data.data.translations[0].translatedText;

       
        resp.json({ translation: translatedText });
    } catch (error) {
        // translation errors and respond with an error message
        console.error('Translation error:', error);
        resp.status(500).json({ error: `Translation error: ${error.message}` });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
