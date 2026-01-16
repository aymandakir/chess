"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";

interface CheckmateEffectProps {
  winner: "White" | "Black";
  onClose?: () => void;
}

export default function CheckmateEffect({ winner, onClose }: CheckmateEffectProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1,
    }));
    setConfetti(particles);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-sm" />

      {/* Confetti */}
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            top: "-5%",
            left: `${particle.x}%`,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            top: "110%",
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: particle.id % 3 === 0 
              ? "#0ea5e9" 
              : particle.id % 3 === 1 
              ? "#fbbf24" 
              : "#a855f7",
          }}
        />
      ))}

      {/* Victory card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 0.2,
        }}
        className="relative bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-2xl border-2 border-primary-500 dark:border-primary-600 pointer-events-auto max-w-sm mx-4"
      >
        {/* Trophy icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.4,
          }}
          className="flex justify-center mb-4"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center space-y-3"
        >
          <h2 className="text-3xl font-bold font-display text-neutral-900 dark:text-white">
            Checkmate!
          </h2>
          <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            {winner} wins
          </p>
          
          {onClose && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="mt-6 w-full bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-105"
            >
              New Game
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
