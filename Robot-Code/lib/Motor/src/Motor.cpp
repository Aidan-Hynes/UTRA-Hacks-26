#include <Arduino.h>
#include "Motor.h"

Motor::Motor(int in1Pin, int in2Pin, int in3Pin, int in4Pin)
    : _in1Pin(in1Pin), _in2Pin(in2Pin), _in3Pin(in3Pin), _in4Pin(in4Pin)
{
    pinMode(_in1Pin, OUTPUT);
    pinMode(_in2Pin, OUTPUT);
    pinMode(_in3Pin, OUTPUT);
    pinMode(_in4Pin, OUTPUT);
}

void Motor::move_motor1(bool forward, int speed) {
    if (forward) {
        analogWrite(_in1Pin, speed);
        analogWrite(_in2Pin, LOW);
    } else {
        analogWrite(_in1Pin, LOW);
        analogWrite(_in2Pin, speed);
    }
}

void Motor::stop_motor1() {
    analogWrite(_in1Pin, LOW);
    analogWrite(_in2Pin, LOW);
}

void Motor::move_motor2(bool forward, int speed) {
    if (forward) {
        analogWrite(_in3Pin, speed);
        analogWrite(_in4Pin, LOW);
    } else {
        analogWrite(_in3Pin, LOW);
        analogWrite(_in4Pin, speed);
    }
}

void Motor::stop_motor2() {
    analogWrite(_in3Pin, LOW);
    analogWrite(_in4Pin, LOW);
}

void Motor::drive(bool forward, int speed) {
    move_motor1(forward, speed);
    move_motor2(forward, speed);
}

void Motor::stop() {
    stop_motor1();
    stop_motor2();
}