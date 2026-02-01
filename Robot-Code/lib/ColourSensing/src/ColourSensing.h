#ifndef COLOURSENSING_H
#define COLOURSENSING_H

class ColourSensing {
public:
    ColourSensing(int s0Pin, int s1Pin, int s2Pin, int s3Pin, int outPin);
    void auto_calibrate(unsigned long durationMs);
    void readSensor(int *r, int *g, int *b);
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