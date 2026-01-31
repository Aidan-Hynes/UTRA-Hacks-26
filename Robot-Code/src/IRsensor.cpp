#include <Arduino.h>

void setup()
{
  Serial.begin(9600);
}

void loop()
{
  int sensorValue = analogRead(A2);
  // Convert analog reading to voltage
  float voltage = sensorValue * (5.0 / 1024.0);

  // The lower the voltage, the darker it is
  if (voltage >= 4.0)
  {
    Serial.print("it is light - ");
  }
  else if (voltage >= 2.0)
  {
    Serial.print("it is bright - ");
  }
  else
  {
    Serial.print("it is dark - ");
  }

  Serial.println(voltage);
}