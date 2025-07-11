package com.arpan.wth.weather_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.arpan.wth.weather_app.entity.Weather;

import jakarta.transaction.Transactional;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {
	@Modifying
    @Transactional
    @Query("UPDATE Weather p SET p.city = :city, p.alertRain = :alertRain, p.alertTempBelow10 = :alertTempBelow10, p.alertHumidityAbove80 = :alertHumidityAbove80, p.alertTempAbove30 = :alertTempAbove30, p.alertAqiAbove100 = :alertAqiAbove100, p.alertSevereWeather = :alertSevereWeather WHERE p.userEmail = :email")
	int updatePreferencesByEmail(
		    @Param("email") String email,
		    @Param("city") String city,
		    @Param("alertRain") boolean alertRain,
		    @Param("alertTempBelow10") boolean alertTempBelow10,
		    @Param("alertHumidityAbove80") boolean alertHumidityAbove80,
		    @Param("alertTempAbove30") boolean alertTempAbove30,
		    @Param("alertAqiAbove100") boolean alertAqiAbove100,
		    @Param("alertSevereWeather") boolean alertSevereWeather
		);
	
	Optional<Weather> findByUserEmail(String userEmail);
	
	

}