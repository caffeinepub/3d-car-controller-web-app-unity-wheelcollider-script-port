import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Suspense, useState, useEffect } from 'react';
import { CarScene } from './components/CarScene';
import { SettingsPanel } from './components/SettingsPanel';
import { HelpOverlay } from './components/HelpOverlay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';

export interface CarSettings {
  motorPower: number;
  brakePower: number;
  maxSteerAngle: number;
  dragOnGround: number;
}

const DEFAULT_SETTINGS: CarSettings = {
  motorPower: 1500,
  brakePower: 3000,
  maxSteerAngle: 30,
  dragOnGround: 3
};

function App() {
  const [settings, setSettings] = useState<CarSettings>(() => {
    const saved = localStorage.getItem('carSettings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });
  
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('carSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <Header 
        onToggleHelp={() => setShowHelp(!showHelp)}
        onToggleSettings={() => setShowSettings(!showSettings)}
      />
      
      <main className="flex-1 relative">
        <Canvas
          shadows
          camera={{ position: [0, 5, 10], fov: 50 }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]} iterations={15}>
              <CarScene settings={settings} />
            </Physics>
          </Suspense>
        </Canvas>
        
        <Loader />
        
        {showSettings && (
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
        
        {showHelp && (
          <HelpOverlay onClose={() => setShowHelp(false)} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
