var apiKey = '&appid=8710c92cc91b2be9b69b111ac287d778';
var currWeather = 'https://api.openweathermap.org/data/2.5/weather?q=';
var cityInput;
var dateInput; 
var lat;
var lon;

//Hides initial weather display upon loading page
$('.weather-results').hide();

//click event on submit function to call weather functions, if city and/or date not selected, does not call weather function
$('#submit-btn').on('click', function(){
  cityInput = $('#textarea1');
  dateInput = $('#datepicker').val();
    if(dateInput == '' || cityInput.val() == ''){
    emptyInput();
  }else{
    getLatLon();
  }
});

//gets a latitude and longitude of city based on city name input
function getLatLon() {
var currentWeathURL = (currWeather + cityInput.val() + apiKey + '&units=imperial');
    fetch(currentWeathURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      
      console.log(data);
      if(data.cod == '404')
      {
        cityNotFound();
      }else{
      lat = data.coord.lat;
      lon = data.coord.lon;
      getWeather();
      }
    }) 
  }

  //function to call third-party API and return weather data for city input, based on date. Date must be current day or within 7 day future window, else function calls out error functions
  function getWeather () {
    var ForecastURL = ('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts' + apiKey + '&units=imperial');
    fetch(ForecastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if(dateInput > moment().add(7, 'days').format('YYYY-MM-DD')){
        for(var i = 7; dateInput > moment().add(i, 'days').format('YYYY-MM-DD') ; i++){
          var futIndex = i+1;
          if(dateInput == moment().add(futIndex, 'days').format('YYYY-MM-DD')){
            $('.weather-results').show();     
            futureDate(futIndex);
          }
      }
    }else if(dateInput < moment().format('YYYY-MM-DD')){
          for(var i = 0; dateInput < moment().subtract(i, 'days').format('YYYY-MM-DD') ; i++){
            var pastIndex = i+1;
            if(dateInput == moment().subtract(pastIndex, 'days').format('YYYY-MM-DD')){
              $('.weather-results').show();     
              pastDate(pastIndex);
            }
          }
    }else{
      for(var i = 0; i< 8; i++){
        if(dateInput == moment().add(i, 'days').format('YYYY-MM-DD')){
          $('.weather-results').show();     
          dispWeather(i, data);
        }
      }
    }
    })
  } 

  //if search fields incomplete, this function determines page content
  function emptyInput() {
    $('.weather-results').show(); 
    $('.card-title').text('ERROR');
    $('#weatherData').text('Search fields incomplete.  Please enter a city name, and select a valid date.');

  }

  //if date beyond forecast window is selected, function determines page content
  function futureDate(i){
    $('.card-title').text(cityInput.val() +' (' + moment().add(i, 'days').format('l') + ')');
    $('#weatherData').text('Weather Data Unavailable: Date selected is beyond the 7-Day forecast window. Please select either the current date, or a date within forecast window.');
  }

  //if date selected is in the past, function determines page output
  function pastDate(i){
    $('.card-title').text(cityInput.val() +' (' + moment().subtract(i, 'days').format('l') + ')');
    $('#weatherData').text('Weather Data Unavailable: Date selected is a prior date.  Please select either the current date, or a date within the 7-Day forecast window.');
  }

  //if city name is not valid, function dtermines page output
  function cityNotFound(){
    $('.weather-results').show(); 
    $('.card-title').text('ERROR');
    $('#weatherData').text('Unable to recognize city name.  Please verify city name is spelled correctly.');
  }

  //function used to grab desired weather data from API and print to page
  function dispWeather(index, data){
    
    var cardSection = $('#weatherData'); 
    cardSection.children().remove();
    cardSection.text('');
    $('.card-title').text(cityInput.val() + ' (' + moment().add(index, 'days').format('l') + ')')
    //temp low
    var tempLow = $('<p>');
    tempLow.addClass('weather-data');
    tempLow.text('Low Temperature: ' + data.daily[index].temp.min + ' \u00B0F');    
    cardSection.append(tempLow);
    //temp high
    var tempHigh = $('<p>');
    tempHigh.addClass('weather-data');
    tempHigh.text('High Temperature: ' + data.daily[index].temp.max + ' \u00B0F');
    cardSection.append(tempHigh);
    //wind
    var windSpeed = $('<p>');
    windSpeed.addClass('weather-data');
    windSpeed.text('Wind: ' + data.daily[index].wind_speed + ' MPH');
    cardSection.append(windSpeed);
    //weather condition 
    var weatherDesc = $('<p>');
    weatherDesc.addClass('weather-data');
    weatherDesc.text(data.daily[index].weather[0].description);
    cardSection.append(weatherDesc);
    //weather icon
    var weatherIcon = $('<img>');
    var iconCode = data.daily[index].weather[0].icon;
    weatherIcon.attr('src','http://openweathermap.org/img/wn/' + iconCode +'@2x.png')
    cardSection.append(weatherIcon);
  }
