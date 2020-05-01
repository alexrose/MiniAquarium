##Mini Aquarium

####Hardware used
- Arduino Uno
- ESP32 Cam - Ai Thinker
- 2 Relay module
- Mini air pump(4.5V DC)
- Water resistent temperature sensor(DS18B20)
- RGB 8 leds bar(WS2812)
- Mini breadboard power source
- Power source 9V 1A
- Resistor 0.25W 4.7KΩ


####Instructions
- Rename "UserConfig.app" (within "FishCamera/src/") to "UserConfig.h" and update accordingly
- Update "constants.js" within "fish-panel/src" accordingly.

#####ArduPumps
Contains the source files for Arduino Uno, which is used to control the "2 Relay module" and power the Esp32Cam.

#####FishCam
Contains the source files for Esp32Cam, which:
- controls the lights
- controls the temperature sensor
- controls the "2 Relay module" by sending a message via serial to Arduino Uno 

_The web server has the following routes_
- __/__ - returns current status(current temperature, all available routes)
- __/warm-on__ - turn warm lights on
- __/cold-on__ - turn cold lights on
- __/party-on__ - turn party lights on
- __/light-off__ - turn lights off
- __/air-on__ - turn air pump on
- __/air-off__ - turn air pump off
- __/filter-on__ - turn filter pump on
- __/filter-off__ - turn filter pump off
- __/image.jpg__ - returns a JPEG image
- __/stream.mjpeg__ - returns a MJPEG video stream

> Library dependencies can be found in _ platformio.ini _ within each project's root.

#####fish-admin
Contains the source files for a web application, used mainly to gather information from the temperature sensor

_Available routes_
- __/panel__ - user interface
- __/api/settings__ - returns an array that contains different settings(all available routes from Esp32Cam)
- __/api/cron/settings__ - saves all above settigs to  our local database
- __/api/temperatures/{date?}__ - return and array that contains all temperatures from one day(or current day if not specified)
- __/api/cron/temperatures__ - get the temperature from Esp32Cam and saves to local database


_Installation instructions_
- git clone
- composer install
- create a new database
- copy ".env.example" to ".env" and update accordingly
- run `php artisan migrate:install` 
- run `php artisan make:seeder SettingSeeder`
- add to your crontab  `*/10 * * * * curl http://localhost/api/cron/temperatures`

#####fish-panel
Contains the source files for a react application(based on redux/redux-saga/bootstrap4), used to control the mini aquarium.
_Installation instructions_
- git clone
- npm install 
- build
- copy files to "/path/to/laravel/public/panel" directory 