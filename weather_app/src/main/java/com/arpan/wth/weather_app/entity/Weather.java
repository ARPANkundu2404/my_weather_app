package com.arpan.wth.weather_app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@NoArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "WeatherApp")
public class Weather {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(unique = true)
	private String userEmail;
	private String city;
    private boolean alertRain;
    private boolean alertTempBelow10;
    private boolean alertHumidityAbove80;
    private boolean alertTempAbove30;
    private boolean alertAqiAbove100;
    private boolean alertSevereWeather;

}
