var citiesArray;
var makeClickable;
var uvColors = ["green" ,"green", "green", "yellow", "yellow", "yellow", "orange", "orange", "red", "red", "red", "purple", "purple", "purple"];
$("#search-btn").on("click", function(e) {
    
    var APIKey = "ae2dcc589707f61a832c268641e09317";
    var city = $("#search").val();
    // Here we are building the URL we need to query the database
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
    
    // We then created an AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
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
        $("#wind-speed").text(Math.round((parseInt(response.list[0].wind.speed) * 2.2369) * 10) / 10 + " MPH");

        for (i = 0, j = 0; i < 6, j < 40; i++, j+=8) {
            
            dateArray[i].textContent = moment().add(i, 'day').format("l");
            var iconURL = "http://openweathermap.org/img/wn/" + response.list[j].weather[0].icon + ".png";
            iconArray[i].setAttribute("src", iconURL);
            tempArray[i].textContent = (Math.round(((parseInt(response.list[j].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
            humidityArray[i].textContent = response.list[j].main.humidity + "%";

            if (j === 32) {
                dateArray[5].textContent = moment().add(i, 'day').format("l");
                var iconURL = "http://openweathermap.org/img/wn/" + response.list[39].weather[0].icon + ".png";
                iconArray[5].setAttribute("src", iconURL);
                tempArray[5].textContent = (Math.round(((parseInt(response.list[39].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                humidityArray[5].textContent = response.list[39].main.humidity + "%";
            }
        }

        
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + "&appid=" + APIKey,
            method: "GET"
            }).then(function(response) {
                console.log(response);
                $("#uv-index").text(response[0].value);
                $("#uv-index").css("background-color", uvColors[Math.floor(response[0].value)]);
            })

        $("#container-right").removeClass("hide");
        
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
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
            
            // We then created an AJAX call
            $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                console.log(response);
    
                $("#current-city").text(city)
                var dateArray = $(".date");
                var iconArray = document.querySelectorAll(".icon");
                var tempArray = $(".temp");
                var humidityArray = $(".humidity");
                $("#wind-speed").text(Math.round((parseInt(response.list[0].wind.speed) * 2.2369) * 10) / 10 + " MPH");
    
                for (i = 0, j = 0; i < 6, j < 40; i++, j+=8) {
            
                    dateArray[i].textContent = moment().add(i, 'day').format("l");
                    var iconURL = "http://openweathermap.org/img/wn/" + response.list[j].weather[0].icon + ".png";
                    iconArray[i].setAttribute("src", iconURL);
                    tempArray[i].textContent = (Math.round(((parseInt(response.list[j].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                    humidityArray[i].textContent = response.list[j].main.humidity + "%";
        
                    if (j === 32) {
                        dateArray[5].textContent = moment().add(i, 'day').format("l");
                        var iconURL = "http://openweathermap.org/img/wn/" + response.list[39].weather[0].icon + ".png";
                        iconArray[5].setAttribute("src", iconURL);
                        tempArray[5].textContent = (Math.round(((parseInt(response.list[39].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                        humidityArray[5].textContent = response.list[39].main.humidity + "%";
                    }
                }

                $.ajax({
                    url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + "&appid=" + APIKey,
                    method: "GET"
                    }).then(function(response) {
                        console.log(response);
                        $("#uv-index").text(response[0].value);
                        $("#uv-index").css("background-color", uvColors[Math.floor(response[0].value)]);
                    })
    
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