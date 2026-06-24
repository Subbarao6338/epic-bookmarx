import { useState, useEffect } from 'react';
import { SENSOR_POLLING_MS, MAX_GRAPH_POINTS } from '../../constants';

/**
 * Custom hook for managing Ambient Light Sensor data.
 * Handles API availability, permissions, and fallback simulations.
 */
export const useAmbientLight = () => {
  const [lux, setLux] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    let sensor = null;

    if ('AmbientLightSensor' in window) {
      try {
        sensor = new window.AmbientLightSensor({ frequency: 1000 / SENSOR_POLLING_MS });

        sensor.addEventListener('reading', () => {
          const value = sensor.illuminance;
          setLux(value);
          setHistory(prev => [...prev, value].slice(-MAX_GRAPH_POINTS));
        });

        sensor.addEventListener('error', (event) => {
          if (event.error.name === 'NotAllowedError') {
            setError('Permission denied to access light sensor.');
          } else {
            setError(`Sensor error: ${event.error.name}`);
            // Fallback to simulation on non-permission errors (common in desktop browsers)
            startSimulation();
          }
        });

        sensor.start();
      } catch (err) {
        setIsSupported(false);
        startSimulation();
      }
    } else {
      setIsSupported(false);
      startSimulation();
    }

    let cleanupSim;
    function startSimulation() {
      const interval = setInterval(() => {
        const simulatedValue = Math.floor(Math.random() * 500) + 100;
        setLux(simulatedValue);
        setHistory(prev => [...prev, simulatedValue].slice(-MAX_GRAPH_POINTS));
      }, SENSOR_POLLING_MS);
      cleanupSim = () => clearInterval(interval);
    }

    return () => {
      if (sensor) sensor.stop();
      if (cleanupSim) cleanupSim();
    };
  }, []);

  return { lux, history, error, isSupported };
};
