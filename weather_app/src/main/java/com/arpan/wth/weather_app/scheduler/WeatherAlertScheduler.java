package com.arpan.wth.weather_app.scheduler;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.arpan.wth.weather_app.entity.Weather;
import com.arpan.wth.weather_app.repository.WeatherRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WeatherAlertScheduler {

    private final WeatherRepository weatherRepository;
    private final JavaMailSender javaMailSender;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.api.key}")
    private String apiKey;
    
    @Value("${spring.mail.username}")
    private String senderEmail;

    @Scheduled(cron = "0 0 * * * *") // Runs every hour at 0th minute
    public void checkWeatherAndSendAlerts() {
        List<Weather> users = weatherRepository.findAll();

        for (Weather user : users) {
            String city = user.getCity();
            String userEmail = user.getUserEmail();
            
            if (city == null || city.isEmpty() || userEmail == null || userEmail.isEmpty()) {
                System.err.println("Skipping user with incomplete alert preferences (city or email missing).");
                continue;
            }

            try {
                String weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city +
                        "&appid=" + apiKey + "&units=metric";

                Map<?, ?> weatherResponse = restTemplate.getForObject(weatherUrl, Map.class);
                Map<?, ?> main = (Map<?, ?>) weatherResponse.get("main");
                List<?> weatherArray = (List<?>) weatherResponse.get("weather");
                String weatherMain = ((Map<?, ?>) weatherArray.get(0)).get("main").toString();

                Map<?, ?> coord = (Map<?, ?>) weatherResponse.get("coord");
                double lat = ((Number) coord.get("lat")).doubleValue();
                double lon = ((Number) coord.get("lon")).doubleValue();

                double temp = ((Number) main.get("temp")).doubleValue();
                double humidity = ((Number) main.get("humidity")).doubleValue();
                boolean isRaining = weatherMain.toLowerCase().contains("rain");

                String aqiUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat +
                        "&lon=" + lon + "&appid=" + apiKey;

                Map<?, ?> aqiResponse = restTemplate.getForObject(aqiUrl, Map.class);
                Map<?, ?> aqiData = (Map<?, ?>) ((List<?>) aqiResponse.get("list")).get(0);
                Map<?, ?> aqiMain = (Map<?, ?>) aqiData.get("main");
                int aqi = ((Number) aqiMain.get("aqi")).intValue(); 

                // Step 3: Build alert message
                StringBuilder alertMsg = new StringBuilder("🌤️ Weather Alert for " + city + ":\n");
                
                boolean alertTriggered = false;

                if (user.isAlertRain() && isRaining) {
                    alertMsg.append("🌧️ It's currently raining or drizzling.\n");
                    alertTriggered = true;
                }
                if (user.isAlertTempBelow10() && temp < 10) {
                    alertMsg.append("❄️ Temperature is below 10°C.\n");
                    alertTriggered = true;
                }
                if (user.isAlertTempAbove30() && temp > 30) {
                    alertMsg.append("🔥 Temperature is above 30°C.\n");
                    alertTriggered = true;
                }
                if (user.isAlertHumidityAbove80() && humidity > 80) {
                    alertMsg.append("💧 Humidity is above 80%.\n");
                    alertTriggered = true;
                }
                if (user.isAlertAqiAbove100() && aqi >= 4) {
                    alertMsg.append("🌫️ Air Quality Index (AQI) is Poor or worse (Current AQI: ").append(aqi).append(").\n");
                    alertTriggered = true;
                }
//                if (user.isAlertSevereWeather() && isSevereWeather(weatherMain)) { // You need to implement isSevereWeather
//                    alertMsg.append("⚠️ Severe weather conditions detected: ").append(weatherMain).append(".\n");
//                    alertTriggered = true;
//                }
               
                // Step 4: Send email if any condition matched
                if (alertTriggered) { // Check the flag, not just length
                    sendEmail(userEmail, "🚨 Weather Alert for " + city, alertMsg.toString());
                    System.out.println("Alert email sent to: " + userEmail);
                } else {
                    System.out.println("No alerts triggered for " + userEmail + " in " + city);
                }

            } catch (Exception e) {
                System.err.println("Error for user " + user.getUserEmail() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
    }
	
	public String sendEmail(String to, String subject, String text) {
		try {
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			
			mailMessage.setFrom(senderEmail);
			mailMessage.setTo(to);
			mailMessage.setSubject(subject);
			mailMessage.setText(text);

			javaMailSender.send(mailMessage);
			return "Mail Sent Successfully...";
		}

		catch (Exception e) {
			System.err.println("Failed to send email to " + to + ": " + e.getMessage());
			e.printStackTrace();
			return "Error while Sending Mail";
		}
	}
}
