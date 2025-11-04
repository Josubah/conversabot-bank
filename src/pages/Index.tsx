import { useState } from "react";
import DifficultySelector from "@/components/DifficultySelector";
import ProductSelector from "@/components/ProductSelector";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleSelectDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedDifficulty(difficulty);
  };

  const handleSelectProduct = (product: string) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const handleBackToDifficulty = () => {
    setSelectedDifficulty(null);
    setSelectedProduct(null);
  };

  if (selectedDifficulty && selectedProduct) {
    return <ChatInterface difficulty={selectedDifficulty} product={selectedProduct} onBack={handleBackToProducts} />;
  }

  if (selectedDifficulty) {
    return <ProductSelector onSelectProduct={handleSelectProduct} onBack={handleBackToDifficulty} />;
  }

  return <DifficultySelector onSelectDifficulty={handleSelectDifficulty} />;
};

export default Index;
