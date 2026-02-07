import { X } from 'lucide-react';
import type { CarSettings } from '../App';

interface SettingsPanelProps {
  settings: CarSettings;
  onSettingsChange: (settings: CarSettings) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, onClose }: SettingsPanelProps) {
  const handleChange = (key: keyof CarSettings, value: number) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="absolute top-20 right-6 w-80 bg-card border border-border rounded-lg shadow-lg p-6 z-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">Car Settings</h2>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-accent transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        <SettingSlider
          label="Motor Power"
          value={settings.motorPower}
          min={500}
          max={3000}
          step={100}
          onChange={(v) => handleChange('motorPower', v)}
        />
        
        <SettingSlider
          label="Brake Power"
          value={settings.brakePower}
          min={1000}
          max={5000}
          step={100}
          onChange={(v) => handleChange('brakePower', v)}
        />
        
        <SettingSlider
          label="Max Steer Angle"
          value={settings.maxSteerAngle}
          min={10}
          max={45}
          step={1}
          onChange={(v) => handleChange('maxSteerAngle', v)}
          unit="°"
        />
        
        <SettingSlider
          label="Drag on Ground"
          value={settings.dragOnGround}
          min={0}
          max={10}
          step={0.5}
          onChange={(v) => handleChange('dragOnGround', v)}
        />
      </div>
    </div>
  );
}

interface SettingSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  unit?: string;
}

function SettingSlider({ label, value, min, max, step, onChange, unit = '' }: SettingSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm text-muted-foreground">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
}
