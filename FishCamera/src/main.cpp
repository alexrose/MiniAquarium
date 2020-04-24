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

#include <WiFi.h>
#include <OneWire.h>
#include <esp32cam.h>
#include <WS2812FX.h>
#include <WebServer.h>
#include <UserConfig.h>
#include <ArduinoJson.h>
#include <DallasTemperature.h>
#include <ESP32_RMT_Driver.h>

#define PIN_LED 12
#define PIN_TEMP 13

/** WiFi credentials */
UserConfig::ConfigData configData;
const char* WIFI_SSID = configData.ssid;
const char* WIFI_PASS = configData.pass;

WebServer server(configData.serverPort);

static auto loRes = esp32cam::Resolution::find(320, 240);
static auto hiRes = esp32cam::Resolution::find(640, 480);

/** Leds setup */
int ledsNo = 8;
int ledStart = 0;
int ledStop = 7;
WS2812FX ledsBar = WS2812FX(ledsNo, PIN_LED, NEO_GRB  + NEO_KHZ800);

/** Temp sensor */
OneWire oneWire(PIN_TEMP);
DallasTemperature sensors(&oneWire);

/** Custom show functions which will use the RMT hardware to drive the LEDs. */
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

String getStatus(String message) 
{
  String jsonString;
  StaticJsonDocument<1024> data;

  sensors.requestTemperatures(); 

  data["status"] = "success";
  data["message"] = message;
  data["temperature"] = sensors.getTempCByIndex(0);
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

/** Web page: render image(default) */
void handleDefaultPage()
{
  server.send(200, "application/json", getStatus(""));
}

/** Web page: turn on lights(warn) & render video */
void handleWarmLight()
{
  ledsBar.setSegment(0, ledStart, ledStop, FX_MODE_STATIC, 0xfafa49, 1000, NO_OPTIONS);
  ledsBar.start();

  server.send(200, "application/json", getStatus("Warm light is on."));
}

/** Web page: turn on lights(cold) & render video */
void handleColdLight()
{
  ledsBar.setSegment(0, ledStart, ledStop, FX_MODE_STATIC, WHITE, 1000, NO_OPTIONS);
  ledsBar.start();

  server.send(200, "application/json", getStatus("Cold light is on."));
}

/** Web page: turn on lights(party) & render video */
void handlePartyLight()
{
  ledsBar.setSegment(0, ledStart, ledStop, FX_MODE_RAINBOW_CYCLE, BLUE, 512, NO_OPTIONS);
  ledsBar.start();

  server.send(200, "application/json", getStatus("Party lights are on."));
}

/** Web page: turn onf lights & render video */
void handleLightOff()
{
  ledsBar.stop();

  server.send(200, "application/json", getStatus("Lights are off."));
}

/** Web page: turn air pump on & render video */
void handleAirOn()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:air:on"); 
    break;
  }
  
  server.send(200, "application/json", getStatus("Air pump is on."));
}

/** Web page: turn air pump off & render video */
void handleAirOff()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:air:off"); 
    break;
  }

  server.send(200, "application/json", getStatus("Air pump is off."));
}

/** Web page: turn water filter on & render video */
void handleFilterOn()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:filter:on"); 
    break;
  }

  server.send(200, "application/json", getStatus("Filter pump is on."));
}

/** Web page: turn water filter off & render video */
void handleFilterOff()
{
  
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:filter:off"); 
    break;
  }

  server.send(200, "application/json", getStatus("Filter pump is off."));
}

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
  Serial.setDebugOutput(false);
  
  /** Leds bar setup */
  ledsBar.init(); 
  ledsBar.setBrightness(128);
  rmt_tx_int(RMT_CHANNEL_0, ledsBar.getPin());

  ledsBar.setCustomShow(ledsBarShow);
  ledsBar.stop();

  /** Temp sensor start */
  sensors.begin();

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

  WiFi.persistent(false);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  /** Server */
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
}

void loop()
{
  server.handleClient();
  ledsBar.service();
}

