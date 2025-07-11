package com.arpan.wth.weather_app.service;

import java.util.List;

import com.arpan.wth.weather_app.entity.Weather;

public interface WeatherService {
	List<Weather> getAllWeather();
	Weather addWeatherAlerts(Weather p);

}
