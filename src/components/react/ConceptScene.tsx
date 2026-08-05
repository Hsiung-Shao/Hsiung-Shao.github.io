import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import type { Group } from 'three';

type Variant = 'editorial' | 'cinematic' | 'bento';

const imagePaths = [
  '/images/guides/multistream/multistream-live-grid.png',
  '/images/guides/pobtools/pobtools-pob-main.png',
  '/images/guides/minecraft/00-app-overview.png',
];

function FloatingGroup({ variant }: { variant: Variant }) {
  const group = useRef<Group>(null);
  const textures = useTexture(imagePaths);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetX = state.pointer.y * 0.08;
    const targetY = state.pointer.x * 0.12;
    group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(delta * 2.2, 1);
    group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(delta * 2.2, 1);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.32) * 0.08;
  });

  if (variant === 'editorial') {
    const layout = [
      { position: [1.9, 1.35, -0.6] as const, rotation: [0.02, -0.2, -0.04] as const, scale: [3.5, 1.8] as const },
      { position: [2.55, -0.65, -1.3] as const, rotation: [-0.05, -0.28, 0.055] as const, scale: [3.1, 1.58] as const },
      { position: [0.7, -2.1, -2.3] as const, rotation: [0.08, -0.08, -0.08] as const, scale: [2.45, 1.28] as const },
    ];
    return (
      <group ref={group}>
        {layout.map((item, index) => (
          <group key={imagePaths[index]} position={item.position} rotation={item.rotation}>
            <mesh position={[0.14, -0.14, -0.16]} scale={[item.scale[0] + 0.18, item.scale[1] + 0.18, 1]}>
              <boxGeometry args={[1, 1, 0.12]} />
              <meshStandardMaterial color={index === 1 ? '#ef3f2f' : '#1438d3'} roughness={0.72} />
            </mesh>
            <mesh scale={[item.scale[0], item.scale[1], 1]}>
              <planeGeometry />
              <meshBasicMaterial map={textures[index]} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (variant === 'cinematic') {
    return (
      <group ref={group} rotation={[0, -0.12, 0]}>
        {textures.map((texture, index) => {
          const angle = [0, -0.72, 0.72][index];
          const isPrimary = index === 0;
          const width = isPrimary ? 5.35 : 3.65;
          const height = isPrimary ? 2.78 : 1.9;
          return (
            <group key={imagePaths[index]} position={[Math.sin(angle) * 4.5, isPrimary ? 0.35 : (index - 1) * -0.35, isPrimary ? 0 : -2.4]} rotation={[0, -angle * 0.48, isPrimary ? 0 : (index - 1) * -0.045]}>
              <mesh position={[0, 0, -0.2]} scale={[width + 0.25, height + 0.25, 1]}>
                <boxGeometry args={[1, 1, 0.22]} />
                <meshStandardMaterial color={isPrimary ? '#df563f' : '#202a27'} roughness={0.58} metalness={0.08} />
              </mesh>
              <mesh scale={[width, height, 1]}>
                <planeGeometry />
                <meshBasicMaterial map={texture} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>
    );
  }

  return (
    <group ref={group} position={[2.35, 0, -1.1]} rotation={[-0.18, -0.45, -0.08]}>
      <mesh position={[0, 0, -0.5]} scale={[3.8, 4.8, 0.55]}>
        <boxGeometry />
        <meshStandardMaterial color="#17221f" roughness={0.62} />
      </mesh>
      <mesh position={[-0.45, 0.55, -0.14]} scale={[3.35, 1.72, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={textures[0]} toneMapped={false} />
      </mesh>
      <mesh position={[1.5, -1.45, 0]} scale={[1.35, 1.35, 1]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[1, 1, 0.38]} />
        <meshStandardMaterial color="#ff6c48" roughness={0.7} />
      </mesh>
      <mesh position={[-1.45, -1.6, -0.05]} scale={[1.05, 1.05, 1]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[1, 1, 0.28]} />
        <meshStandardMaterial color="#b9df72" roughness={0.7} />
      </mesh>
    </group>
  );
}

export default function ConceptScene({ variant }: { variant: Variant }) {
  const reducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const camera = variant === 'cinematic' ? { position: [0, 0, 8.5] as [number, number, number], fov: 42 } : { position: [0, 0, 8] as [number, number, number], fov: 40 };

  return (
    <div className={`concept-scene concept-scene-${variant}`} aria-hidden="true">
      <Canvas camera={camera} dpr={[1, 1.5]} frameloop={reducedMotion ? 'demand' : 'always'} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={2.2} />
        <directionalLight position={[-4, 7, 8]} intensity={3.4} color="#f4f1df" />
        <pointLight position={[6, -2, 5]} intensity={30} color={variant === 'editorial' ? '#1438d3' : '#ff684c'} distance={22} />
        <Suspense fallback={null}><FloatingGroup variant={variant} /></Suspense>
      </Canvas>
    </div>
  );
}
