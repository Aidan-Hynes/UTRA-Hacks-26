#include <Arduino.h>
#include "Motor.h"
#include "ColourSensing.h"
#include "SRF05.h"
#include "Servo.h"

// Pin Definitions
const int forkServoPin = 3;

const int forkServoMin = 140;
const int forkServoMax = 180;
// const int ultrasonicServoPin = 11;

const int ultrasonicTriggerPin = 7;
const int ultrasonicEchoPin = 8;

const int s0 = A0;
const int s1 = A1;
const int s2 = A2;
const int s3 = A3;
const int ColourOutPin = A4;

const int motor1Pin1 = 5;
const int motor1Pin2 = 6;

const int motor2Pin1 = 9;
const int motor2Pin2 = 10;


typedef enum {
    START_PHASE,
    OBSTACLE_COURSE,
    OBSTACLE_COURSE_W_BOX,
    GOING_AROUND_OBSTACLE,
    DROPPING_OFF_BOX,
    TARGET_COURSE,
    PICKING_UP_BOX
} state;

static ColourSensing colourSensor(s0, s1, s2, s3, ColourOutPin);
static Motor motors(motor1Pin1, motor1Pin2, motor2Pin1, motor2Pin2);
static SRF05 ultra(ultrasonicTriggerPin, ultrasonicEchoPin);
static state currState;
static Servo forkServo;


ColourSensing::rgb getAverageColour(int samples) {
    ColourSensing::rgb totalColor = {0, 0, 0};
    for (int i = 0; i < samples; i++) {
        ColourSensing::rgb color;
        colourSensor.readSensor(color);
        totalColor.r += color.r;
        totalColor.g += color.g;
        totalColor.b += color.b;
        delay(50); // Small delay between readings
    }
    ColourSensing::rgb averageColor;
    averageColor.r = totalColor.r / samples;
    averageColor.g = totalColor.g / samples;
    averageColor.b = totalColor.b / samples;
    return averageColor;
}

int getAverageDistance(int samples) {
    int totalDistance = 0;
    for (int i = 0; i < samples; i++) {
        totalDistance += ultra.getMillimeter();
        delay(20); // Small delay between readings
    }
    return totalDistance / samples;
}

void pickUpBox() {
    // Lower fork
    // Move forward
    // Raise fork
}

void goAroundObstacle() {
    motors.turnRight90();
    delay(500);
    motors.drive(false, 255);
    delay(4000); // Move forward for 2 seconds
    motors.stop();
    delay(500);
    motors.turnLeft90();
    delay(500);
    motors.drive(false, 255);
    delay(8000); // Move forward for 2 seconds
    motors.stop();
    delay(500);
    motors.turnLeft90();
    delay(500);
    motors.drive(false, 255);
    delay(4000); // Move forward for 2 seconds
    motors.stop();
    delay(500);
    motors.turnRight90();
    delay(500);
}

void raiseFork() {
    forkServo.write(constrain(forkServoMax, forkServoMin, forkServoMax));
}
void lowerFork() {
    forkServo.write(constrain(forkServoMin, forkServoMin, forkServoMax));
}

void pickUpObstacleBox() {
    motors.turnRight90();
    lowerFork();
    motors.drive(false, 100);
    delay(2000);
    motors.stop();
    raiseFork();
    delay(500);
    motors.drive(true, 100);
    delay(2000);
    motors.stop();
    motors.turnLeft90();
    motors.drive(false, 255);
    delay(500);
}

void dropObstacleBox() {
    motors.turnRight90();
    motors.drive(false, 100);
    delay(2000);
    motors.stop();
    lowerFork();
    delay(1000);
    motors.drive(true, 100);
    delay(2000);
    motors.stop();
    motors.turnLeft90();
}

void setup() {
    Serial.begin(9600);
    unsigned long startTime = millis();
    while (!Serial && (millis() - startTime < 3000)) {}
    Serial.println("Robot Initialized");
    colourSensor.auto_calibrate(10000); // Calibrate for 10 seconds
    currState = START_PHASE;
    forkServo.write(forkServoMin);
    forkServo.attach(forkServoPin, 500, 2500);
    lowerFork();
}

void loop() {
    ColourSensing::rgb colour;
    colour = getAverageColour(5);
    float dist;

    switch (currState)
    {
    case START_PHASE:
        motors.drive(false, 255);
        delay(3000); // Move forward for 3 seconds
        currState = OBSTACLE_COURSE;
        break;
    case OBSTACLE_COURSE:
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_BLUE) {
            Serial.println("Box detected!");
            currState = PICKING_UP_BOX;
            motors.stop();
            pickUpObstacleBox();
            currState = OBSTACLE_COURSE_W_BOX;
            break;
        }
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_GREEN) {
            Serial.println("Target zone detected!");
            currState = TARGET_COURSE;
            motors.stop();
            // Additional target course logic here
            break;
        }
        if (getAverageDistance(10) < 200) {
            currState = GOING_AROUND_OBSTACLE;
            goAroundObstacle();
            currState = OBSTACLE_COURSE;
            break;
        }
        break;
    case OBSTACLE_COURSE_W_BOX:
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_BLUE) {
            Serial.println("Box drop-off detected!");
            currState = DROPPING_OFF_BOX;
            motors.stop();
            dropObstacleBox();
            currState = OBSTACLE_COURSE;
            break;
        }
        if (getAverageDistance(10) < 200) {
            currState = GOING_AROUND_OBSTACLE;
            goAroundObstacle();
            currState = OBSTACLE_COURSE_W_BOX;
            break;
        }
        break;
    default:
        break;
    };
}