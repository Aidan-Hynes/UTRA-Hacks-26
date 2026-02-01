#include <Arduino.h>
#include <limits.h>
#include "ColourSensing.h"


ColourSensing::ColourSensing(int s0Pin, int s1Pin, int s2Pin, int s3Pin, int outPin)
{
    this->s0Pin = s0Pin;
    this->s1Pin = s1Pin;
    this->s2Pin = s2Pin;
    this->s3Pin = s3Pin;
    this->outPin = outPin;

    pinMode(s0Pin, OUTPUT);
    pinMode(s1Pin, OUTPUT);
    pinMode(s2Pin, OUTPUT);
    pinMode(s3Pin, OUTPUT);
    pinMode(outPin, INPUT);

    // Set frequency scaling to 20%
    digitalWrite(s0Pin, HIGH);
    digitalWrite(s1Pin, LOW);

    redMin = ULONG_MAX; redMax = 0;
    greenMin = ULONG_MAX; greenMax = 0;
    blueMin = ULONG_MAX; blueMax = 0;

    redPercent = 0;
    greenPercent = 0;
    bluePercent = 0;
}

void ColourSensing::auto_calibrate(unsigned long durationMs) {
    unsigned long start = millis();

    Serial.println("Auto-calibration started...");
    Serial.println("Move sensor over LIGHT and DARK surfaces");

    while (millis() - start < durationMs) {
        // RED
        digitalWrite(s2Pin, LOW);
        digitalWrite(s3Pin, LOW);
        int r = pulseIn(outPin, LOW);
        redMin = min(redMin, r);
        redMax = max(redMax, r);

        // GREEN
        digitalWrite(s2Pin, HIGH);
        digitalWrite(s3Pin, HIGH);
        int g = pulseIn(outPin, LOW);
        greenMin = min(greenMin, g);
        greenMax = max(greenMax, g);

        // BLUE
        digitalWrite(s2Pin, LOW);
        digitalWrite(s3Pin, HIGH);
        int b = pulseIn(outPin, LOW);
        blueMin = min(blueMin, b);
        blueMax = max(blueMax, b);
    }

    Serial.println("Calibration done!");
    Serial.print("R: "); Serial.print(redMin); Serial.print(" - "); Serial.println(redMax);
    Serial.print("G: "); Serial.print(greenMin); Serial.print(" - "); Serial.println(greenMax);
    Serial.print("B: "); Serial.print(blueMin); Serial.print(" - "); Serial.println(blueMax);
}

void ColourSensing::readSensor(rgb &colour) {
    // Read Red
    digitalWrite(s2Pin, LOW);
    digitalWrite(s3Pin, LOW);
    redValue = pulseIn(outPin, LOW);

    // Read Green
    digitalWrite(s2Pin, HIGH);
    digitalWrite(s3Pin, HIGH);
    greenValue = pulseIn(outPin, LOW);

    // Read Blue
    digitalWrite(s2Pin, LOW);
    digitalWrite(s3Pin, HIGH);
    blueValue = pulseIn(outPin, LOW);

    // Convert to %
    redPercent = map(redValue, redMax, redMin, 0, 100);
    greenPercent = map(greenValue, greenMax, greenMin, 0, 100);
    bluePercent = map(blueValue,  blueMax,  blueMin,  0, 100);
    redPercent   = constrain(redPercent,   0, 100);
    greenPercent = constrain(greenPercent, 0, 100);
    bluePercent  = constrain(bluePercent,  0, 100);

    Serial.print("R= "); Serial.print(redPercent); Serial.print("% ");
    Serial.print("G= "); Serial.print(greenPercent); Serial.print("% ");
    Serial.print("B= "); Serial.print(bluePercent); Serial.println("%");
    
    colour.r = redPercent;
    colour.g = greenPercent;
    colour.b = bluePercent;
}