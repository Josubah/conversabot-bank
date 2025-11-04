import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, AlertCircle } from "lucide-react";

interface DifficultySelectorProps {
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

const DifficultySelector = ({ onSelectDifficulty }: DifficultySelectorProps) => {
  const difficulties = [
    {
      level: 'easy' as const,
      title: 'Cliente Fácil',
      description: 'Cliente receptivo e interessado nos produtos',
      icon: Users,
      color: 'text-accent',
    },
    {
      level: 'medium' as const,
      title: 'Cliente Médio',
      description: 'Cliente com dúvidas e necessita de convencimento',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      level: 'hard' as const,
      title: 'Cliente Difícil',
      description: 'Cliente resistente e com muitas objeções',
      icon: AlertCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/30">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Simulador de Vendas Bancário
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha o nível de dificuldade para iniciar sua simulação
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {difficulties.map((diff, index) => {
            const Icon = diff.icon;
            return (
              <Card
                key={diff.level}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onSelectDifficulty(diff.level)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${diff.color}`} />
                  </div>
                  <CardTitle className="text-xl">{diff.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {diff.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => onSelectDifficulty(diff.level)}
                  >
                    Selecionar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
