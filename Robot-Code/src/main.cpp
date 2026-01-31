#include <Arduino.h>
#include <Motor.h>

// Definitions Arduino pins connected to input H Bridge
int IN1 = 4;
int IN2 = 5;
int IN3 = 6;
int IN4 = 7;
int speed = 255; // Speed value between 0 and 255

Motor motor(IN1, IN2, IN3, IN4); // Create motor object

void setup()
{
    Serial.begin(9600);
    Serial.println("[TCS230 Simple BLOCKING Example]");
    
    FreqCount.begin(1000);
    
    colourSensor.begin();
    colourSensor.setEnable(true);
    colourSensor.setFilter(TCS230_RGB_X);
    colourSensor.setFrequency(TCS230_FREQ_HI);
    colourSensor.setSampling(10);
}

void loop()
{
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
}