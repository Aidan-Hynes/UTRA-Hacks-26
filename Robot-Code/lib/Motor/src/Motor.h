#ifndef MOTOR_H
#define MOTOR_H

class Motor {
public:
    Motor(int in1Pin, int in2Pin, int in3Pin, int in4Pin);
    void move_motor1(bool forward, int speed);
    void stop_motor1();
    void move_motor2(bool forward, int speed);
    void stop_motor2();
    void drive(bool forward, int speed);
    void stop();
};


#endif // MOTOR_H