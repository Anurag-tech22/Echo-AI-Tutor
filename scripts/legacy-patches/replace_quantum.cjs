const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/LiveSimulation.tsx', 'utf-8');
const quantumSimStr = fs.readFileSync('quantum_sim.txt', 'utf-8');

const parts = content.split('function QuantumSim() {');
if (parts.length > 1) {
    const after = parts[1].split('export function LiveSimulation');
    if (after.length > 1) {
        const newContent = parts[0] + quantumSimStr + '\n\nexport function LiveSimulation' + after[1];
        fs.writeFileSync('src/components/dashboard/LiveSimulation.tsx', newContent);
        console.log('Replaced successfully');
    }
}
