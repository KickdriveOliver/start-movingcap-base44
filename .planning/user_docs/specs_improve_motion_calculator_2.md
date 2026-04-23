# Improve motion calculator

## Improve "continous cycle operation" calculation

- add a new constant: 
  `duty_cycle_ED` : the maximum amount of time in percent (%) which motor can be operated with nominal force in a duty cycle of 10 minutes ("ED", Einschaltdauer), according to IEC / EN 60034.

- to calculate the "Continuous duty" percentage value, update the existing calculation to consider this "ED" value: 

1) As already implemented: Calculate the integral of "(max(abs(acceleration/deceleration forces), loss_force_n))^2" over the movement time (not the processing pauses!).

2) Calculate the integral of (nom_force_n)^2 over the full one-way tim. (Or rather, determine the simple product of sqr(nom_force_n)^2 * one-way time). Then multiply with the percentage according to `duty_cycle_ED`, e.g. 0.6 for duty_cycle_ED = 60 (%).

3) calculate the percentage value of 1) in relation to 2), as in the existing implementation. 

## Review and test

make sure all new additionals are consistently available in all four languages and work as intended
