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
    void turnLeft90();
    void turnRight90();
    void stop();
private:
    int _in1Pin;
    int _in2Pin;
    int _in3Pin;
    int _in4Pin;
};


#endif // MOTOR_H