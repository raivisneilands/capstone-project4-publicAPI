import express, { urlencoded } from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const weatherAPIKey = "5a8bb3cc702bafdfcba22cfc20c98da3";


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/switch-to-weather", (req, res) => {
    res.render("weather.ejs")
});
app.post("/switch-to-jokes", (req, res) => {
    res.render("index.ejs")
});

app.post("/choose-type", async (req, res) => {
    const jokeType = req.body.jokeType;
    var result;
    var setup;
    var punchline;
    if(jokeType){
        result = await axios.get(`https://official-joke-api.appspot.com/jokes/${jokeType}/random`);
        setup = result.data[0].setup;
        punchline = result.data[0].punchline;
    } else {
        result = await axios.get(`https://official-joke-api.appspot.com/jokes/random`);
        setup = result.data.setup;
        punchline = result.data.punchline;
    }
    res.render("index.ejs", {
        setup: setup,
        punchline: punchline
    });
});

app.post("/joke-amount", async (req, res) => {
    const amount = req.body.amount;
    const result = await axios.get(`https://official-joke-api.appspot.com/jokes/random/${amount}`);
    res.render("index.ejs", {
        jokes: result.data
    });
});

app.post("/check-weather", async (req, res) => {
    try{
        const city = req.body.city;
        const result = await axios.get(`http://api.weatherstack.com/current?access_key=${weatherAPIKey}&query=${city}`)
        console.log(JSON.stringify(result.data));
        res.render("weather.ejs", {
            temperature: result.data.current.temperature,
            icon: result.data.current.weather_icons,
            description: result.data.current.weather_descriptions,
            location: result.data.location.name
        });
    } catch (error){
        res.render("weather.ejs", {
            error: error.message
        })
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
