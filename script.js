let historyArr = []

getLastOrDefault();

localTimeDisplay();

$('#searchCity').on('click', function (e) {

    e.preventDefault();

    let value = $('#cityInputValue').val()

    if (value === '') {
        return
    } else {
        requestAjax(value);
    }

});

$('#clearHistoryBtn').on('click', function (e) {

    e.preventDefault();

    deleteHistory()

});

function requestAjax(cityName) {

    let APIKey = "45206bc7905ed332d22f459efad39e5d";

    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let lat = response.city.coord.lat;
        let lon = response.city.coord.lon;

        checkForDuplicates(cityName);
       
        localStorage.setItem('lastCity', cityName);

        $(".city").text(response.city.name);
        $(".wind").text((response.list[0].wind.speed * 2.23694).toFixed(1));
      
        $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`,
            method: "GET"
        }).then(function (response) {

            let curntUv = response.value;

            if (curntUv < 3) {
                $('.uvIndex').addClass('bg-daisyYellow');
                $('.uvIndex').text(`${curntUv}`);
                $('.uvStatusMsg').text(' LOW');
            } else if (curntUv <= 6) {
                $('.uvIndex').addClass('bg-red');
                $('.uvIndex').text(`${curntUv}`);
                $('.uvStatusMsg').text(' MODERATE');
            } else if (curntUv <= 8) {
                $('.uvIndex').addClass('bg-blue');
                $('.uvIndex').text(`${curntUv}`);
                $('.uvStatusMsg').text(' HIGH');
            } else if (curntUv < 11) {
                $('.uvIndex').addClass('bg-pink');
                $('.uvIndex').text(`${curntUv}`);
                $('.uvStatusMsg').text(' VERY HIGH');
            } else if (curntUv >= 11) {
                $('.uvIndex').addClass('bg-sageGreen');
                $('.uvIndex').text(`${curntUv}`);
                $('.uvStatusMsg').text(' EXTREME');
            }

        });

        console.log(response);

        for (let i = 0; i < response.list.length; i++) {
         
            let iconUrl = 'http://openweathermap.org/img/wn/';
           
            let weatherIcon = iconUrl + response.list[i].weather[0].icon + '@2x.png';
            let weatherDescription = response.list[i].weather[0].description;
        
            let K = response.list[i].main.temp;
            let F = (K - 273.15) * 1.80 + 32;

            $(".humidity" + i).text(response.list[i].main.humidity);

            $(".temp" + i).text(F.toFixed(0));

            $('.icon' + i).attr('src', weatherIcon);
 
            $('.description' + i).text(weatherDescription);

            $('.day' + i).text(moment().add(i, 'days').format('M/DD/YY'));

        }
    });



}

$('.searchHistory').on('click', function (e) {
    let historySelection = $(e.target).text();  //e.target.innerText;

    requestAjax(historySelection);

});

function checkForDuplicates(cityName) {

    for (let i = 0; i < historyArr.length; i++) {
        if (cityName === historyArr[i]) {
            return;
        }
    }

    prepend(cityName);

    pushToHistoryArr(cityName);

}

function pushToHistoryArr(city) {
    historyArr.push(city);
}

function prepend(cityName) {
                  
    $('.searchHistory').prepend(`<a class="list-group-item list-group-item-action callbackThisTown list-group-item-primary text-primary ">${cityName}</a>`);
}

function deleteHistory() {

    localStorage.clear();
    historyArr = [];
        $('.searchHistory').empty();

}

function getLastOrDefault() {
    let cityName = 'Austin';
    let lastCity = localStorage.getItem('lastCity');
    if (lastCity !== null) {
        requestAjax(lastCity);
    } else {
        requestAjax(cityName);
    }
};

function localTimeDisplay() {

    
    $("#currentDay").text(moment().format("hh:mm:ss a"));

    setInterval(function () {
        $("#currentDay").text(moment().format("hh:mm:ss a"));
    }, 1000);
}