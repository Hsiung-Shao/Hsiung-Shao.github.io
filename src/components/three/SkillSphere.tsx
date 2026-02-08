import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Billboard, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Skill {
  name: string;
  category: 'backend' | 'frontend' | 'tools';
}

const skills: Skill[] = [
  { name: 'PHP', category: 'backend' },
  { name: 'MySQL', category: 'backend' },
  { name: 'Python', category: 'backend' },
  { name: 'PostgreSQL', category: 'backend' },
  { name: 'Node.js', category: 'backend' },
  { name: 'REST API', category: 'backend' },
  { name: 'React', category: 'frontend' },
  { name: 'TypeScript', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TailwindCSS', category: 'frontend' },
  { name: 'HTML/CSS', category: 'frontend' },
  { name: 'JavaScript', category: 'frontend' },
  { name: 'Supabase', category: 'tools' },
  { name: 'Vite', category: 'tools' },
  { name: 'Docker', category: 'tools' },
  { name: 'Git', category: 'tools' },
  { name: 'Linux', category: 'tools' },
  { name: 'Vercel', category: 'tools' },
];

const categoryColors: Record<string, string> = {
  backend: '#6366f1',
  frontend: '#22d3ee',
  tools: '#10b981',
};

function SkillTag({ skill, position }: { skill: Skill; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const color = categoryColors[skill.category];

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      <Text
        fontSize={hovered ? 0.22 : 0.17}
        color={hovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {skill.name}
      </Text>
    </Billboard>
  );
}

function SphereOfSkills() {
  const groupRef = useRef<THREE.Group>(null!);

  const positions = useMemo(() => {
    const pts: [number, number, number][] = [];
    const n = skills.length;
    const radius = 2.2;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push([
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      ]);
    }
    return pts;
  }, []);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2.2, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.05} wireframe />
      </mesh>

      {skills.map((skill, i) => (
        <SkillTag key={skill.name} skill={skill} position={positions[i]} />
      ))}
    </group>
  );
}

export default function SkillSphere() {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.5} />
        <SphereOfSkills />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.8}
        />
      </Canvas>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4">
        {Object.entries(categoryColors).map(([key, color]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-[var(--color-text-secondary)] capitalize">
              {key === 'backend' ? 'Backend' : key === 'frontend' ? 'Frontend' : 'Tools'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
