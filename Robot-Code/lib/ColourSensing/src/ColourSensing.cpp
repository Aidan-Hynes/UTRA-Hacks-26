#include <Arduino.h>
#include <limits.h>
#include "ColourSensing.h"


static const ColourSensing::ColourRef colourRefs[] = {
    {ColourSensing::COLOUR_WHITE, 0.34f, 0.33f, 0.33f },
    {ColourSensing::COLOUR_GRAY, 0.34f, 0.33f, 0.33f },
    {ColourSensing::COLOUR_BLACK, 0.34f, 0.33f, 0.33f },
    {ColourSensing::COLOUR_RED,     0.40f, 0.30f, 0.30f},
    {ColourSensing::COLOUR_GREEN,   0.30f, 0.40f, 0.30f},
    {ColourSensing::COLOUR_BLUE,    0.30f, 0.30f, 0.40f},
    {ColourSensing::COLOUR_YELLOW,  0.45f, 0.45f, 0.10f},
    {ColourSensing::COLOUR_CYAN,    0.15f, 0.45f, 0.45f},
    {ColourSensing::COLOUR_MAGENTA, 0.45f, 0.15f, 0.45f}
};

static const int NUM_COLOURS =
    sizeof(colourRefs) / sizeof(colourRefs[0]);
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

static float colorDistance(float r1, float g1, float b1, float r2, float g2, float b2) {
    return sqrt(
    sq(r1 - r2) +
    sq(g1 - g2) +
    sq(b1 - b2)
    );
}

ColourSensing::DetectedColour ColourSensing::getClosestColour(const rgb &colour, float &distance) {
    int sum = colour.r + colour.g + colour.b;

    // ---- Brightness gating (objective) ----
    if (sum < 10) {
        distance = 0.0f;
        return COLOUR_BLACK;
    }

    if (sum < 40) {
        distance = 0.0f;
        return COLOUR_GRAY;
    }

    // ---- Normalize RGB ----
    float rn = (float)colour.r / sum;
    float gn = (float)colour.g / sum;
    float bn = (float)colour.b / sum;
    Serial.print("Normalized RGB: ");
    Serial.print(rn, 4); Serial.print(", ");
    Serial.print(gn, 4); Serial.print(", ");
    Serial.println(bn, 4);
    float minDist = 999.0f;
    DetectedColour best = COLOUR_UNKNOWN;

    // ---- Distance-based classification ----
    for (int i = 0; i < NUM_COLOURS; i++) {
        float d = sqrt(
            sq(rn - colourRefs[i].r) +
            sq(gn - colourRefs[i].g) +
            sq(bn - colourRefs[i].b)
        );

        if (d < minDist) {
            minDist = d;
            best = colourRefs[i].colour;
        }
    }

    distance = minDist;

    // ---- Confidence gate ----
    if (minDist > 0.35f)
        return COLOUR_UNKNOWN;

    return best;
}
