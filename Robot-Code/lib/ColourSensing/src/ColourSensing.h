#ifndef COLOURSENSING_H
#define COLOURSENSING_H

class ColourSensing {
public:
    enum DetectedColour {
        COLOUR_WHITE,
        COLOUR_GRAY,
        COLOUR_BLACK,
        COLOUR_RED,
        COLOUR_GREEN,
        COLOUR_BLUE,
        COLOUR_YELLOW,
        COLOUR_CYAN,
        COLOUR_MAGENTA,
        COLOUR_UNKNOWN
    };
    struct rgb {
        int r;
        int g;
        int b;
    };
    struct ColourRef{
        DetectedColour colour;
        float r;
        float g;
        float b;
    };
    ColourSensing(int s0Pin, int s1Pin, int s2Pin, int s3Pin, int outPin);
    void auto_calibrate(unsigned long durationMs);
    void readSensor(rgb &colour);
    DetectedColour getClosestColour(const rgb &colour, float &distance);
private:
    int s0Pin;
    int s1Pin;
    int s2Pin;
    int s3Pin;
    int outPin;
    int redValue;
    int greenValue;
    int blueValue;
    unsigned long redMin;
    unsigned long redMax;
    unsigned long greenMin;
    unsigned long greenMax;
    unsigned long blueMin;
    unsigned long blueMax;
    int redPercent;
    int greenPercent;
    int bluePercent;
};

#endif // COLOURSENSING_H