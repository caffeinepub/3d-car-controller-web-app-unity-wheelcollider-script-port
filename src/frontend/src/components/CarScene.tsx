import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox, useCylinder, usePlane } from '@react-three/cannon';
import * as THREE from 'three';
import type { CarSettings } from '../App';

interface CarSceneProps {
  settings: CarSettings;
}

export function CarScene({ settings }: CarSceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={1} 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      <Ground />
      <Car settings={settings} />
      
      <fog attach="fog" args={['#1a1a1a', 30, 80]} />
    </>
  );
}

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    material: { friction: 0.8, restitution: 0.1 }
  }));

  return (
    <mesh ref={ref as any} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial>
        <primitive 
          attach="map" 
          object={(() => {
            const loader = new THREE.TextureLoader();
            const texture = loader.load('/assets/generated/asphalt-tile.dim_1024x1024.png');
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(20, 20);
            return texture;
          })()} 
        />
      </meshStandardMaterial>
    </mesh>
  );
}

function Car({ settings }: CarSceneProps) {
  const [bodyRef, bodyApi] = useBox(() => ({
    mass: 1200,
    position: [0, 2, 0],
    args: [1.8, 0.8, 3],
    material: { friction: 0.1, restitution: 0.1 }
  }));

  // Create all four wheels using hooks at top level
  const [wheel0Ref, wheel0Api] = useCylinder(() => ({
    mass: 20,
    position: [0.8, 2.3, 1.2],
    args: [0.3, 0.3, 0.2, 16],
    rotation: [0, 0, Math.PI / 2],
    material: { friction: 1.5, restitution: 0.1 }
  }));

  const [wheel1Ref, wheel1Api] = useCylinder(() => ({
    mass: 20,
    position: [-0.8, 2.3, 1.2],
    args: [0.3, 0.3, 0.2, 16],
    rotation: [0, 0, Math.PI / 2],
    material: { friction: 1.5, restitution: 0.1 }
  }));

  const [wheel2Ref, wheel2Api] = useCylinder(() => ({
    mass: 20,
    position: [0.8, 2.3, -1.2],
    args: [0.3, 0.3, 0.2, 16],
    rotation: [0, 0, Math.PI / 2],
    material: { friction: 1.5, restitution: 0.1 }
  }));

  const [wheel3Ref, wheel3Api] = useCylinder(() => ({
    mass: 20,
    position: [-0.8, 2.3, -1.2],
    args: [0.3, 0.3, 0.2, 16],
    rotation: [0, 0, Math.PI / 2],
    material: { friction: 1.5, restitution: 0.1 }
  }));

  const wheelApis = useRef([wheel0Api, wheel1Api, wheel2Api, wheel3Api]);
  
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keys.current.forward = true;
          break;
        case 's':
        case 'arrowdown':
          keys.current.backward = true;
          break;
        case 'a':
        case 'arrowleft':
          keys.current.left = true;
          break;
        case 'd':
        case 'arrowright':
          keys.current.right = true;
          break;
        case ' ':
          keys.current.brake = true;
          e.preventDefault();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          keys.current.forward = false;
          break;
        case 's':
        case 'arrowdown':
          keys.current.backward = false;
          break;
        case 'a':
        case 'arrowleft':
          keys.current.left = false;
          break;
        case 'd':
        case 'arrowright':
          keys.current.right = false;
          break;
        case ' ':
          keys.current.brake = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (!bodyRef.current) return;

    // Get body velocity and apply drag
    bodyApi.velocity.subscribe((vel) => {
      const speed = Math.sqrt(vel[0] ** 2 + vel[2] ** 2);
      
      // Apply drag
      const dragForce = speed * settings.dragOnGround;
      const dragX = -vel[0] * dragForce * 0.01;
      const dragZ = -vel[2] * dragForce * 0.01;
      bodyApi.applyForce([dragX, 0, dragZ], [0, 0, 0]);
    })();

    // Calculate input
    let vertical = 0;
    let horizontal = 0;
    
    if (keys.current.forward) vertical += 1;
    if (keys.current.backward) vertical -= 1;
    if (keys.current.left) horizontal -= 1;
    if (keys.current.right) horizontal += 1;

    // Get body rotation
    const bodyRotation = new THREE.Quaternion();
    if (bodyRef.current) {
      bodyRotation.copy((bodyRef.current as THREE.Mesh).quaternion);
    }

    // Apply motor torque to rear wheels (indices 2, 3)
    if (vertical !== 0 && !keys.current.brake) {
      const forwardDir = new THREE.Vector3(0, 0, 1).applyQuaternion(bodyRotation);
      const force = forwardDir.multiplyScalar(vertical * settings.motorPower);
      
      wheelApis.current[2]?.applyForce([force.x, 0, force.z], [0, 0, 0]);
      wheelApis.current[3]?.applyForce([force.x, 0, force.z], [0, 0, 0]);
    }

    // Apply braking
    if (keys.current.brake) {
      wheelApis.current.forEach((api) => {
        api?.velocity.subscribe((vel: number[]) => {
          const brakeForce: [number, number, number] = [
            -vel[0] * settings.brakePower * 0.01,
            0,
            -vel[2] * settings.brakePower * 0.01
          ];
          api.applyForce(brakeForce, [0, 0, 0]);
        })();
      });
    }

    // Apply steering to front wheels (indices 0, 1)
    if (horizontal !== 0) {
      const steerAngle = horizontal * (settings.maxSteerAngle * Math.PI / 180);
      const rightDir = new THREE.Vector3(1, 0, 0).applyQuaternion(bodyRotation);
      const steerForce = rightDir.multiplyScalar(steerAngle * 100);
      
      wheelApis.current[0]?.applyForce([steerForce.x, 0, steerForce.z], [0, 0, 0]);
      wheelApis.current[1]?.applyForce([steerForce.x, 0, steerForce.z], [0, 0, 0]);
    }
  });

  return (
    <group>
      {/* Car body */}
      <mesh ref={bodyRef as any} castShadow>
        <boxGeometry args={[1.8, 0.8, 3]} />
        <meshStandardMaterial color="#e63946" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Wheels */}
      <mesh ref={wheel0Ref as any} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={wheel1Ref as any} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={wheel2Ref as any} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh ref={wheel3Ref as any} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
