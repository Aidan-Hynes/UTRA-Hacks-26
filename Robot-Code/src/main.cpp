#include <Arduino.h>
#include "Motor.h"
#include "colour_sensing.h"

// Definitions Arduino pins connected to input H Bridge
int IN1 = 9;
int IN2 = 10;
int IN3 = 5;
int IN4 = 6;
int speed = 255; // Speed value between 0 and 255

Motor motor(IN1, IN2, IN3, IN4); // Create motor object

void setup()
{
    Serial.begin(9600);
}

void loop()
{
    ColourSensing colourSensor(4, 5, 6, 7, 8); // Example pin assignments

    String readString = "";
  // Check if any data is available to read from the serial port
    while (Serial.available()) {
        // Read characters into a String until the buffer is empty
        char c = Serial.read();
        readString += c;
        delay(2); // Small delay to allow the buffer to fill
    }
    if (readString.length() == 0) {
        return; // No data read
    }
    Serial.println("Received: " + readString);
    if (readString == "S") {
        motor.stop(); // Stop the motor
    }
    else if (readString == "F") {
        // Move Forward
       motor.drive(true, speed);
    }
    else if (readString == "B") {
        // Move Backward
        motor.drive(false, speed);
    }
    else if ((readString != String(speed)) && (readString.toInt() >= 0) && (readString.toInt() <= 255)) {
        // Update speed value
        speed = readString.toInt();


    }

    delay(100); // Small delay before next loop iteration
}