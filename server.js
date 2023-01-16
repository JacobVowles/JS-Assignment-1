const { response } = require('express');
const weather = require('./weather.js');
const app = express();
app.listen(3000);
app.use(express.static("public"));

//Basic Queries
//Getting all the weather data and displaying it on the browser
app.get("/weather", (request,response) =>{
    let all = Object.keys(weather.Location);
    let weekdays = Object.keys(weather.weekdays);
    let kingstonWeather = weather.Location.Kingston;
    let torontoWeather = weather.Location.Toronto;
    let cornwallWeather = weather.Location.Cornwall;
    response.render("weather.ejs",{kingstonWeather: kingstonWeather, torontoWeather: torontoWeather, cornwallWeather: cornwallWeather,
                                   all:all,weekdays:weekdays});
})

//Getting the weather data for a week of a given city and displaying it
app.get("/weather/:city", (request,response) =>
{
    let city = request.params.city;
    let requestedCityWeather = weather.Location[city];
    let weekdays = Object.keys(weather.weekdays);
    response.render("cityWeather.ejs",{city,requestedCityWeather, weekdays:weekdays});
})

//Getting the weather data for a city on a certain day and displaying it
app.get("/weather/:city/:weekday/",(request,response)=>
{
    let city = request.params.city;
    let weekday = request.params.weekday;
    let requestedCityWeather = weather.Location[city];
    let weekdays = Object.keys(weather.weekdays);
    response.render("dailyCityWeather.ejs",{city, weekday,weekdays:weekdays, requestedCityWeather});
})
//Advanced Queries:
// displaying the warmest Location on a given day
app.get("/warmestLocation/:day",(request,response)=>{
    let day = request.params.day;
    let kingstonDay = weather.weekdayLocations.kingstonWeek[day];
    let cornwallDay = weather.weekdayLocations.cornwallWeek[day];
    let torontoDay = weather.weekdayLocations.torontoWeek[day];
    let warmestTempForDay = kingstonDay;
    let warmestLocation = "Kingston";
    if(warmestTempForDay.feelsLike < cornwallDay.feelsLike)
        {
            warmestTempForDay = cornwallDay;
            warmestLocation = "Cornwall";
        }
    else if(warmestTempForDay.feelsLike < torontoDay.feelsLike)
        {
            warmestTempForDay = torontoDay;
            warmestLocation = "Toronto";
        }
    response.render("warmestLocation.ejs",{warmestTempForDay,warmestLocation});
})
// displaying the warmest day on a given location
app.get("/warmestTemp/:location",(request,response)=>
{
    let location = request.params.location;
    let kingston = weather.Location.Kingston;
    let cornwall = weather.Location.Cornwall;
    let toronto = weather.Location.Cornwall;
    let warmestTemp = 0;
    let day = " ";
    if(location === "Kingston")
    {
        for( let ctr = 0;ctr < weather.Location.Kingston.length;ctr++)
        {
            if(kingston[ctr].feelsLike > warmestTemp)
            {
                warmestTemp = kingston[ctr].feelsLike;
                day = kingston[ctr].day;
            }
        }
    }
    else if(location === "Cornwall")
    {
        for( let ctr = 0; ctr < weather.Location.Cornwall.length;ctr++)
        {
            if(cornwall[ctr].feelsLike > warmestTemp)
            {
                warmestTemp = cornwall[ctr].feelsLike;
                day = cornwall[ctr].day;
            }
        }
    }
    else
    {
        for( let ctr = 0; ctr < weather.Location.Toronto.length;ctr++)
        {
            if(toronto[ctr].feelsLike > warmestTemp)
            {
                warmestTemp = toronto[ctr].feelsLike;
                day = toronto[ctr].day;
            }
        }
    }    
    
    response.render("warmestDay.ejs",{warmestTemp:warmestTemp, location,day});
})
// displaying the average temp for the week in a given city
app.get("/average/:city",(request,response)=>
{
    let city = request.params.city;
    let average = 0;
    let cityWeather = weather.Location[city];
    for(let ctr = 0; ctr < cityWeather[city].length; ctr++)
    {
        average+= cityWeather[ctr].feelsLike;
    }
    average= average / weather.Location[city].length;
    response.render("averageWeather.ejs",{average,city});
})
// displaying all days that are sunny in a given city
app.get("/sunny/:city",(request,response)=>
{
    let city = request.params.city;
    let cityWeather = weather.Location[city];
    let sunnyDays = [];
    let dayIndex = 0;
    for(let ctr = 0; ctr < cityWeather.length; ctr++)
    {
        if(cityWeather[ctr].hrs_of_sun > 5)
        {
            sunnyDays[dayIndex] = cityWeather[ctr];
            dayIndex++;
        }
    }
    response.render("sunnyWeather.ejs",{sunnyDays:sunnyDays,city});
})