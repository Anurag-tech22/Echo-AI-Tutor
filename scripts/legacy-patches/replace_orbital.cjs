const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/LiveSimulation.tsx', 'utf-8');
const orbitalSimStr = fs.readFileSync('orbital_sim.txt', 'utf-8');

const parts = content.split('function OrbitalMechanicsSim() {');
if (parts.length > 1) {
    const after = parts[1].split('function ChemicalKineticsSim() {');
    if (after.length > 1) {
        const newContent = parts[0] + orbitalSimStr + '\n\nfunction ChemicalKineticsSim() {' + after[1];
        fs.writeFileSync('src/components/dashboard/LiveSimulation.tsx', newContent);
        console.log('Replaced successfully');
    }
}
