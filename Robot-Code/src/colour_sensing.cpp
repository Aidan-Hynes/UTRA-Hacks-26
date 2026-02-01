#include <Arduino.h>
#include <MD_TCS230.h>
#include <FreqCount.h>

// Pin definitions
#define S0 4
#define S1 8
#define S2 6
#define S3 7
#define OE 3
#define TCS_OUT 5

MD_TCS230 colourSensor(S2, S3, S0, S1, OE);
sensorData rawData;

void readSensor(){
    
    colourSensor.read();
    unsigned long start = millis();
    
    // Debug: Poll status and wait
    uint16_t loopCount = 0;
    while (!colourSensor.available() && (millis() - start) < 1200) {
        loopCount++;
    }
    
    unsigned long elapsed = millis() - start;
    Serial.print("Elapsed: ");
    Serial.print(elapsed);
    Serial.print("ms, loops: ");
    Serial.print(loopCount);
    Serial.print(", available: ");
    Serial.println(colourSensor.available());
    
    // Debug: Check FreqCount after read attempt

    
    colourSensor.getRaw(&rawData);
    uint32_t r = rawData.value[0];
    uint32_t g = rawData.value[1];
    uint32_t b = rawData.value[2];

    // Print raw sensor values
    Serial.print("Raw: R=");
    Serial.print(r);
    Serial.print(", G=");
    Serial.print(g);
    Serial.print(", B=");
    Serial.print(b);
    Serial.print(" | ");

    // Calculate average and threshold
    
    // Determine color
    if (r < 20000 && g < 20000 && b < 20000) {
        Serial.println("black");
    } else if (r > 100000 && g > 100000 && b > 100000) {
        Serial.println("white");
    } else if (r > g && r > b) {
        Serial.println("red");
    } else if (g > r && g > b) {
        Serial.println("green");
    } else if (b > r && b > g) {
        Serial.println("blue");
    } else {
        Serial.println("unknown");
    }
}
