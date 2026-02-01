class Following {
public:
    Following(float KP, float KI, float KD);
    float KP = 1.0f; // Proportional gain
    float KI = 0.0f; // Integral gain
    float KD = 0.0f; // Derivative gain
    struct PIDState{
        float setpoint;
        float integral;
        float prev_error;
    };
    float update_pid(PIDState *pid, float current_distance, float dt) {
        // 1. Calculate Error
        float error = pid->setpoint - current_distance;

        // 2. Proportional term
        float p_out = KP * error;

        // 3. Integral term
        pid->integral += error * dt;
        float i_out = KI * pid->integral;

        // 4. Derivative term
        float derivative = (error - pid->prev_error) / dt;
        float d_out = KD * derivative;

        // 5. Calculate Total Output
        float output = p_out + i_out + d_out;

        // Save error for next loop
        pid->prev_error = error;

        return output;
    }
};