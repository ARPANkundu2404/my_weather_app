package com.arpan.wth.weather_app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.arpan.wth.weather_app.entity.Weather;
import com.arpan.wth.weather_app.repository.WeatherRepository;

@Service
public class WeatherServiceImpl implements WeatherService {
	
	@Autowired
	private WeatherRepository weatherRepository;
	
	@Override
	public List<Weather> getAllWeather(){
		return weatherRepository.findAll();
	}
	
	@Override
	
	public Weather addWeatherAlerts(Weather p) {
		Optional<Weather> existing = weatherRepository.findByUserEmail(p.getUserEmail());

	    if (existing.isPresent()) {
	        weatherRepository.updatePreferencesByEmail(
	            p.getUserEmail(),
	            p.getCity(),
	            p.isAlertRain(),
	            p.isAlertTempBelow10(),
	            p.isAlertHumidityAbove80(),
	            p.isAlertTempAbove30(),
	            p.isAlertAqiAbove100(),
	            p.isAlertSevereWeather()
	        );
	        return weatherRepository.findByUserEmail(p.getUserEmail()).get();
	    } else {
	        return weatherRepository.save(p);
	    }
	}
}
