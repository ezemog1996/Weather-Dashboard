var citiesArray = []
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
            var tempArray = $(".temp");
            var humidityArray = $(".humidity");
            $("#wind-speed").text(Math.round((parseInt(response.list[0].wind.speed) * 2.2369) * 10) / 10 + " MPH");

            for (var i = 0; i < 6; i++) {
                dateArray[i].textContent = moment().add(i, 'day').format("l");
                tempArray[i].textContent = (Math.round(((parseInt(response.list[i].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                humidityArray[i].textContent = response.list[i].main.humidity + "%";
            }

            var uvColors = ["green" ,"green", "green", "green", "yellow", "yellow", "yellow", "orange", "orange", "red", "red", "red", "purple", "purple", "purple"];
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + response.city.coord.lat + "&lon=" + response.city.coord.lon + "&appid=" + APIKey,
                method: "GET"
                }).then(function(response) {
                    console.log(response);
                    $("#uv-index").text(response[0].value);
                    $("#uv-index").css("background-color", uvColors[Math.floor(response[0].value)]);
                })

            $("#container-right").removeClass("hide");
            citiesArray = $(".city");
        });   

        for (var j = 0; j < citiesArray.length; j++) {
            citiesArray.on("click", function(event) {
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
                    var tempArray = $(".temp");
                    var humidityArray = $(".humidity");
                    $("#wind-speed").text(Math.round((parseInt(response.list[0].wind.speed) * 2.2369) * 10) / 10 + " MPH");
        
                    for (var i = 0; i < 6; i++) {
                        dateArray[i].textContent = moment().add(i, 'day').format("l");
                        tempArray[i].textContent = (Math.round(((parseInt(response.list[i].main.temp) - 273.15) * (9/5) + 32) * 10) / 10 + " \u00B0F");
                        humidityArray[i].textContent = response.list[i].main.humidity + "%";
                    }
        
                    var uvColors = ["green" ,"green", "green", "green", "yellow", "yellow", "yellow", "orange", "orange", "red", "red", "red", "purple", "purple", "purple"];
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
});