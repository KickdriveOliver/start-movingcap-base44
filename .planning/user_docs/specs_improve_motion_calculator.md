# Improve motion calculator

## new "process time" parameter

in the "3. S-Curve Motion Parameters", add an additional input for "process time", or something, which should represent the overall extra overhead to start a movement (e.g. TCP/IP communication times, EtherCAT communication times, internal motor processing times.). Use a default of 10ms and limit to a minimum of 5 milliseconds. Choose the best label/description for such an input me at your discretion. 

- In the motion analysis results time values (e.g. "Motion Analysis
One-way: 0.160 s Cycle: 0.320 s"), present three values instead of two: 
1) Movement time (formerly "One-way". Same result)
2) One-way: Movement time + our new "process time" setting 
3) Cycle: 2x "One-way" time

- add extra asterix / explanations at your discretion

# New continous cycle operation 

We already display a configuration information like "Force usage: 60%", which checks if the maximum acceleration/force chosen is within the peak force capabilities of that motor. 

- Rename this existing info to "Peak force usage" and introduce a second simular measure that represents how much we are using the nominal/continuous power delivery of the motor (which is mainly limited by heat/overheating) over the full "One way" cycle that includes process time. Here is how to determine this value: 
- calculate the average force required over the full one-way time
- compare with nominal force and determine a percentage value 

a value of 100% would mean we use 100% of the nominal continuous operation cycle (at nominal operation temperature), and any increase would lead to overtemperature switchoff, or require additional measures like cooling. 

# Review and test

make sure all new additionals are consistently available in all four languages and work as intended
