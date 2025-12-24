"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";

interface Option {
  id: string;
  label: string;
  value: string; // The scent profile this option maps to (e.g., "floral", "woody")
}

interface QuizQuestionProps {
  question: string;
  options: Option[];
  onAnswer: (value: string) => void;
  currentStep: number;
  totalSteps: number;
}

export function QuizQuestion({ question, options, onAnswer, currentStep, totalSteps }: QuizQuestionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      <motion.div
        key={currentStep} // Triggers animation on new step
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <span className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-6 block">
          Question {currentStep} / {totalSteps}
        </span>

        <h2 className="font-serif text-3xl md:text-5xl text-mist mb-12 leading-tight">
          {question}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full py-8 text-lg font-light hover:bg-gold hover:text-midnight transition-all duration-300 border-white/20"
                onClick={() => onAnswer(option.value)}
              >
                {option.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
