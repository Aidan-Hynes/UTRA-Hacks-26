#include <Arduino.h>

class Motor {
private:
    int Motor1In1;
    int Motor1In2;

    int Motor2In1;
    int Motor2In2;
public:
    Motor(int in1Pin, int in2Pin, int in3Pin, int in4Pin){
        Motor1In1 = in1Pin;
        Motor1In2 = in2Pin;
        Motor2In1 = in3Pin;
        Motor2In2 = in4Pin;

        pinMode(Motor1In1, OUTPUT);
        pinMode(Motor1In2, OUTPUT);
        pinMode(Motor2In1, OUTPUT);
        pinMode(Motor2In2, OUTPUT);
    }

    void move_motor1(bool forward, int speed){
        if (forward) {
            analogWrite(Motor1In1, speed);
            analogWrite(Motor1In2, LOW);
        } else {
            analogWrite(Motor1In1, LOW);
            analogWrite(Motor1In2, speed);
        }
    }

    void stop_motor1(){
        analogWrite(Motor1In1, LOW);
        analogWrite(Motor1In2, LOW);
    }

    void move_motor2(bool forward, int speed){
        if (forward) {
            analogWrite(Motor2In1, speed);
            analogWrite(Motor2In2, LOW);
        } else {
            analogWrite(Motor2In1, LOW);
            analogWrite(Motor2In2, speed);
        }
    }

    void stop_motor2(){
        analogWrite(Motor2In1, LOW);
        analogWrite(Motor2In2, LOW);
    }


    void drive(bool forward, int speed){
        move_motor1(forward, speed);
        move_motor2(forward, speed);
    }

    void stop(){
        stop_motor1();
        stop_motor2();
    }
};