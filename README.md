# Upgraded-waffle

A small application to handle sensor data collection and visualization. Hook it up to you waffle iron to create an upgraded waffle :rocket:

The server is developed with first generation Raspberry pis in mind, so given thier low spec and only being 32 bit it does not use fancy stuff like mongo and such for data storage but rolls it own. To run this as a service on your pi, please follow these simple steps (if running arch):
1. Make sure node is installed
2. Checkout this repo
3. Add a file with the following content to the correct location (see https://wiki.archlinux.org/index.php/daemons)
```
[Unit]
Description=Node.js data logger service

[Service]
ExecStart=[path to node] [path to server.js]
WorkingDirectory=[path to directory of server.js]
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=node data logger
User=[the user to run as]

[Install]
WantedBy=multi-user.target
```
4. systemctl enable [name of the file] if you want it to run on startup or systemctl start [name of the file] if you want it to run now

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
