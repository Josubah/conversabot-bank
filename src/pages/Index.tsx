import { useState } from "react";
import DifficultySelector from "@/components/DifficultySelector";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);

  const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
  };

  const handleBack = () => {
    setSelectedDifficulty(null);
  };

  if (selectedDifficulty) {
    return <ChatInterface difficulty={selectedDifficulty} onBack={handleBack} />;
  }

  return <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />;
};

export default Index;
