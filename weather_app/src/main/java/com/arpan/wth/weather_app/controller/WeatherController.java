package com.arpan.wth.weather_app.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arpan.wth.weather_app.entity.Weather;
import com.arpan.wth.weather_app.service.WeatherServiceImpl;

@RestController
@RequestMapping("/api")
public class WeatherController {
	
	@Autowired
	private WeatherServiceImpl weatherServiceImpl;
	
	@GetMapping("/")
	public ResponseEntity<String> hello() {
		return new ResponseEntity<String>("Hello! for weather application", HttpStatus.OK);
	}
	
	@PostMapping("/alerts")
	public ResponseEntity<Weather> allNewstudent(@RequestBody Weather p) {
		return new ResponseEntity<Weather>(weatherServiceImpl.addWeatherAlerts(p), HttpStatus.OK);
	}
}
