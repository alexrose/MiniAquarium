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

#include <esp32cam.h>
#include <WebServer.h>
#include <WiFi.h>
#include <userconfig.h>
#include <WS2812FX.h>
#include "ESP32_RMT_Driver.h"

/** WiFi credentials */
userConfig::WiFi wifiData;
const char* WIFI_SSID = wifiData.ssid;
const char* WIFI_PASS = wifiData.pass;

WebServer server(80);

static auto loRes = esp32cam::Resolution::find(320, 240);
static auto hiRes = esp32cam::Resolution::find(640, 480);

/** Leds setup */
WS2812FX ledsBar = WS2812FX(8, 12, NEO_GRB  + NEO_KHZ800);

/** Custom show functions which will use the RMT hardware to drive the LEDs. */
void ledsBarShow(void) {
  uint8_t *pixels = ledsBar.getPixels();
  // numBytes is one more then the size of the ws2812fx's *pixels array.
  // the extra byte is used by the driver to insert the LED reset pulse at the end.
  uint16_t numBytes = ledsBar.getNumBytes() + 1;
  rmt_write_sample(RMT_CHANNEL_0, pixels, numBytes, false);
}

void handleJpgHi()
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

/** Html template */
String serveHtml(String type)
{
  String mediaSrc = (type == "video") ? "/stream.mjpeg" : "/image.jpg";
  String buttonSrc = (type == "video") ? "/" : "/video";
  String buttonVal = (type == "video") ? "Home" : "Video";
  String buttonHome = (type != "default" && type != "video") ? "<button onclick='window.stop();window.location=\"/\";'>Home</button>" : "";

  String html = "<!DOCTYPE HTML><html>"\
"<head>"\
"  <meta name='viewport' content='width=device-width, initial-scale=1'>"\
"  <style>"\
"    body { text-align:center; }"\
"  </style>"\
"</head>"\
"<body>"\
"  <div id='container'>"\
"    <h2>FishCam</h2>"\
"    <p>"\
+buttonHome+\
"      <button onclick='window.stop();window.location=\""+buttonSrc+"\";'>"+buttonVal+"</button>"\
"      <button onclick='window.stop();window.location=\"/warm-light\";'>Warm light</button>"\
"      <button onclick='window.stop();window.location=\"/cold-light\";'>Cold light</button>"\
"      <button onclick='window.stop();window.location=\"/party-light\";'>Party light</button>"\
"      <button onclick='window.stop();window.location=\"/light-off\";'>Light off</button>"\
"      <button onclick='window.stop();location.reload();'>Refresh</button>"\
"    </p>"\
"  </div>"\
"  <div>"\
"    <img style='max-width:100%;' src='"+mediaSrc+"'>"\
"  </div>"\
"    <p>"\
"      <button onclick='window.stop();window.location=\"/air-on\";'>Air on</button>"\
"      <button onclick='window.stop();window.location=\"/air-off\";'>Air off</button>"\
"      <button onclick='window.stop();window.location=\"/filter-on\";'>Filter on</button>"\
"      <button onclick='window.stop();window.location=\"/filter-off\";'>Filter off</button>"\
"    </p>"\
"</body>"\
"</html>";

  return html;
}

/** Web page: render image(default) */
void handleDefaultPage()
{
  server.send(200, "text/html", serveHtml("default"));
}

/** Web page: render image */
void handleVideoPage()
{
  server.send(200, "text/html", serveHtml("video"));
}

/** Web page: turn on lights(warn) & render video */
void handleWarmLight()
{
  ledsBar.stop();
  ledsBar.setSegment(0, 0, 8-1, FX_MODE_STATIC, 0xfafa49, 1000, NO_OPTIONS);
  ledsBar.start();
  server.send(200, "text/html", serveHtml("warm-light"));
}

/** Web page: turn on lights(cold) & render video */
void handleColdLight()
{
  ledsBar.stop();
  ledsBar.setSegment(0, 0, 8-1, FX_MODE_STATIC, WHITE, 1000, NO_OPTIONS);
  ledsBar.start();

  server.send(200, "text/html", serveHtml("cold-light"));
}

/** Web page: turn on lights(party) & render video */
void handlePartyLight()
{
  ledsBar.stop();
  ledsBar.setSegment(0, 0, 8-1, FX_MODE_RAINBOW_CYCLE, BLUE, 512, NO_OPTIONS);
  ledsBar.start();

  server.send(200, "text/html", serveHtml("party-light"));
}

/** Web page: turn onf lights & render video */
void handleLightOff()
{
  ledsBar.stop();
  server.send(200, "text/html", serveHtml("light-off"));
}

/** Web page: turn air pump on & render video */
void handleAirOn()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:air:on"); 
    break;
  }
  
  server.send(200, "text/html", serveHtml("air-on"));
}

/** Web page: turn air pump off & render video */
void handleAirOff()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:air:off"); 
    break;
  }

  server.send(200, "text/html", serveHtml("air-off"));
}

/** Web page: turn water filter on & render video */
void handleFilterOn()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:filter:on"); 
    break;
  }

  server.send(200, "text/html", serveHtml("filter-on")); 
}

/** Web page: turn water filter off & render video */
void handleFilterOff()
{
  while(Serial.availableForWrite()) {
    Serial.write("fishcam:filter:off"); 
    break;
  }

  server.send(200, "text/html", serveHtml("filter-off"));
}


void setup()
{
  Serial.begin(115200);
  Serial.setDebugOutput(0);

  /** leds bar setup */
  ledsBar.init(); 
  ledsBar.setBrightness(64);
  rmt_tx_int(RMT_CHANNEL_0, ledsBar.getPin());

  ledsBar.setCustomShow(ledsBarShow);
  ledsBar.stop();

  {
    using namespace esp32cam;
    Config cfg;
    cfg.setPins(pins::AiThinker);
    cfg.setResolution(hiRes);
    cfg.setBufferCount(2);
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

  Serial.println("");
  Serial.print("http://");
  Serial.println(WiFi.localIP());

  server.on("/", handleDefaultPage);
  server.on("/video", handleVideoPage);
  server.on("/warm-light", handleWarmLight);
  server.on("/cold-light", handleColdLight);
  server.on("/party-light", handlePartyLight);
  server.on("/light-off", handleLightOff);

  server.on("/air-on", handleAirOn);
  server.on("/air-off", handleAirOff);
  server.on("/filter-on", handleFilterOn);
  server.on("/filter-off", handleFilterOff);

  server.on("/image.jpg", handleJpgHi);
  server.on("/stream.mjpeg", handleMjpeg);

  server.begin();
}

void loop()
{
  server.handleClient();
  ledsBar.service(); 
}

