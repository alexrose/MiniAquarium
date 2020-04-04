#include <Arduino.h>

/** Define used pins */
#define AirPump 5;
#define WaterPump 6;
#define TemperatureSensor 7;

String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i <= maxIndex && found <= index; i++){
    if(data.charAt(i) == separator || i == maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void parseReceivedSerialData(String inData)
{
  if (inData.indexOf("fishcam:") >= 0) {
    String pin = getValue(inData, ':', 1);
    String state = getValue(inData, ':', 2);
    digitalWrite(pin.toInt(), state.toInt());
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(13, OUTPUT);
  digitalWrite(13, HIGH);
}

void loop() {
  while(Serial.available()) {
    String inData = Serial.readString();
    parseReceivedSerialData(inData);
    delay(100);
  }
}