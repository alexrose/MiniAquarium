#include <Arduino.h>

#define AIR_PUMP 5
#define FILTER_PUMP 6

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

int getPinNumber(String pin)
{
  if (pin == "air") {
    return AIR_PUMP;
  } else {
    return FILTER_PUMP;
  }
}

int getPinState(String pinState)
{
  if (pinState == "on") {
    return HIGH;
  } else {
    return LOW;
  }
}

void parseReceivedSerialData(String inData)
{
  if (inData.indexOf("fishcam:") >= 0) {
    int pin = getPinNumber(getValue(inData, ':', 1));
    int state = getPinState(getValue(inData, ':', 2));

    digitalWrite(pin, state);
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(AIR_PUMP, OUTPUT);
  pinMode(FILTER_PUMP, OUTPUT);

  digitalWrite(AIR_PUMP, HIGH);
  digitalWrite(FILTER_PUMP, HIGH);
}

void loop() {
  while(Serial.available()) {
    String inData = Serial.readString();
    parseReceivedSerialData(inData);
    delay(100);
  }
}