const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/LiveSimulation.tsx', 'utf-8');
const importsToAdd = `import { Canvas, useFrame } from '@react-three/fiber';\nimport { OrbitControls, Stars, Sphere, Trail } from '@react-three/drei';\nimport * as THREE from 'three';\n`;

const newContent = content.replace("import { motion } from 'motion/react';", "import { motion } from 'motion/react';\n" + importsToAdd);
fs.writeFileSync('src/components/dashboard/LiveSimulation.tsx', newContent);
