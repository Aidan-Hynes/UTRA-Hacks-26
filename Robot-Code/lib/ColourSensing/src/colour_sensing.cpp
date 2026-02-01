#include "colour_sensing.h"
#include <Arduino.h>
#include <MD_TCS230.h>
#include <FreqCount.h>

ColourSensing::ColourSensing(int S0, int S1, int S2, int S3, int OUT)
    : sensor(S0, S1, S2, S3, OUT),
      _S0(S0), _S1(S1), _S2(S2), _S3(S3), _OUT(OUT)
{
}

void ColourSensing::begin()
{
    

    pinMode(_S0, OUTPUT);
    pinMode(_S1, OUTPUT);
    pinMode(_S2, OUTPUT);
    pinMode(_S3, OUTPUT);

    // DO NOT set pinMode for OUT
    // DO NOT manually control OE

    sensor.begin();   // starts FreqCount internally
    delay(100);
}

String ColourSensing::readSensor()
{
    sensor.read();

    unsigned long start = millis();
    while (!sensor.available() && (millis() - start) < 1000) {
        // wait for data
    }

    if (!sensor.available()) {
        Serial.println("Sensor not available!");
        return "unknown";
    }

    sensor.getRaw(&rawData);

    uint32_t r = rawData.value[0];
    uint32_t g = rawData.value[1];
    uint32_t b = rawData.value[2];

    Serial.print("Raw: R=");
    Serial.print(r);
    Serial.print(" G=");
    Serial.print(g);
    Serial.print(" B=");
    Serial.println(b);

    if (r < 20000 && g < 20000 && b < 20000) return "black";
    if (r > 100000 && g > 100000 && b > 100000) return "white";
    if (r > g && r > b) return "red";
    if (g > r && g > b) return "green";
    if (b > r && b > g) return "blue";

    return "unknown";
}
