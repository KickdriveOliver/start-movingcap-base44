# Quick Task 006: Fix force warning displaying unrealistically high value

## Problem
The "Required force exceeds peak force" warning in the Calculator shows an absurdly inflated force value (e.g., "66693.3N > 100N") instead of a realistic value close to the peak force.

## Root Cause
In `src/pages/Calculator.jsx` line 469, the force calculation uses the `+` operator on `physicsParams.motorMass` and `physicsParams.payloadMass`. During typing (before input blur), these values are **strings** (set via `onChange` as `e.target.value`). JavaScript's `+` operator performs string concatenation on strings, so `600 + "400"` becomes `"600400"` instead of `1000`, inflating the calculated force by orders of magnitude.

The continuous duty check on line 486 already correctly uses `parseFloat()`, but the peak force check did not.

## Fix
Wrap both mass values (and accel for safety) in `parseFloat()` in the force calculation formula, consistent with the pattern used elsewhere in the same function.
