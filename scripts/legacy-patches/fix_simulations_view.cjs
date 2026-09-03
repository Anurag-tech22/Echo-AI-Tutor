const fs = require('fs');

let content = fs.readFileSync('src/components/views/SimulationsView.tsx', 'utf-8');

const simToAdd = `
    { title: 'Particle Collider', category: 'Thermodynamics', img: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=600&auto=format&fit=crop', color: 'sky' },
`;

content = content.replace(
  "{ title: 'Orbital Mechanics'", 
  simToAdd.trim() + ",\n    { title: 'Orbital Mechanics'"
);

fs.writeFileSync('src/components/views/SimulationsView.tsx', content);
