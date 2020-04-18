#include <Arduino.h>
#include <ArduinoJson.h>
#include <Wire.h>

#define AIR_PUMP 5
#define FILTER_PUMP 6

int getPinNumber(String pin)
{
  if (pin == "air") 
  {
    return AIR_PUMP;
  } 
  else if (pin == "filter") 
  {
    return FILTER_PUMP;
  } 
  else 
  {
    return 0;
  }
}

int getPinState(String pinState)
{
  if (pinState == "on") 
  {
    return HIGH;
  } else if(pinState == "off"){
    return LOW;
  } else {
    return -1;
  }
}

void processCall(String command)
{
  DynamicJsonDocument jsonBuffer(64);
  auto error = deserializeJson(jsonBuffer, command);
 
  if (!error) 
  {
    int gpio = getPinNumber(jsonBuffer["gpio"]);
    int state = getPinState(jsonBuffer["state"]);
 
    /** Set/Get GPIO state  */
    if (state == -1) 
    {
      Wire.print(digitalRead(gpio));
    } else {
      digitalWrite(gpio, state);
    }    
  }
}
 
void receiveEvent(int howMany) 
{
  String data = "";
  while (0 < Wire.available()) 
  {
    char c = Wire.read();
    data += c;
  }
  Serial.println(data);
  processCall(data);
}

void setup() 
{
  Wire.begin(8);
  Wire.onReceive(receiveEvent);

  Serial.begin(115200);

  pinMode(AIR_PUMP, OUTPUT);
  pinMode(FILTER_PUMP, OUTPUT);

  digitalWrite(AIR_PUMP, HIGH);
  digitalWrite(FILTER_PUMP, HIGH);
}

void loop() 
{
  delay(10);
}