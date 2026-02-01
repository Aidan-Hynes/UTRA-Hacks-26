#include <Arduino.h>
#include "motor.h"
#include "ColourSensing.h"

void linefollow(Motor* motor, ColourSensing* colourSensor, ColourSensing::DetectedColour lineColour, bool rightSide, float gain) {
    // Line following logic goes here
    ColourSensing::rgb colour;
    ColourSensing::DetectedColour detected;
    colourSensor->readSensor(colour);

    float dist;
    detected = colourSensor->getClosestColour(colour, dist);

    if (rightSide) {
        // Right side line following logic
        if (detected == lineColour) {
            motor->move_motor1(false, 150); // Move forward
            motor->move_motor2(true, 50);
        } else {
            motor->move_motor1(true, 50); // Adjust direction
            motor->move_motor2(false, 150);
        }
    } else {
        // Left side line following logic
        if (detected == lineColour) {
            motor->move_motor1(true, 50); // Move forward
            motor->move_motor2(false, 150);
        } else {
            motor->move_motor1(false, 150); // Adjust direction
            motor->move_motor2(true, 50);
        }
    }

    Serial.print("Detected: ");
    Serial.print(detected);
    Serial.print("  Distance: ");
    Serial.println(dist, 4);
}
