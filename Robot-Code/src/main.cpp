#include <Arduino.h>
#include "Motor.h"
#include "ColourSensing.h"

// Pin Definitions
const int forkServoPin = 3;
const int ultrasonicServoPin = 11;

const int ultrasonicTriggerPin = 7;
const int ultrasonicEchoPin = 8;

const int s0 = A0;
const int s1 = A1;
const int s2 = A2;
const int s3 = A3;
const int ColourOutPin = A4;

const int motor1Pin1 = 5;
const int motor1Pin2 = 6;

const int motor2Pin1 = 9;
const int motor2Pin2 = 10;

ColourSensing colourSensor(s0, s1, s2, s3, ColourOutPin);

void setup() {
    Serial.begin(9600);
    while(!Serial);
    Serial.println("Robot Initialized");
    colourSensor.auto_calibrate(5000); // Calibrate for 10 seconds
}

void loop() {
    ColourSensing::rgb color;
    colourSensor.readSensor(color);
    Serial.print("R: ");
    Serial.print(color.r);
    Serial.print(" G: ");
    Serial.print(color.g);
    Serial.print(" B: ");
    Serial.println(color.b);
    delay(500);
}