import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCalculatorProducts } from "@/components/data/products";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator as CalcIcon, 
  MoveHorizontal, 
  Weight,
  PackagePlus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  RotateCcw,
  Unlock,
  Lock,
  Minus,
  Plus,
  Info
} from "lucide-react";
import { useTranslations } from "@/components/useTranslations";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// --- Core S-Curve Trajectory Calculation Logic ---
// Copyright 2025 Kickdrive Software Solutions / Fullmo Drives GmbH
const calculateTrajectoryParameters = ({ distance, maxVelocity, maxAcceleration, maxJerk }) => {
  if (distance <= 0 || maxVelocity <= 0 || maxAcceleration <= 0) {
    let finalParams = {
    success: false
    };
    return finalParams;
  }
  const jerkTrapezoidal = 2100000000 * 1000.0;
  if (maxJerk <= 0) maxJerk = jerkTrapezoidal;
  
  const cMaxAcceleration = maxAcceleration;
  
  let finalMaxVelocity = maxVelocity;
  // --- Case 1: jerk-limited only (never reaches max acceleration) ---
  const dThreshold = (2 * Math.pow(maxAcceleration, 3)) / Math.pow(maxJerk, 2);
  if (distance <= dThreshold) {
    // v_max = (j * d^2 / 4)^(1/3)
    finalMaxVelocity = Math.pow((maxJerk * Math.pow(distance, 2)) / 4.0, 1.0 / 3.0);
  } else {
    // --- Case 2: reaches max acceleration, no cruise ---
    // Solve quadratic for plateau time t_a
    const A = maxAcceleration;
    const B = (maxAcceleration * maxAcceleration) / maxJerk;
    const C = (2 * Math.pow(maxAcceleration, 3)) / Math.pow(maxJerk, 2) - distance;

    const discriminant = Math.pow(B, 2) - 4 * A * C;
    let t_a = 0;
    if (discriminant >= 0) {
      t_a = (-B + Math.sqrt(discriminant)) / (2 * A);
      finalMaxVelocity = maxAcceleration * t_a + (maxAcceleration * maxAcceleration) / maxJerk;
    }
  }

  // Clamp by external velocity limit if provided
  const isVelocityLimited = finalMaxVelocity < maxVelocity;
  if (!isVelocityLimited) {
    finalMaxVelocity = maxVelocity;
  }

  
  let finalJerkValue = (maxAcceleration * maxAcceleration) / finalMaxVelocity;
  const isJerkMinLimited = (maxJerk < finalJerkValue);
  if (!isJerkMinLimited) finalJerkValue = maxJerk;
  const isTrapezoidal = (finalJerkValue >= jerkTrapezoidal);
  const tJer = (isTrapezoidal ? 0: cMaxAcceleration / finalJerkValue);

  // duration of constant acceleration while jerk=0 (acceleration = cMaxAcceleration)
  let vDiffC = finalMaxVelocity;
  if (!isTrapezoidal) {
    vDiffC -= (maxAcceleration * maxAcceleration) / finalJerkValue;
    vDiffC = Math.min(0, vDiffC);
  }
  let tAccC = vDiffC / cMaxAcceleration;


  // put the whole acceleration together
  const tVmaxReached = tAccC + 2 * tJer; 
  // same-time trapezoidal equivalent with constant acceleration <= cMaxAcceleration
  const cAverageAcceleration = finalMaxVelocity / tVmaxReached;
  const pVmaxReached = 0.5 * (finalMaxVelocity * finalMaxVelocity) / cAverageAcceleration;

  // duration of the constant velocity part 
  const tVelConstant = (distance - 2 * pVmaxReached) / finalMaxVelocity;

  // total run 
  const tTrajectory = 2 * tVmaxReached + tVelConstant;

  let finalParams = {
    tJer: tJer,
    tAccC: tAccC,
    tVmaxReached: tVmaxReached,
    tVelConstant: tVelConstant, 
    tTrajectory: tTrajectory,
    finalMaxVelocity: finalMaxVelocity,
    finalMaxAcceleration: cMaxAcceleration,
    finalJerkValue: finalJerkValue,
    averageAcceleration: cAverageAcceleration,
    distance: distance,
    success: true,
    isVelocityLimited: isVelocityLimited,
    isJerkMinLimited: isJerkMinLimited,
    isTrapezoidal: isTrapezoidal
  };

  return finalParams;
};


const getPointInTrajectory = (t, params) => {
  const { tJer, tAccC, tVmaxReached, tVelConstant, tTrajectory, finalMaxVelocity, finalMaxAcceleration, finalJerkValue, averageAcceleration, distance, 
      success, isVelocityLimited, isJerkMinLimited, isTrapezoidal} = params;

  // Define phase transition times
  const t1 = tJer;
  const t2 = tJer + tAccC;
  const t3 = tVmaxReached;
  const t4 = tVmaxReached + tVelConstant;
  const t5 = tTrajectory - tJer - tAccC;
  const t6 = tTrajectory - tJer;
  const t7 = tTrajectory;

  let position = 0, velocity = 0, acceleration = 0, jerk = 0, phase = '';

  // Pre-calculate end-of-phase values for easier calculation
  let a1 = finalMaxAcceleration;
  let v1 = 0; 
  let p1 = 0;
  if (t1 > 0) {
    v1 = 0.5 * finalJerkValue * t1 * t1;
    p1 = (1/6) * finalJerkValue * t1 * t1 * t1;
  }

  const v2 = v1 + a1 * tAccC;
  const p2 = p1 + v1 * tAccC + 0.5 * a1 * tAccC * tAccC;

  const v3 = finalMaxVelocity;
  const p3 = 0.5 * (finalMaxVelocity * finalMaxVelocity) / averageAcceleration;

  const p4 = p3 + v3 * tVelConstant;

  const a5 = -finalMaxAcceleration;
  let v5 = v3;
  let p5 = p4; 
  if (tJer > 0) {
    v5 = v3 - 0.5 * finalJerkValue * tJer * tJer;
    p5 = p4 + v3 * tJer - (1/6) * finalJerkValue * tJer * tJer * tJer;
  }
  const v6 = v5 + a5 * tAccC;
  const p6 = p5 + v5 * tAccC + 0.5 * a5 * tAccC * tAccC;

  if (t >= 0 && t < t1) { // Phase 1: Accel Jerk Up
    phase = 'Accel Jerk Up';
    jerk = finalJerkValue;
    acceleration = jerk * t;
    if (acceleration > finalMaxAcceleration) acceleration = finalMaxAcceleration;
    velocity = 0.5 * jerk * t * t;
    position = (1/6) * jerk * t * t * t;
  } else if (t >= t1 && t < t2) { // Phase 2: Constant Accel
    phase = 'Constant Accel';
    jerk = 0;
    acceleration = finalMaxAcceleration;
    const dt = t - t1;
    velocity = v1 + acceleration * dt;
    position = p1 + v1 * dt + 0.5 * acceleration * dt * dt;
  } else if (t >= t2 && t < t3) { // Phase 3: Accel Jerk Down
    phase = 'Accel Jerk Down';
    jerk = -finalJerkValue;
    const dt = t - t2;
    acceleration = finalMaxAcceleration + jerk * dt;
    if (acceleration < 0) acceleration = 0;
    velocity = v2 + finalMaxAcceleration * dt + 0.5 * jerk * dt * dt;
    position = p2 + v2 * dt + 0.5 * finalMaxAcceleration * dt * dt + (1/6) * jerk * dt * dt * dt;
  } else if (t >= t3 && t < t4) { // Phase 4: Constant Velocity
    phase = 'Constant Velocity';
    jerk = 0;
    acceleration = 0;
    velocity = finalMaxVelocity;
    const dt = t - t3;
    position = p3 + velocity * dt;
  } else if (t >= t4 && t < t5) { // Phase 5: Decel Jerk Up
    phase = 'Decel Jerk Up';
    jerk = -finalJerkValue;
    const dt = t - t4;
    acceleration = jerk * dt;
    if (acceleration < -finalMaxAcceleration) acceleration = -finalMaxAcceleration;
    velocity = v3 + 0.5 * jerk * dt * dt;
    position = p4 + v3 * dt + (1/6) * jerk * dt * dt * dt;
  } else if (t >= t5 && t < t6) { // Phase 6: Constant Decel
    phase = 'Constant Decel';
    jerk = 0;
    acceleration = -finalMaxAcceleration;
    const dt = t - t5;
    velocity = v5 + acceleration * dt;
    position = p5 + v5 * dt + 0.5 * acceleration * dt * dt;
  } else if (t >= t6 && t <= t7) { // Phase 7: Decel Jerk Down
    phase = 'Decel Jerk Down';
    jerk = finalJerkValue;
    const dt = t - t6;
    acceleration = -finalMaxAcceleration + jerk * dt;
    if (acceleration > 0) acceleration = 0;
    velocity = v6 - finalMaxAcceleration * dt + 0.5 * jerk * dt * dt;
    position = p6 + v6 * dt - 0.5 * finalMaxAcceleration * dt * dt + (1/6) * jerk * dt * dt * dt;
    if (position > distance) position = distance;
  } else if (t > t7) { // End of trajectory
    phase = 'Arrived';
    jerk = 0;
    acceleration = 0;
    velocity = 0;
    position = distance;
  }

  if (velocity < 0) velocity = 0;

  return { position, velocity, acceleration, jerk, phase };
};


export default function Calculator() {
  const { t } = useTranslations();
  
  // --- State ---
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Parameters
  const [params, setParams] = useState({
    distanceMm: 100, 
    maxSpeedMmS: 1000,
    maxAccelMS2: 10,
    maxJerkMS3: 100,
  });
  
  const [physicsParams, setPhysicsParams] = useState({
    maxForce: 10, // N
    motorMass: 500, // g
    payloadMass: 0 // g
  });

  const [calculatedAccel, setCalculatedAccel] = useState(null);
  const [useCalculatedAccel, setUseCalculatedAccel] = useState(true);
  const [results, setResults] = useState(null);

  // --- Effects ---

  // 1. Load Products from static data
  useEffect(() => {
    const filtered = getCalculatorProducts();
    setAvailableProducts(filtered);
  }, []);

  // 2. Apply Product Specs when selected
  useEffect(() => {
    if (selectedProduct && selectedProduct.technical_specs) {
      const specs = selectedProduct.technical_specs;
      
      // Update Physics parameters (locked to product)
      setPhysicsParams(prev => ({
        ...prev,
        maxForce: specs.max_force_n || prev.maxForce,
        motorMass: specs.moving_mass_g || prev.motorMass
      }));

      // Smart adjust input parameters if they exceed product limits
      setParams(prev => {
        let newDistance = prev.distanceMm;
        let newSpeed = prev.maxSpeedMmS;

        // If current distance > product max stroke, clamp it
        if (specs.max_stroke_mm && prev.distanceMm > specs.max_stroke_mm) {
          newDistance = specs.max_stroke_mm;
        }
        
        // If current speed > product max speed, clamp it
        if (specs.max_speed_mm_s && prev.maxSpeedMmS > specs.max_speed_mm_s) {
          newSpeed = specs.max_speed_mm_s;
        }

        return {
          ...prev,
          distanceMm: newDistance,
          maxSpeedMmS: newSpeed
        };
      });
    }
  }, [selectedProduct]);

  // 3. Calculate Max Possible Acceleration (Physics)
  useEffect(() => {
    const maxForce = parseFloat(physicsParams.maxForce) || 0;
    const motorMass = parseFloat(physicsParams.motorMass) || 0;
    const payloadMass = parseFloat(physicsParams.payloadMass) || 0;
    const totalMassKg = (motorMass + payloadMass) / 1000;

    if (totalMassKg <= 0 || maxForce <= 0) {
      setCalculatedAccel({ maxAccelMicrometers: Infinity, maxAccelMeters: Infinity });
      return;
    }

    const maxAcceleration = maxForce / totalMassKg;
    const maxAccelMicrometers = maxAcceleration * 1000000;

    setCalculatedAccel({
      maxAccelMicrometers,
      maxAccelMeters: maxAcceleration
    });
  }, [physicsParams]);

  // 4. Auto-update Accel/Jerk if "Apply to profile" is checked
  useEffect(() => {
    if (useCalculatedAccel && calculatedAccel && isFinite(calculatedAccel.maxAccelMeters)) {
      const roundedAccelMS2 = Math.round(calculatedAccel.maxAccelMeters * 10) / 10;
      
      // Jerk = 100x Acceleration (in m/s³)
      const suggestedJerk = roundedAccelMS2 * 100;
      const roundedJerkMS3 = Math.round(suggestedJerk * 10) / 10; 
      
      setParams(prev => ({
        ...prev,
        maxAccelMS2: roundedAccelMS2,
        maxJerkMS3: roundedJerkMS3
      }));
    }
  }, [useCalculatedAccel, calculatedAccel]);

  // 5. Calculate Trajectory
  const internalParams = useMemo(() => ({
    distance: params.distanceMm * 1000,
    maxSpeed: params.maxSpeedMmS * 1000, 
    maxAccel: params.maxAccelMS2 * 1000000, 
    maxJerk: params.maxJerkMS3 * 1000000, 
  }), [params]);

  useEffect(() => {
    const traj = calculateTrajectoryParameters({
        distance: internalParams.distance,
        maxVelocity: internalParams.maxSpeed,
        maxAcceleration: internalParams.maxAccel,
        maxJerk: internalParams.maxJerk
    });

    if (traj && traj.success) {
      const data = [];
      const totalTime = traj.tTrajectory;
      const pointCount = 200; // Reduced for performance
      const dt = totalTime / (pointCount - 1); 

      if (totalTime === 0) {
        setResults({ data: [], totalTime: "0.000", maxVelocityReached: 0, maxAccelReached: 0, finalPosition: 0 });
        return;
      }

      for (let i = 0; i < pointCount; i++) {
        const time = i * dt;
        const point = getPointInTrajectory(time, traj);
        data.push({
          time: time,
          position: point.position,
          velocity: point.velocity,
          acceleration: point.acceleration
        });
      }
      // Ensure final point
      const finalPoint = getPointInTrajectory(totalTime, traj);
      data.push({
        time: totalTime,
        position: finalPoint.position,
        velocity: finalPoint.velocity,
        acceleration: finalPoint.acceleration
      });

      setResults({
        data,
        totalTime: totalTime.toFixed(3),
        maxVelocityReached: Math.max(...data.map(d => d.velocity)),
        maxAccelReached: Math.max(...data.map(d => Math.abs(d.acceleration))),
        finalPosition: finalPoint.position,
        // Trajectory adjustment flags
        isVelocityLimited: traj.isVelocityLimited,
        isJerkMinLimited: traj.isJerkMinLimited,
        isTrapezoidal: traj.isTrapezoidal,
        // Actual values used
        actualVelocity: traj.finalMaxVelocity / 1000, // convert to mm/s
        actualJerk: traj.finalJerkValue / 1000000, // convert to m/s³
        requestedVelocity: params.maxSpeedMmS,
        requestedJerk: params.maxJerkMS3
      });
    } else {
      setResults(null);
    }
  }, [internalParams]);

  // --- Helpers ---
  const clearSelection = () => {
    setSelectedProduct(null);
    // Reset to some defaults if needed, or keep current values
    setPhysicsParams(prev => ({ ...prev, maxForce: 10, motorMass: 500 }));
  };

  // Validation Checks
  const validations = useMemo(() => {
    if (!selectedProduct?.technical_specs) return [];
    const specs = selectedProduct.technical_specs;
    const checks = [];

    // Stroke Check
    if (params.distanceMm > specs.max_stroke_mm) {
      checks.push({ 
        type: 'error', 
        msg: `${t('calculator_stroke_exceeds')} (${params.distanceMm}mm > ${specs.max_stroke_mm}mm)`,
        param: 'distance' 
      });
    } else {
      checks.push({ type: 'success', msg: t('calculator_stroke_ok'), param: 'distance' });
    }

    // Speed Check
    if (params.maxSpeedMmS > specs.max_speed_mm_s) {
      checks.push({ 
        type: 'error', 
        msg: `${t('calculator_speed_exceeds')} (${params.maxSpeedMmS}mm/s > ${specs.max_speed_mm_s}mm/s)`,
        param: 'speed'
      });
    } else {
      checks.push({ type: 'success', msg: t('calculator_speed_ok'), param: 'speed' });
    }

    // Force/Accel Check
    // Note: The calculated accel is already derived from max force. 
    // If user manually inputs higher accel, we check it.
    const requiredForce = (physicsParams.motorMass + physicsParams.payloadMass) * params.maxAccelMS2 / 1000; // F=ma (mass in kg)
    // Allow small epsilon (0.1%) for float comparison to prevent false positives on equality
    if (requiredForce > specs.max_force_n * 1.001) {
      checks.push({ 
        type: 'error', 
        msg: `${t('calculator_force_exceeds')} (${requiredForce.toFixed(1)}N > ${specs.max_force_n}N)`,
        param: 'force'
      });
    } else {
      checks.push({ type: 'success', msg: `${t('calculator_force_usage')} ${Math.round(requiredForce/specs.max_force_n * 100)}%`, param: 'force' });
    }

    return checks;
  }, [selectedProduct, params, physicsParams]);

  const hasErrors = validations.some(v => v.type === 'error');

  // Check if trajectory was adjusted
  const hasTrajectoryAdjustments = results && (results.isVelocityLimited || results.isJerkMinLimited || results.isTrapezoidal);

  // Handle input blur on Enter/Done key press for mobile keyboards
  const handleInputBlur = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  };
  
  // Handle input focus - select all text for easier editing
  const handleInputFocus = (e) => {
    e.target.select();
  };

  // Increment/decrement by 10%
  const adjustValue = (currentVal, increase) => {
    const val = parseFloat(currentVal) || 0;
    const delta = Math.max(val * 0.1, 1); // At least 1 unit change
    const newVal = increase ? val + delta : Math.max(0, val - delta);
    return Math.round(newVal * 10) / 10;
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{t('calculator_page_title')}</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2">
            {t('calculator_page_subtitle')}
          </p>
        </div>

        {/* Step 1: Product Selection */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              1. {t('calculator_drive_selection')}
            </h2>
            {selectedProduct && (
               <Button variant="ghost" size="sm" onClick={clearSelection} className="text-gray-500 hover:text-red-500 hidden md:flex">
                 <RotateCcw className="w-4 h-4 mr-2" />
                 {t('calculator_unlock')}
               </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {availableProducts.map(product => {
              const isSelected = selectedProduct?.id === product.id;
              const specs = product.technical_specs || {};
              return (
                <motion.div
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className={`
                    relative cursor-pointer rounded-lg md:rounded-xl border-2 overflow-hidden transition-all bg-white shadow-sm
                    ${isSelected ? 'border-blue-600 ring-2 md:ring-4 ring-blue-50' : 'border-transparent hover:border-blue-200'}
                  `}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-[3/2] bg-gray-100 p-2 md:p-4 flex items-center justify-center">
                     <img src={product.image_url} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="p-2 md:p-4">
                    <h3 className="font-bold text-sm md:text-lg text-gray-900 leading-tight mb-1 md:mb-0">{product.name}</h3>
                    <div className="mt-1 md:mt-2 space-y-0.5 md:space-y-1 text-xs md:text-sm text-gray-600 hidden md:block">
                      <div className="flex justify-between">
                         <span>{t('calculator_max_stroke')}</span> <span className="font-medium">{specs.max_stroke_mm} mm</span>
                      </div>
                      <div className="flex justify-between">
                         <span>{t('calculator_peak_force')}</span> <span className="font-medium">{specs.max_force_n} N</span>
                      </div>
                      <div className="flex justify-between">
                         <span>{t('calculator_max_speed')}</span> <span className="font-medium">{specs.max_speed_mm_s} mm/s</span>
                      </div>
                    </div>
                    {/* Mobile simplified specs */}
                    <div className="mt-1 text-xs text-gray-500 md:hidden">
                      {specs.max_stroke_mm}mm | {specs.max_force_n}N
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-blue-600 text-white p-0.5 md:p-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3 md:w-5 md:h-5" />
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Generic Option Card */}
            {!selectedProduct && availableProducts.length > 0 && (
               <div className="hidden md:flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-400 bg-gray-50/50">
                  <CalcIcon className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm text-center">{t('calculator_select_drive_help')}</p>
               </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Physics Inputs */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-white border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                   <Weight className="w-5 h-5 text-indigo-500" />
                   2. {t('calculator_physical_setup')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>{t('calculator_payload_mass')}</Label>
                  <div className="relative mt-1">
                    <Input 
                      type="text" 
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      value={physicsParams.payloadMass}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                          setPhysicsParams({...physicsParams, payloadMass: val === '' ? '' : val});
                        }
                      }}
                      onBlur={(e) => {
                        const num = parseFloat(e.target.value);
                        setPhysicsParams({...physicsParams, payloadMass: isNaN(num) ? 0 : num});
                      }}
                      onKeyDown={handleInputBlur}
                      onFocus={handleInputFocus}
                      className="pl-10"
                    />
                    <PackagePlus className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  {selectedProduct && (
                    <div className="flex justify-end items-center gap-1">
                       <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                          {t('calculator_values_locked')}
                       </span>
                       <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 text-gray-400 hover:text-red-600" 
                          onClick={clearSelection}
                          title={t('calculator_unlock')}
                       >
                         <Unlock className="w-3 h-3" />
                       </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 h-8 flex items-end pb-1">{t('calculator_motor_mass')}</Label>
                      <div className="relative">
                        <Input 
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          value={physicsParams.motorMass}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                              setPhysicsParams({...physicsParams, motorMass: val === '' ? '' : val});
                            }
                          }}
                          onBlur={(e) => {
                            const num = parseFloat(e.target.value);
                            setPhysicsParams({...physicsParams, motorMass: isNaN(num) ? 0 : num});
                          }}
                          onKeyDown={handleInputBlur}
                          onFocus={handleInputFocus}
                          disabled={!!selectedProduct} 
                          className={`mt-1 ${selectedProduct ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
                        {selectedProduct && <Lock className="w-3 h-3 text-gray-400 absolute right-2 top-3" />}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 h-8 flex items-end pb-1">{t('calculator_max_force')}</Label>
                      <div className="relative">
                        <Input 
                          type="text"
                          inputMode="decimal"
                          pattern="[0-9]*\.?[0-9]*"
                          value={physicsParams.maxForce}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                              setPhysicsParams({...physicsParams, maxForce: val === '' ? '' : val});
                            }
                          }}
                          onBlur={(e) => {
                            const num = parseFloat(e.target.value);
                            setPhysicsParams({...physicsParams, maxForce: isNaN(num) ? 0 : num});
                          }}
                          onKeyDown={handleInputBlur}
                          onFocus={handleInputFocus}
                          disabled={!!selectedProduct}
                          className={`mt-1 ${selectedProduct ? 'bg-gray-100 text-gray-500' : ''}`}
                        />
                        {selectedProduct && <Lock className="w-3 h-3 text-gray-400 absolute right-2 top-3" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Max Accel Calc Result */}
                <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-indigo-800">{t('calculator_phys_max_accel')}</span>
                    <span className="text-lg font-bold text-indigo-600">
                       {calculatedAccel?.maxAccelMeters?.toFixed(1) || 0} m/s²
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                       type="checkbox" 
                       id="useAutoAccel" 
                       checked={useCalculatedAccel}
                       onChange={(e) => setUseCalculatedAccel(e.target.checked)}
                       className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="useAutoAccel" className="text-xs text-indigo-700 cursor-pointer">
                      {t('calculator_auto_apply')}
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motion Inputs */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-white border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                   <MoveHorizontal className="w-5 h-5 text-blue-500" />
                   3. {t('calculator_motion_profile')}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 md:pt-6 space-y-3 px-3 md:px-6">
                {/* Row 1: Distance & Velocity */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs leading-tight"><span>{t('calculator_distance_label')}</span><br/><span className="text-gray-400">(mm)</span></Label>
                    <div className="relative mt-1">
                      <Input 
                         type="text"
                         inputMode="decimal"
                         pattern="[0-9]*\.?[0-9]*"
                         value={params.distanceMm}
                         onChange={(e) => {
                           const val = e.target.value;
                           if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                             setParams({...params, distanceMm: val === '' ? '' : val});
                           }
                         }}
                         onBlur={(e) => {
                           const num = parseFloat(e.target.value);
                           setParams({...params, distanceMm: isNaN(num) ? 0 : num});
                         }}
                         onKeyDown={handleInputBlur}
                         onFocus={handleInputFocus}
                         className={`pl-8 ${validations.find(v => v.param === 'distance' && v.type === 'error') ? 'border-red-300 bg-red-50' : ''}`}
                      />
                      <MoveHorizontal className="w-3.5 h-3.5 absolute left-2.5 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs leading-tight"><span>{t('calculator_velocity_label')}</span><br/><span className="text-gray-400">(mm/s)</span></Label>
                    <div className="flex items-center gap-0.5 mt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-6 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={() => setParams({...params, maxSpeedMmS: adjustValue(params.maxSpeedMmS, false)})}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input 
                         type="text"
                         inputMode="decimal"
                         pattern="[0-9]*\.?[0-9]*"
                         value={params.maxSpeedMmS}
                         onChange={(e) => {
                           const val = e.target.value;
                           if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                             setParams({...params, maxSpeedMmS: val === '' ? '' : val});
                           }
                         }}
                         onBlur={(e) => {
                           const num = parseFloat(e.target.value);
                           setParams({...params, maxSpeedMmS: isNaN(num) ? 0 : num});
                         }}
                         onKeyDown={handleInputBlur}
                         onFocus={handleInputFocus}
                         className={`flex-grow min-w-0 ${validations.find(v => v.param === 'speed' && v.type === 'error') ? 'border-red-300 bg-red-50' : ''}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-6 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={() => setParams({...params, maxSpeedMmS: adjustValue(params.maxSpeedMmS, true)})}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {selectedProduct && (
                  <div className="grid grid-cols-2 gap-3 -mt-2">
                    <p className="text-[10px] text-gray-500 text-right">{t('calculator_max_label')} {selectedProduct.technical_specs.max_stroke_mm}mm</p>
                    <p className="text-[10px] text-gray-500 text-right">{t('calculator_max_label')} {selectedProduct.technical_specs.max_speed_mm_s}mm/s</p>
                  </div>
                )}

                {/* Row 2: Acceleration & Jerk */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs leading-tight"><span>{t('calculator_accel_label')}</span><br/><span className="text-gray-400">(m/s²)</span></Label>
                    <div className="flex items-center gap-0.5 mt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-6 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setParams({...params, maxAccelMS2: adjustValue(params.maxAccelMS2, false)});
                          setUseCalculatedAccel(false);
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={params.maxAccelMS2}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setParams({...params, maxAccelMS2: val === '' ? '' : val});
                            setUseCalculatedAccel(false);
                          }
                        }}
                        onBlur={(e) => {
                          const num = parseFloat(e.target.value);
                          setParams({...params, maxAccelMS2: isNaN(num) ? 0 : num});
                        }}
                        onKeyDown={handleInputBlur}
                        onFocus={handleInputFocus}
                        className="flex-grow min-w-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-6 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setParams({...params, maxAccelMS2: adjustValue(params.maxAccelMS2, true)});
                          setUseCalculatedAccel(false);
                        }}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs leading-tight"><span>{t('calculator_jerk_label')}</span><br/><span className="text-gray-400">(m/s³)</span></Label>
                    <div className="flex items-center gap-0.5 mt-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-6 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={() => setParams({...params, maxJerkMS3: adjustValue(params.maxJerkMS3, false)})}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={params.maxJerkMS3}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                            setParams({...params, maxJerkMS3: val === '' ? '' : val});
                          }
                        }}
                        onBlur={(e) => {
                          const num = parseFloat(e.target.value);
                          setParams({...params, maxJerkMS3: isNaN(num) ? 0 : num});
                        }}
                        onKeyDown={handleInputBlur}
                        onFocus={handleInputFocus}
                        className="flex-grow min-w-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-6 flex-shrink-0 text-gray-400 hover:text-gray-600"
                        onClick={() => setParams({...params, maxJerkMS3: adjustValue(params.maxJerkMS3, true)})}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Verification Status - Compact inline */}
            {selectedProduct && (
               <div className={`px-3 py-2 rounded-lg border flex items-center gap-3 flex-wrap ${hasErrors ? 'bg-red-50 border-red-200' : hasTrajectoryAdjustments ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                  {hasErrors ? <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> : hasTrajectoryAdjustments ? <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  <span className={`text-sm font-medium ${hasErrors ? 'text-red-800' : hasTrajectoryAdjustments ? 'text-amber-800' : 'text-green-800'}`}>
                     {hasErrors ? t('calculator_config_exceeds') : hasTrajectoryAdjustments ? t('calculator_config_adjusted') : t('calculator_config_valid')}
                  </span>
                  <div className="flex items-center gap-3 text-xs ml-auto">
                     {validations.map((v, idx) => (
                        <span key={idx} className={`flex items-center gap-1 ${v.type === 'error' ? 'text-red-700 font-medium' : 'text-green-600'}`}>
                           {v.type === 'error' ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                           {v.msg}
                        </span>
                     ))}
                  </div>
               </div>
            )}
            
            {/* Trajectory Adjustment Feedback */}
            {hasTrajectoryAdjustments && (
               <div className="px-3 py-2 rounded-lg border bg-amber-50 border-amber-200">
                  <div className="flex items-start gap-2 mb-2">
                     <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                     <div>
                        <span className="text-sm font-medium text-amber-800">{t('calculator_adjusted_params')}</span>
                        <p className="text-xs text-amber-700 mt-0.5">
                           {results.isVelocityLimited && t('calculator_velocity_limited_desc')}
                           {results.isJerkMinLimited && !results.isVelocityLimited && t('calculator_jerk_increased_desc')}
                           {results.isTrapezoidal && !results.isVelocityLimited && !results.isJerkMinLimited && t('calculator_trapezoidal_desc')}
                        </p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                     {results.isVelocityLimited && (
                        <div className="bg-white/60 rounded px-2 py-1.5 border border-amber-100">
                           <div className="text-amber-600 font-medium flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {t('calculator_velocity_limited')}
                           </div>
                           <div className="mt-1 space-y-0.5">
                              <div className="flex justify-between">
                                 <span className="text-gray-500">{t('calculator_requested')}:</span>
                                 <span className="text-gray-700 line-through">{results.requestedVelocity} mm/s</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-gray-500">{t('calculator_actual')}:</span>
                                 <span className="text-amber-700 font-medium">{results.actualVelocity.toFixed(0)} mm/s</span>
                              </div>
                           </div>
                        </div>
                     )}
                     {results.isJerkMinLimited && (
                        <div className="bg-white/60 rounded px-2 py-1.5 border border-amber-100">
                           <div className="text-amber-600 font-medium flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {t('calculator_jerk_increased')}
                           </div>
                           <div className="mt-1 space-y-0.5">
                              <div className="flex justify-between">
                                 <span className="text-gray-500">{t('calculator_requested')}:</span>
                                 <span className="text-gray-700 line-through">{results.requestedJerk} m/s³</span>
                              </div>
                              <div className="flex justify-between">
                                 <span className="text-gray-500">{t('calculator_actual')}:</span>
                                 <span className="text-amber-700 font-medium">{results.actualJerk.toFixed(1)} m/s³</span>
                              </div>
                           </div>
                        </div>
                     )}
                     {results.isTrapezoidal && (
                        <div className="bg-white/60 rounded px-2 py-1.5 border border-amber-100">
                           <div className="text-amber-600 font-medium flex items-center gap-1">
                              <Info className="w-3 h-3" />
                              {t('calculator_trapezoidal_profile')}
                           </div>
                           <p className="mt-1 text-gray-600">{t('calculator_trapezoidal_desc')}</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* Main Results Chart */}
            <Card className="h-[350px] md:h-[500px] border-none shadow-lg flex flex-col">
               <CardHeader className="py-3 md:py-6">
                  <CardTitle className="flex justify-between items-center text-base md:text-xl">
                     <span>{t('calculator_motion_analysis')}</span>
                     <div className="flex gap-3">
                        <Badge variant="outline" className="text-xs md:text-sm font-normal">
                           {t('calculator_one_way')}: <span className="font-bold ml-1">{results?.totalTime || '0.000'} s</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs md:text-sm font-normal bg-blue-50">
                           {t('calculator_cycle')}: <span className="font-bold ml-1">{results?.totalTime ? (parseFloat(results.totalTime) * 2).toFixed(3) : '0.000'} s</span>
                        </Badge>
                     </div>
                  </CardTitle>
               </CardHeader>
               <CardContent className="flex-grow min-h-0 p-1 md:p-6">
                  {results?.data ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.data} margin={{ top: 5, right: 0, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time"
                          type="number"
                          tickFormatter={(v) => (v * 1000).toFixed(0)}
                          label={{ value: 'ms', position: 'insideBottomRight', offset: -5, fontSize: 10 }}
                          tick={{ fontSize: 10 }}
                          height={20}
                        />
                        <YAxis 
                          yAxisId="pos" 
                          orientation="left" 
                          stroke="#2563eb" 
                          width={35}
                          tick={{ fontSize: 10 }}
                          tickFormatter={v => (v/1000).toFixed(0)} 
                        />
                        <YAxis 
                          yAxisId="vel" 
                          orientation="right" 
                          stroke="#16a34a" 
                          width={35}
                          tick={{ fontSize: 10 }}
                          tickFormatter={v => (v/1000).toFixed(0)}
                          domain={[0, 'auto']}
                        />
                        {/* Acceleration Axis - Hidden but present to auto-scale independently */}
                        <YAxis yAxisId="acc" orientation="right" hide domain={['auto', 'auto']} />

                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                          formatter={(val, name) => {
                             if (name === t('calculator_chart_position')) return [(val/1000).toFixed(2) + ' mm', name];
                             if (name === t('calculator_chart_velocity')) return [(val/1000).toFixed(0) + ' mm/s', name];
                             if (name === t('calculator_chart_acceleration')) return [(val/1000000).toFixed(1) + ' m/s²', name];
                             return [val, name];
                          }}
                          labelFormatter={v => `${(v*1000).toFixed(0)} ms`}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={30} 
                          iconSize={10}
                          wrapperStyle={{ fontSize: '10px' }}
                        />

                        <Line yAxisId="pos" type="monotone" dataKey="position" name={t('calculator_chart_position')} stroke="#2563eb" strokeWidth={2} dot={false} />
                        <Line yAxisId="vel" type="monotone" dataKey="velocity" name={t('calculator_chart_velocity')} stroke="#16a34a" strokeWidth={2} dot={false} />
                        <Line yAxisId="acc" type="monotone" dataKey="acceleration" name={t('calculator_chart_acceleration')} stroke="#dc2626" strokeWidth={1.5} strokeDasharray="5 5" dot={false} opacity={0.6} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                     <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        {t('calculator_waiting')}
                     </div>
                  )}
               </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}