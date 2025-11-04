import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  product: string;
  onBack: () => void;
}

const ChatInterface = ({ difficulty, product, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Send initial greeting from the AI client
    const initialMessage: Message = {
      role: 'assistant',
      content: getInitialGreeting(difficulty, product)
    };
    setMessages([initialMessage]);
  }, [difficulty, product]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const getInitialGreeting = (diff: string, prod: string) => {
    const greetings: Record<string, Record<string, string>> = {
      easy: {
        conta: "Olá! Tudo bem? Estou procurando uma boa conta corrente. Vocês podem me ajudar?",
        cartao: "Oi! Estou interessado em um cartão de crédito com bons benefícios. O que vocês oferecem?",
        investimentos: "Olá! Quero começar a investir meu dinheiro. Que opções vocês têm?",
        emprestimo: "Oi! Preciso de um empréstimo pessoal. Vocês trabalham com isso?",
        capitalizacao: "Olá! Ouvi falar de títulos de capitalização. Vocês podem me explicar como funciona?",
        seguro: "Oi! Estou procurando um seguro de vida. Que planos vocês oferecem?"
      },
      medium: {
        conta: "Oi. Já tenho conta no Itaú, mas estou avaliando outras opções. O que vocês oferecem de diferente?",
        cartao: "Olá. Tenho cartão sem anuidade no Santander. Por que eu deveria pegar um cartão com vocês?",
        investimentos: "Oi. Já invisto em CDB no Bradesco com 100% do CDI. Vocês conseguem oferecer algo melhor?",
        emprestimo: "Olá. Já tenho pré-aprovado de crédito consignado na Caixa. Quais são suas condições?",
        capitalizacao: "Oi. Vi que o Bradesco tem título com sorteios semanais. O que vocês têm de diferente?",
        seguro: "Olá. Já tenho seguro de vida pelo Banco do Brasil. Por que eu deveria trocar?"
      },
      hard: {
        conta: "Olha, já tenho conta em três bancos e todos têm tarifas abusivas. Por que com vocês seria diferente?",
        cartao: "Sinceramente, todos prometem benefícios mas no final é só propaganda. O que vocês têm de REAL?",
        investimentos: "Ah é? Todo banco fala que tem as melhores taxas mas depois vem taxa de administração absurda. Como eu sei que não é mais do mesmo?",
        emprestimo: "Já me ofereceram empréstimo com juros baixíssimos que depois viraram um absurdo nas letras miúdas. Por que eu deveria confiar?",
        capitalizacao: "Capitalização? Isso não é só uma loteria disfarçada onde o banco sempre ganha? Por que eu deveria cair nessa?",
        seguro: "Já tive seguro que na hora do sinistro só deu dor de cabeça pra receber. Como eu sei que vocês não vão me enrolar também?"
      }
    };

    return greetings[diff]?.[prod] || greetings[diff].conta;
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
          difficulty,
          product
        }
      });

      if (error) throw error;

      if (data?.response) {
        // Check for sale conclusion markers
        let content = data.response;
        let saleResult: 'success' | 'failed' | null = null;
        
        if (content.includes('[VENDA_FECHADA]')) {
          saleResult = 'success';
          content = content.replace('[VENDA_FECHADA]', '').trim();
        } else if (content.includes('[VENDA_PERDIDA]')) {
          saleResult = 'failed';
          content = content.replace('[VENDA_PERDIDA]', '').trim();
        }

        const assistantMessage: Message = {
          role: 'assistant',
          content
        };

        setMessages([...updatedMessages, assistantMessage]);

        // Show conclusion after a brief delay
        if (saleResult) {
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              { role: 'assistant', content: `[CONCLUSAO_${saleResult.toUpperCase()}]` }
            ]);
          }, 500);
        }
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
              {messages.map((message, index) => {
                // Check if this is a conclusion message
                if (message.content.includes('[CONCLUSAO_')) {
                  const isSuccess = message.content.includes('SUCCESS');
                  return (
                    <div key={index} className="flex flex-col items-center gap-4 py-8 animate-slide-up">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        isSuccess ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {isSuccess ? (
                          <div className="text-5xl">✓</div>
                        ) : (
                          <div className="text-5xl">✗</div>
                        )}
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-semibold">
                          {isSuccess ? 'Parabéns! Venda Fechada! 🎉' : 'Não foi dessa vez 😢'}
                        </h3>
                        <p className="text-muted-foreground">
                          {isSuccess 
                            ? 'Excelente trabalho! O cliente decidiu contratar o produto.'
                            : 'O cliente não se convenceu. Que tal tentar novamente?'}
                        </p>
                      </div>
                      <Button 
                        onClick={onBack}
                        className="mt-4"
                      >
                        Tentar Novamente
                      </Button>
                    </div>
                  );
                }

                return (
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
                );
              })}
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
          <div className="flex gap-2 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua resposta como vendedor..."
              disabled={isLoading}
              className="flex-1 min-h-[44px] max-h-[150px] resize-none"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="flex-shrink-0"
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
