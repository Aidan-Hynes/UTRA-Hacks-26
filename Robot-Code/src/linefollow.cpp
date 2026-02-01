#include <Arduino.h>
#include "motor.h"
#include "ColourSensing.h"

void linefollow(Motor* motor, ColourSensing* colourSensor, bool rightSide, float gain) {
    // Line following logic goes here
    ColourSensing::rgb colour;
    ColourSensing::DetectedColour detected;
    colourSensor->readSensor(colour);

    float dist;
    detected = colourSensor->getClosestColour(colour, dist);

    if (rightSide) {
        // Right side line following logic
        if (detected == ColourSensing::COLOUR_RED) {
            motor->move_motor1(false, 150); // Move forward
            motor->move_motor2(false, 50);
        } else {
            motor->move_motor1(false, 50); // Adjust direction
            motor->move_motor2(false, 150);
        }
    } else {
        // Left side line following logic
        if (detected == ColourSensing::COLOUR_RED) {
            motor->move_motor1(false, 150); // Move forward
            motor->move_motor2(false, 50);
        } else {
            motor->move_motor1(false, 50); // Adjust direction
            motor->move_motor2(false, 150);
        }
    }

    Serial.print("Detected: ");
    Serial.print(detected);
    Serial.print("  Distance: ");
    Serial.println(dist, 4);
}
