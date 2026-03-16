# Quick Task 006: Summary

## Task
Fix "Required force exceeds peak force" warning displaying unrealistically high force values.

## Change
- **File:** `src/pages/Calculator.jsx` line 469
- **Before:** `(physicsParams.motorMass + physicsParams.payloadMass) * params.maxAccelMS2 / 1000`
- **After:** `(parseFloat(physicsParams.motorMass) + parseFloat(physicsParams.payloadMass)) * parseFloat(params.maxAccelMS2) / 1000`

## Root Cause
String concatenation bug — input `onChange` handlers store values as strings (from `e.target.value`), only converting to numbers `onBlur`. The `+` operator on a number + string performs concatenation (`600 + "400"` → `"600400"`) instead of addition (`1000`), inflating the force by orders of magnitude.

## Result
Warning now displays realistic force values (e.g., "120N > 100N" rather than "66693.3N > 100N").
