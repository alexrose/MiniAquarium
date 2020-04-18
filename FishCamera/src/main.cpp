/**
 * FishCamera - Alex Trandafir 
 * www.alextrandafir.ro
 * 
 * Upload sketch instructions
 * RX(blue) to U0T
 * TX(green) to U0R
 * VCC(red) to 5V
 * GND(black) to GND
 * GND to IO0(esp32cam)
 * 
 * Board "AI Thinker ESP32-CAM"
 */

#include <Arduino.h>
#include <WiFi.h>
#include <esp32cam.h>
#include <WS2812FX.h>
#include <WebServer.h>
#include <UserConfig.h>
#include <ArduinoJson.h>
#include <ESP32_RMT_Driver.h>
#include <Wire.h>

#define PIN_LED 12
#define PIN_SDA 13
#define PIN_SCL 14
//#define PIN_LIGHT 33

// WiFi
UserConfig::ConfigData configData;
const char* WIFI_SSID = configData.ssid;
const char* WIFI_PASS = configData.pass;

// WebServer
WebServer server(configData.serverPort);

// Camera
static auto loRes = esp32cam::Resolution::find(320, 240);
static auto hiRes = esp32cam::Resolution::find(640, 480);

// I2C
int I2Caddress = 8;
char remoteReadResponse[10];

// Leds
int ledsNo = 8;
int ledStart = 0;
int ledStop = 7;

WS2812FX ledsBar = WS2812FX(ledsNo, PIN_LED, NEO_GRB  + NEO_KHZ800);

// Custom show functions which will use the RMT hardware to drive the LEDs
void ledsBarShow(void) {
  uint8_t *pixels = ledsBar.getPixels();
  uint16_t numBytes = ledsBar.getNumBytes() + 1;
  rmt_write_sample(RMT_CHANNEL_0, pixels, numBytes, false);
}

void handleJpeg()
{
  if (!esp32cam::Camera.changeResolution(hiRes)) {
    Serial.println("High resolution failed.");
  }
  
  auto frame = esp32cam::capture();
  if (frame == nullptr) {
    Serial.println("Capture failed.");
    server.send(503, "", "");
    return;
  }

  server.setContentLength(frame->size());
  server.send(200, "image/jpeg");
  WiFiClient client = server.client();
  frame->writeTo(client);
}

void handleMjpeg()
{
  if (!esp32cam::Camera.changeResolution(hiRes)) {
    Serial.println("High resolution failed.");
  }

  WiFiClient client = server.client();
  int res = esp32cam::Camera.streamMjpeg(client);
  if (res <= 0) {
    Serial.printf("Stream error: %d\n", res);
    return;
  }
}

void remoteDigitalWrite(String pin, String state)
{
  String val = "{\"gpio\":\""+pin+"\",\"state\":\""+state+"\"}";
  char buff[64];
  val.toCharArray(buff, 64);

  Wire.beginTransmission(8);
  Wire.write(buff);
  byte res = Wire.endTransmission(); 

  Serial.println(res);
}

// char* remoteDigitalRead(String pin)
// {
//   delay(500);
//   String val = "{\"gpio\":\""+pin+"\",\"action\":\"read\"}";
//   char buff[128];
//   val.toCharArray(buff,128);

//   Wire.beginTransmission(I2Caddress);
//   Wire.write(buff);
//   Wire.endTransmission();

//   // Request(8 byte) data from slave
//   Wire.requestFrom(I2Caddress, 8);

//   for (byte i=0; i<8; i++)
//   {
//       remoteReadResponse[i] = Wire.read();
//   }
//   remoteReadResponse[8] = '\0';

//   return remoteReadResponse;
// }

String getStatus(String message) 
{
  String jsonString;
  StaticJsonDocument<1024> data;
  
  data["status"] = "success";
  data["message"] = message;
  
  //data["air"] = remoteDigitalRead("air");
  //data["light"] = digitalRead(PIN_LIGHT);
  //data["filter"] = remoteDigitalRead("filter");
  data["url"]["base"] = String(configData.server);
  data["url"]["image"] = "/image.jpg";
  data["url"]["video"] = "/stream.mjpeg";
  data["url"]["air-on"] = "/air-on";
  data["url"]["air-off"] = "/air-off";
  data["url"]["filter-on"] = "/filter-on";
  data["url"]["filter-off"] = "/filter-off";
  data["url"]["warm-light"] = "/warm-on";
  data["url"]["cold-light"] = "/cold-on";
  data["url"]["party-light"] = "/party-on";
  data["url"]["light-off"] = "/light-off";
  
  serializeJson(data, jsonString);
  return jsonString;
}

// Web page: status
void handleDefaultPage()
{
  server.send(200, "application/json", getStatus(""));
}

// Web page: turn on warm lights
void handleWarmLight()
{
  ledsBar.stop();
  ledsBar.setSegment(0, ledStart, ledStop, FX_MODE_STATIC, 0xfafa49, 1000, NO_OPTIONS);
  ledsBar.start();

  //digitalWrite(PIN_LIGHT, LOW);
  server.send(200, "application/json", getStatus("Warm light is on."));
}

// Web page: turn on cold lights
void handleColdLight()
{
  ledsBar.stop();
  ledsBar.setSegment(0, ledStart, ledStop, FX_MODE_STATIC, WHITE, 1000, NO_OPTIONS);
  ledsBar.start();

  //digitalWrite(PIN_LIGHT, LOW);
  server.send(200, "application/json", getStatus("Cold light is on."));
}

// Web page: turn on lights(party)
void handlePartyLight()
{
  ledsBar.stop();
  ledsBar.setSegment(0, ledStart, ledStop, FX_MODE_RAINBOW_CYCLE, BLUE, 512, NO_OPTIONS);
  ledsBar.start();

  //digitalWrite(PIN_LIGHT, LOW);
  server.send(200, "application/json", getStatus("Party lights are on."));
}

// Web page: turn off lights
void handleLightOff()
{
  ledsBar.stop();
  //digitalWrite(PIN_LIGHT, HIGH);
  server.send(200, "application/json", getStatus("Lights are off."));
}

// Web page: turn air pump on
void handleAirOn()
{
  remoteDigitalWrite("air", "on");
  server.send(200, "application/json", getStatus("Air pump is on."));
}

// Web page: turn air pump off
void handleAirOff()
{
  remoteDigitalWrite("air", "off");
  server.send(200, "application/json", getStatus("Air pump is off."));
}

// Web page: turn water filter
void handleFilterOn()
{
  remoteDigitalWrite("filter", "on");
  server.send(200, "application/json", getStatus("Filter pump is on."));
}

// Web page: turn water filter off
void handleFilterOff()
{
  remoteDigitalWrite("filter", "off");
  server.send(200, "application/json", getStatus("Filter pump is off."));
}

// Web page: action not found
void handleNotFound()
{
  String jsonString;
  StaticJsonDocument<128> data;

  data["status"] = "error";
  data["message"] = "404 - action not found.";
  
  serializeJson(data, jsonString);
  server.send(404, "application/json", jsonString);
}

void setup()
{
  Serial.begin(115200);
  Serial.setDebugOutput(0);
  
  // Leds bar setup
  ledsBar.init(); 
  ledsBar.setBrightness(128);
  rmt_tx_int(RMT_CHANNEL_0, ledsBar.getPin());

  ledsBar.setCustomShow(ledsBarShow);
  ledsBar.stop();

  //pinMode(PIN_LIGHT, OUTPUT);
  //digitalWrite(PIN_LIGHT, HIGH);

  // Camera
  {
    using namespace esp32cam;
    Config cfg;
    cfg.setPins(pins::AiThinker);
    cfg.setResolution(hiRes);
    cfg.setBufferCount(1);
    cfg.setJpeg(90);

    bool ok = Camera.begin(cfg);
    Serial.println(ok ? "Camera ok." : "Camera failed.");
  }

  // WiFi connection
  WiFi.persistent(false);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  // Web Server actions
  server.on("/", handleDefaultPage);
  server.on("/warm-on", handleWarmLight);
  server.on("/cold-on", handleColdLight);
  server.on("/party-on", handlePartyLight);
  server.on("/light-off", handleLightOff);
  server.on("/air-on", handleAirOn);
  server.on("/air-off", handleAirOff);
  server.on("/filter-on", handleFilterOn);
  server.on("/filter-off", handleFilterOff);
  server.on("/image.jpg", handleJpeg);
  server.on("/stream.mjpeg", handleMjpeg);
  server.onNotFound(handleNotFound);
  server.begin();

  // I2C communication
  Wire.begin(PIN_SDA, PIN_SCL);
}

void loop()
{
  server.handleClient();
  ledsBar.service(); 
}

