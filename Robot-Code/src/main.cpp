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
    TARGET_COURSE,
    TARGET_RAMP,
    TARGET_TRAVERSE,
    TARGET_FIND_BLACK,
    TARGET_LEAVE,
    TARGET_END,
    OBSTACLE_COURSE,
    OBSTACLE_COURSE_W_BOX,
    GOING_AROUND_OBSTACLE,
    PICKING_UP_BOX,
    DROPPING_OFF_BOX,
} state;

static ColourSensing colourSensor(s0, s1, s2, s3, ColourOutPin);
static Motor motors(motor1Pin1, motor1Pin2, motor2Pin1, motor2Pin2);
static SRF05 ultra(ultrasonicTriggerPin, ultrasonicEchoPin);
static state currState;
static Servo forkServo;

extern void linefollow(Motor* motor, ColourSensing* colourSensor, ColourSensing::DetectedColour lineColour, bool rightSide, float gain);


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

void pickUpTargetBox() {
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
    motors.turnLeft90();
    motors.drive(false, 100);
    delay(1000);
    motors.stop();
    lowerFork();
    delay(500);
    motors.drive(true, 100);
    delay(1000);
    motors.stop();
    motors.turnRight90();
    motors.drive(false, 255);
    delay(500);
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
        linefollow(&motors, &colourSensor, ColourSensing::COLOUR_BLACK, true, 1.0f);
        if(colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_GREEN) {
            Serial.println("Branch detected, starting ramp/target course!");
            motors.stop();
            delay(500);
            currState = TARGET_COURSE;
        }
        break;
    case TARGET_COURSE:
        linefollow(&motors, &colourSensor, ColourSensing::COLOUR_GREEN, true, 1.0f);
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_BLUE) {
            Serial.println("Target box detected!");
            motors.stop();
            pickUpTargetBox();
            break;
        }
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_BLACK) {
            Serial.println("Ramp detected, moving up!");
            motors.stop();
            delay(500);
            currState = TARGET_RAMP;
            break;
        }
        break;
    case TARGET_RAMP:
        linefollow(&motors, &colourSensor, ColourSensing::COLOUR_BLACK, true, 1.0f);
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_BLUE) {
            Serial.println("Ramp ended, stopping!");
            motors.stop();
            delay(500);
            currState = TARGET_TRAVERSE;
            break;
        }
        break;
    case TARGET_TRAVERSE:
        motors.drive(false, 100);
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_RED) {
            motors.stop();
            delay(500);
            motors.turnLeft90();
            ColourSensing::rgb left_colour = getAverageColour(5);
            motors.turnRight90();
            motors.turnRight90();
            ColourSensing::rgb right_colour = getAverageColour(5);
            
            if (colourSensor.getClosestColour(left_colour, dist) == ColourSensing::COLOUR_RED
            && colourSensor.getClosestColour(right_colour, dist) == ColourSensing::COLOUR_GREEN) {
                motors.drive(false, 100);
                currState = TARGET_FIND_BLACK;
            } else if (colourSensor.getClosestColour(left_colour, dist) == ColourSensing::COLOUR_RED
            && colourSensor.getClosestColour(right_colour, dist) == ColourSensing::COLOUR_BLACK) {
                motors.drive(false, 100);
                currState = TARGET_FIND_BLACK;
            } else if (colourSensor.getClosestColour(left_colour, dist) == ColourSensing::COLOUR_GREEN
            && colourSensor.getClosestColour(right_colour, dist) == ColourSensing::COLOUR_RED) {
                motors.turnLeft90();
                motors.turnLeft90();
                motors.drive(false, 100);
                currState = TARGET_FIND_BLACK;
            } else if (colourSensor.getClosestColour(left_colour, dist) == ColourSensing::COLOUR_BLACK
            && colourSensor.getClosestColour(right_colour, dist) == ColourSensing::COLOUR_RED) {
                motors.turnLeft90();
                motors.turnLeft90();
                motors.drive(false, 100);
                currState = TARGET_FIND_BLACK;
            }
            else {
                motors.drive(false, 100);
            }
            currState = OBSTACLE_COURSE;
        }
        break;
    case TARGET_FIND_BLACK:
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_BLACK) {
            motors.stop();
        }
        break;
    case TARGET_LEAVE:
        linefollow(&motors, &colourSensor, ColourSensing::COLOUR_BLACK, true, 1.0f);
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_GREEN) {
            Serial.println("Leaving target area, heading to obstacle course!");
            currState = TARGET_END;
        }
        break;
    case TARGET_END:
        linefollow(&motors, &colourSensor, ColourSensing::COLOUR_GREEN, true, 1.0f);
        if (colourSensor.getClosestColour(colour, dist) == ColourSensing::COLOUR_RED) {
            Serial.println("Rejoined main course, heading to obstacle course!");
            motors.stop();
            delay(500);
            currState = OBSTACLE_COURSE;
        }
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