#include <Arduino.h>
#include <HCSR04.h>

UltraSonicDistanceSensor distanceSensor(9, 10);  // trigger, echo

void setup() {
    Serial.begin(9600);
}

void loop() {
    long distance = distanceSensor.measureDistanceCm();
    Serial.println(distance);
    delay(100);
}
