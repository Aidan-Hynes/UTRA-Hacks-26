#ifndef COLOUR_SENSING_H
#define COLOUR_SENSING_H

#include <Arduino.h>
#include <MD_TCS230.h>
#include <FreqCount.h>

class ColourSensing {
public:
	ColourSensing(int S0, int S1, int S2, int S3, int OUT);
	void begin();
	// Reads the sensor, prints debug info to Serial and returns detected color name
	String readSensor();

private:
	MD_TCS230 sensor;
	sensorData rawData;
	int _S0, _S1, _S2, _S3, _OUT;
};

#endif // COLOUR_SENSING_H