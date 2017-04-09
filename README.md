# Upgraded-waffle

A small application to handle sensor data collection and visualization. Hook it up to you waffle iron to create an upgraded waffle :rocket:

Here is some sample code for a photon + HTU21D temperature and humidity sensor
```C
#include <HTU21D.h>

TCPClient client;
byte server[] = { 192, 168, 2, 191 }; // Pi ip
int port = 1338;
HTU21D htu = HTU21D();

void setup()
{
	while(! htu.begin()){
	    delay(1000);
	}
}

void loop() {
    if (client.connect(server, port)) {
        int humidity = htu.readHumidity();
        client.print("{\"id\":\"ground_floor_humidity\",\"data\": \"" + String(humidity) + "\"}");
        client.stop();
    }
    
    if (client.connect(server, port)) {
        int temperature = htu.readTemperature();
        client.print("{\"id\":\"ground_floor_temperature\",\"data\": \"" + String(temperature) + "\"}");
        client.stop();
    }
    
    System.sleep(SLEEP_MODE_DEEP, 3600); // Send data once an hour roughly
}
```
