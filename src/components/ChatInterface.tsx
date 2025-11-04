import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, ArrowLeft, User, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onBack: () => void;
}

const ChatInterface = ({ difficulty, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Send initial greeting from the AI client
    const initialMessage: Message = {
      role: 'assistant',
      content: getInitialGreeting(difficulty)
    };
    setMessages([initialMessage]);
  }, [difficulty]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getInitialGreeting = (diff: string) => {
    const greetings = {
      easy: "Olá! Tudo bem? Estou procurando opções de conta e cartão de crédito. Vocês podem me ajudar?",
      medium: "Oi. Eu já tenho conta em outro banco, mas queria saber o que vocês oferecem. O que vocês têm de diferente?",
      hard: "Olha, já tenho conta em três bancos e francamente não estou muito satisfeito com nenhum. Por que eu deveria considerar abrir conta aqui?"
    };
    return greetings[diff as keyof typeof greetings];
  };

  const getDifficultyLabel = (diff: string) => {
    const labels = {
      easy: 'Cliente Fácil',
      medium: 'Cliente Médio',
      hard: 'Cliente Difícil'
    };
    return labels[diff as keyof typeof labels];
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-simulator', {
        body: {
          messages: updatedMessages,
          difficulty
        }
      });

      if (error) throw error;

      if (data?.response) {
        setMessages([...updatedMessages, {
          role: 'assistant',
          content: data.response
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <Card className="mb-4 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <div className="text-center flex-1">
              <h2 className="text-xl font-bold">{getDifficultyLabel(difficulty)}</h2>
              <p className="text-sm text-muted-foreground">Simulação de Vendas</p>
            </div>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        </Card>

        {/* Messages */}
        <Card className="flex-1 mb-4 overflow-hidden shadow-lg">
          <ScrollArea className="h-full p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 animate-slide-up ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-accent" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm">Digitando...</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>

        {/* Input */}
        <Card className="p-4 shadow-lg">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua resposta como vendedor..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
