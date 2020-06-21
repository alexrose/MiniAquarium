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
#include <PubSubClient.h>

#define PIN_LED 12
#define PIN_TEMP 13

/** WiFi credentials */
UserConfig::ConfigData configData;
const char* WIFI_SSID = configData.ssid;
const char* WIFI_PASS = configData.pass;

WebServer server(configData.serverPort);
PubSubClient client;

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
  data["url"]["image"] = String(configData.server) + "/image.jpg";
  data["url"]["video"] = String(configData.server) + "/stream.mjpeg";
  
  serializeJson(data, jsonString);
  return jsonString;
}

/** Web page: render default */
void handleDefaultPage()
{
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", getStatus(""));
}

void handleNotFound()
{
  String jsonString;
  StaticJsonDocument<128> data;

  data["status"] = "error";
  data["message"] = "404 - action not found.";
  
  serializeJson(data, jsonString);
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(404, "application/json", jsonString);
}

/** MQTT Connect */
void reconnect()
{
  while (!client.connected())
  {
    if (client.connect(configData.mqttClientId, configData.mqttUser, configData.mqttPass))
    {
      client.subscribe(configData.mqttTopic);
    }
    else
    {
      // Retry connecting after 3 seconds
      delay(3000);
    }
  }
}

void callback(char *topic, byte *payload, unsigned int length)
{
  StaticJsonDocument<BUFFER_SIZE> doc;

  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  char message[length + 1];
  for (int i = 0; i < length; i++)
  {
    message[i] = (char)payload[i];
  }
  message[length] = '\0';

  Serial.println(message);

  DeserializationError error = deserializeJson(doc, message);

  if (error)
  {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
    return;
  }

  JsonObject root = doc.as<JsonObject>();

  if (root.containsKey("brightness"))
  {
    byte newBrightness = constrain(root[String("brightness")], 0, 255);
    analogWrite(LED_PIN, (255 - newBrightness));
    brightness = newBrightness;
    Serial.print("Brightness: ");
    Serial.println(brightness);
  }
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
  server.on("/image.jpg", handleJpeg);
  server.on("/stream.mjpeg", handleMjpeg);
  server.onNotFound(handleNotFound);

  server.begin();

  /** MQTT */
  client.setServer(configData.mqttHost, configData.mqttPort);
  client.setCallback(callback);
}

void loop()
{
  ledsBar.service();
  server.handleClient();

  if (!client.connected()){
    reconnect();
  }

  client.loop();
}

