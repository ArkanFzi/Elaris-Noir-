"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/app/components/quiz/QuizQuestion";
import { QuizResults } from "@/app/components/quiz/QuizResults";
import { PageHero } from "@/app/components/ui/PageHero";

// Quiz Data
const questions = [
  {
    id: 1,
    question: "Where do you feel most at peace?",
    options: [
      { id: "a", label: "A Blooming Royal Garden", value: "floral" },
      { id: "b", label: "A Quiet Library with Old Books", value: "woody" },
      { id: "c", label: "A Misty Morning by the Sea", value: "fresh" },
      { id: "d", label: "A Bustling Spice Market at Sunset", value: "oriental" },
    ],
  },
  {
    id: 2,
    question: "Which texture appeals to you most?",
    options: [
      { id: "a", label: "Silk Petals", value: "floral" },
      { id: "b", label: "Rough Leather", value: "woody" },
      { id: "c", label: "Cool Marble", value: "fresh" },
      { id: "d", label: "Warm Velvet", value: "oriental" },
    ],
  },
  {
    id: 3,
    question: "What is your beverage of choice?",
    options: [
      { id: "a", label: "Rosé Champagne", value: "floral" },
      { id: "b", label: "Aged Whiskey", value: "woody" },
      { id: "c", label: "Sparkling Water with Lime", value: "fresh" },
      { id: "d", label: "Spiced Chai Tea", value: "oriental" },
    ],
  },
  {
    id: 4,
    question: "How would you describe your style?",
    options: [
      { id: "a", label: "Romantic & Soft", value: "floral" },
      { id: "b", label: "Structured & Timeless", value: "woody" },
      { id: "c", label: "Minimalist & Clean", value: "fresh" },
      { id: "d", label: "Bold & Extravagant", value: "oriental" },
    ],
  },
];

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateResult = () => {
    // Simple frequency counter
    const counts: Record<string, number> = {};
    answers.forEach((ans) => {
      counts[ans] = (counts[ans] || 0) + 1;
    });

    // Find key with max value
    const result = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
    return result;
  };

  return (
    <main className="bg-midnight min-h-screen flex flex-col">
       {!isFinished && (
         <PageHero 
            title="Discover Your Composition" 
            subtitle="An interactive journey to find the scent that speaks to your soul."
            image="https://images.unsplash.com/photo-1616091448833-2868ff13a375?q=80&w=2070&auto=format&fit=crop"
         />
       )}

      <div className={`flex-1 flex flex-col justify-center items-center py-20 transition-colors duration-1000 ${isFinished ? "bg-midnight" : "bg-midnight-light"}`}>
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <QuizQuestion
                question={questions[currentStep].question}
                options={questions[currentStep].options}
                onAnswer={handleAnswer}
                currentStep={currentStep + 1}
                totalSteps={questions.length}
              />
            </motion.div>
          ) : (
            <motion.div
                key="result"
                className="w-full"
            >
                <QuizResults scentProfile={calculateResult()} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
