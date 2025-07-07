import React, { useState, useEffect, useRef } from 'react';

interface AnimatedNumberProps {
  value: string | number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  easeOut?: boolean;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  easeOut = true
}) => {
  const [display, setDisplay] = useState('0');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  useEffect(() => {
    // Parse the value
    let targetValue: number;
    
    if (typeof value === 'string') {
      // Handle fractions like "3/5"
      if (value.includes('/')) {
        setDisplay(value);
        return;
      }
      // Handle percentages
      if (value.includes('%')) {
        targetValue = parseFloat(value.replace('%', ''));
        suffix = '%';
      } else {
        targetValue = parseFloat(value);
      }
    } else {
      targetValue = value;
    }

    // If not a valid number, display as is
    if (isNaN(targetValue)) {
      setDisplay(value.toString());
      return;
    }

    // Start animation after delay
    const timeoutId = setTimeout(() => {
      setIsAnimating(true);
      startTimeRef.current = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - (startTimeRef.current || 0);
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easedProgress = easeOut ? 1 - Math.pow(1 - progress, 3) : progress;
        
        const currentValue = targetValue * easedProgress;
        
        // Format the number
        let formattedValue: string;
        if (decimals > 0) {
          formattedValue = currentValue.toFixed(decimals);
        } else {
          formattedValue = Math.round(currentValue).toString();
        }
        
        setDisplay(formattedValue);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          // Ensure final value is exact
          if (decimals > 0) {
            setDisplay(targetValue.toFixed(decimals));
          } else {
            setDisplay(Math.round(targetValue).toString());
          }
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, delay, decimals, easeOut]);

  return (
    <span className={`${className} ${isAnimating ? 'animate-pulse' : ''}`}>
      {prefix}{display}{suffix}
    </span>
  );
}; 