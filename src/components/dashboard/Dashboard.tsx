import React from 'react';
import { motion } from 'motion/react';
import { YourUnderstanding } from './YourUnderstanding';
import { UnderstandingMap } from './UnderstandingMap';
import { FutureMistakeForecast } from './FutureMistakeForecast';
import { MistakeLab } from './MistakeLab';
import { LiveSimulation } from './LiveSimulation';
import { ReasoningXRay } from './ReasoningXRay';
import { Counterexample } from './Counterexample';
import { LearningLoop } from './LearningLoop';
import { TransferChallenge } from './TransferChallenge';
import { ProofOfUnderstanding } from './ProofOfUnderstanding';
import { PhysicsPlayground } from './PhysicsPlayground';
import { ViewType } from '../Sidebar';

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function Dashboard({ onViewChange }: DashboardProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-20"
    >
      {/* Interactive Physics Arcade Fling Playground */}
      <motion.div variants={itemVariants} className="w-full">
        <PhysicsPlayground />
      </motion.div>

      {/* Socratic Diagnostics & Learning Loop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[450px]">
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <YourUnderstanding onViewChange={onViewChange} />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <UnderstandingMap onViewChange={onViewChange} />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <FutureMistakeForecast onViewChange={onViewChange} />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <MistakeLab onViewChange={onViewChange} />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <LiveSimulation />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <ReasoningXRay />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <Counterexample />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <LearningLoop />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <TransferChallenge onViewChange={onViewChange} />
        </motion.div>
        <motion.div variants={itemVariants} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="h-full">
          <ProofOfUnderstanding />
        </motion.div>
      </div>
    </motion.div>
  );
}
