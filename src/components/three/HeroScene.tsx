import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 500 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return [pos, vel];
  }, [count]);

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = Math.random() * 2 + 0.5;
    }
    return s;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const geo = mesh.current.geometry;
    const posAttr = geo.getAttribute('position');
    const arr = posAttr.array as Float32Array;

    const pointer = state.pointer;
    mouse.current.x += (pointer.x * viewport.width * 0.5 - mouse.current.x) * 0.02;
    mouse.current.y += (pointer.y * viewport.height * 0.5 - mouse.current.y) * 0.02;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      if (Math.abs(arr[i * 3]) > 10) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }

    posAttr.needsUpdate = true;

    mesh.current.rotation.x = mouse.current.y * 0.05;
    mesh.current.rotation.y = mouse.current.x * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingGeometry() {
  const octaRef = useRef<THREE.Mesh>(null!);
  const cubeRef = useRef<THREE.Mesh>(null!);
  const icoRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    octaRef.current.rotation.x = t * 0.3;
    octaRef.current.rotation.y = t * 0.2;
    octaRef.current.position.y = Math.sin(t * 0.5) * 0.5 + 1;

    cubeRef.current.rotation.x = t * 0.2;
    cubeRef.current.rotation.z = t * 0.3;
    cubeRef.current.position.y = Math.sin(t * 0.4 + 1) * 0.5 - 1;

    icoRef.current.rotation.y = t * 0.25;
    icoRef.current.rotation.z = t * 0.15;
    icoRef.current.position.y = Math.sin(t * 0.6 + 2) * 0.3;
  });

  return (
    <>
      <mesh ref={octaRef} position={[-3, 1, -2]}>
        <octahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial color="#6366f1" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh ref={cubeRef} position={[3.5, -1, -3]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#8b5cf6" transparent opacity={0.25} wireframe />
      </mesh>
      <mesh ref={icoRef} position={[0, 0, -4]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#22d3ee" transparent opacity={0.2} wireframe />
      </mesh>
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366f1" />
        <Particles count={400} />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
