var citiesArray;
var makeClickable;
var uvColors = ["green" ,"green", "green", "yellow", "yellow", "yellow", "orange", "orange", "red", "red", "red", "purple", "purple", "purple"];
$("#search-btn").on("click", function(e) {
    
    var APIKey = "ae2dcc589707f61a832c268641e09317";
    var city = $("#search").val();

    // Save the name of the city
    var array = [];
    if (localStorage.getItem("cities")) {
        JSON.parse(localStorage.getItem("cities")).map(item => array.push(item));
        array.push(city);
        localStorage.setItem("cities", JSON.stringify(array));
    } else {
        array.push(city);
        console.log(array);
        localStorage.setItem("cities", JSON.stringify(array));
    }
    console.log(localStorage.getItem("cities"));
    // Here we are building the URL we need to query the database
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    
    // We then created an AJAX call
    $.ajax({
        url: weatherURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        

        var citiesDiv = $("#cities");
        var newCityDiv = $("<div>");
        newCityDiv.text(city);
        newCityDiv.addClass("city py-3 pl-3 border-bottom");
        citiesDiv.append(newCityDiv);

        $("#current-city").text(city)
        var dateArray = $(".date");
        var iconArray = document.querySelectorAll(".icon");
        var tempArray = $(".temp");
        var humidityArray = $(".humidity");
        $("#wind-speed").text(Math.round((parseInt(response.wind.speed) * 2.2369) * 10) / 10 + " MPH");

        dateArray[0].textContent = moment().format("l");
        var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
        iconArray[0].setAttribute("src", iconURL);
        tempArray[0].textContent = (Math.round(((parseInt(response.main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
        humidityArray[0].textContent = response.main.humidity + "%";

        
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey,
            method: "GET"
            }).then(function(response) {
                console.log(response);
                $("#uv-index").text(response[0].value);
                $("#uv-index").css("background-color", uvColors[Math.floor(response[0].value)]);
            })

            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
            
        $.ajax({
            url: forecastURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
    
                $("#wind-speed").text(Math.round((parseInt(response.list[0].wind.speed) * 2.2369) * 10) / 10 + " MPH");
                
                var k = 1;
                var day = 1;
                for (var i = 0; i < response.list.length; i++) {
                    if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        dateArray[k].textContent = moment().add(day, 'day').format("l");
                        var iconURL = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png";
                        iconArray[k].setAttribute("src", iconURL);
                        tempArray[k].textContent = (Math.round(((parseInt(response.list[i].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                        humidityArray[k].textContent = response.list[i].main.humidity + "%";
                        k+=1;
                        day+=1;
                    }
                }

                $("#container-right").removeClass("hide");
            })
        
        makeClickable()
    });
});


function makeClickable() {
    citiesArray = document.querySelectorAll(".city");
    for (var j = 0; j < citiesArray.length; j++) {
        citiesArray[j].addEventListener("click", function(event) {
            var APIKey = "ae2dcc589707f61a832c268641e09317";
            var city = event.target.textContent;
            console.log(city);
            // Here we are building the URL we need to query the database
            var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
            
            // We then created an AJAX call
            $("#current-city").text(city);
            var dateArray = $(".date");
            var iconArray = document.querySelectorAll(".icon");
            var tempArray = $(".temp");
            var humidityArray = $(".humidity");

            $.ajax({
                url: weatherURL,
                method: "GET"
                }).then(function(response) {
                    console.log(response);
        
                    $("#wind-speed").text(Math.round((parseInt(response.wind.speed) * 2.2369) * 10) / 10 + " MPH");            
                    
                    dateArray[0].textContent = moment().format("l");
                    var iconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
                    iconArray[0].setAttribute("src", iconURL);
                    tempArray[0].textContent = (Math.round(((parseInt(response.main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                    humidityArray[0].textContent = response.main.humidity + "%";

                    $.ajax({
                        url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + APIKey,
                        method: "GET"
                        }).then(function(response) {
                            console.log(response);
                            $("#uv-index").text(response[0].value);
                            $("#uv-index").css("background-color", uvColors[Math.floor(response[0].value)]);
                        })
                })

            

            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;

            $.ajax({
            url: forecastURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
    
                $("#wind-speed").text(Math.round((parseInt(response.list[0].wind.speed) * 2.2369) * 10) / 10 + " MPH");
                
                var k = 1;
                var day = 1;
                for (var i = 0; i < response.list.length; i++) {
                    if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {
                        dateArray[k].textContent = moment().add(day, 'day').format("l");
                        var iconURL = "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png";
                        iconArray[k].setAttribute("src", iconURL);
                        tempArray[k].textContent = (Math.round(((parseInt(response.list[i].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                        humidityArray[k].textContent = response.list[i].main.humidity + "%";
                        k+=1;
                        day+=1;
                    }
                }

                $("#container-right").removeClass("hide");
            })
        })
    }
}

if(localStorage.getItem("cities")) {
    var savedCities = JSON.parse(localStorage.getItem("cities"));
    console.log(savedCities);
    for (var i = 0; i < savedCities.length; i++) {
        var citiesDiv = $("#cities");
        var newCityDiv = $("<div>");
        newCityDiv.text(savedCities[i]);
        newCityDiv.addClass("city py-3 pl-3 border-bottom");
        citiesDiv.append(newCityDiv);
        makeClickable();
    }
}