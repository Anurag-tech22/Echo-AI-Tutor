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
import { ViewType } from '../Sidebar';

interface DashboardProps {
  onViewChange?: (view: ViewType) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 auto-rows-[450px]"
    >
      <motion.div variants={itemVariants} className="h-full"><YourUnderstanding onViewChange={onViewChange} /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><UnderstandingMap onViewChange={onViewChange} /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><FutureMistakeForecast onViewChange={onViewChange} /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><MistakeLab onViewChange={onViewChange} /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><LiveSimulation /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><ReasoningXRay /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><Counterexample /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><LearningLoop /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><TransferChallenge onViewChange={onViewChange} /></motion.div>
      <motion.div variants={itemVariants} className="h-full"><ProofOfUnderstanding /></motion.div>
    </motion.div>
  );
}
