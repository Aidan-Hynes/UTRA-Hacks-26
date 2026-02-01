#include "colour_sensing.h"
#include <Arduino.h>
#include <MD_TCS230.h>
#include <FreqCount.h>

ColourSensing::ColourSensing(int S0, int S1, int S2, int S3, int OUT)
    : sensor(S0, S1, S2, S3), _S0(S0), _S1(S1), _S2(S2), _S3(S3), _OUT(OUT){}



void ColourSensing::begin()
{
    pinMode(_S0, OUTPUT);
    pinMode(_S1, OUTPUT);
    pinMode(_S2, OUTPUT);
    pinMode(_S3, OUTPUT);
    pinMode(_OE, OUTPUT);
    pinMode(_OUT, INPUT);
}

String ColourSensing::readSensor()
{
    sensor.read();
    unsigned long start = millis();

    uint16_t loopCount = 0;
    while (!sensor.available() && (millis() - start) < 1200) {
        loopCount++;
    }

    unsigned long elapsed = millis() - start;
    Serial.print("Elapsed: ");
    Serial.print(elapsed);
    Serial.print("ms, loops: ");
    Serial.print(loopCount);
    Serial.print(", available: ");
    Serial.println(sensor.available());

    sensor.getRaw(&rawData);
    uint32_t r = rawData.value[0];
    uint32_t g = rawData.value[1];
    uint32_t b = rawData.value[2];

    Serial.print("Raw: R=");
    Serial.print(r);
    Serial.print(", G=");
    Serial.print(g);
    Serial.print(", B=");
    Serial.print(b);
    Serial.print(" | ");

    String color = "unknown";
    if (r < 20000 && g < 20000 && b < 20000) {
        color = "black";
    } else if (r > 100000 && g > 100000 && b > 100000) {
        color = "white";
    } else if (r > g && r > b) {
        color = "red";
    } else if (g > r && g > b) {
        color = "green";
    } else if (b > r && b > g) {
        color = "blue";
    }

    Serial.println(color);
    return color;
}
