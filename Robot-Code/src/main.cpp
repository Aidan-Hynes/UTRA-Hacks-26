#include <Arduino.h>
#include <HCSR04.h>
#include <MD_TCS230.h>
#include <FreqCount.h>
#include "colour_sensing.h"

#define S0 4
#define S1 8
#define S2 6
#define S3 7
#define OE 3    // LOW = ENABLED 
#define TCS_OUT 5 // TCS230 OUT must be on pin 5 for FreqCount on UNO

//UltraSonicDistanceSensor distanceSensor(9, 10);  // trigger, echo

void setup() {
    Serial.begin(9600);
    Serial.println("[TCS230 Simple BLOCKING Example]");
    
    FreqCount.begin(1000);
    
    colourSensor.begin();
    colourSensor.setEnable(true);
    colourSensor.setFilter(TCS230_RGB_X);
    colourSensor.setFrequency(TCS230_FREQ_HI);
    colourSensor.setSampling(10);
}

void loop() {
    readSensor();
    delay(1000);
}
