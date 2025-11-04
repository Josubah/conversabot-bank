import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Wallet, TrendingUp, Home, ArrowLeft, PiggyBank, Shield } from "lucide-react";

interface ProductSelectorProps {
  onSelectProduct: (product: string) => void;
  onBack: () => void;
}

const ProductSelector = ({ onSelectProduct, onBack }: ProductSelectorProps) => {
  const products = [
    {
      id: 'conta',
      title: 'Conta Corrente',
      description: 'Venda conta corrente e serviços bancários',
      icon: Wallet,
      color: 'from-blue-500/20 to-blue-600/20'
    },
    {
      id: 'cartao',
      title: 'Cartão de Crédito',
      description: 'Ofereça cartões com benefícios exclusivos',
      icon: CreditCard,
      color: 'from-purple-500/20 to-purple-600/20'
    },
    {
      id: 'investimentos',
      title: 'Investimentos',
      description: 'Apresente CDB, fundos e previdência',
      icon: TrendingUp,
      color: 'from-green-500/20 to-green-600/20'
    },
    {
      id: 'emprestimo',
      title: 'Empréstimos',
      description: 'Ofereça crédito pessoal e consignado',
      icon: Home,
      color: 'from-orange-500/20 to-orange-600/20'
    },
    {
      id: 'capitalizacao',
      title: 'Capitalização',
      description: 'Apresente títulos de capitalização',
      icon: PiggyBank,
      color: 'from-yellow-500/20 to-yellow-600/20'
    },
    {
      id: 'seguro',
      title: 'Seguros',
      description: 'Ofereça seguros de vida, auto e residencial',
      icon: Shield,
      color: 'from-red-500/20 to-red-600/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full animate-fadeIn">
        <div className="mb-8 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-center">Qual produto você vai vender?</h1>
            <p className="text-muted-foreground text-center mt-2">
              Escolha o produto para simular a venda
            </p>
          </div>
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`p-6 cursor-pointer hover:scale-105 transition-all duration-300 bg-gradient-to-br ${product.color} border-2 hover:border-primary/50 flex flex-col h-full`}
              onClick={() => onSelectProduct(product.id)}
            >
              <div className="flex flex-col items-center text-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <product.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
                <Button className="w-full mt-auto">
                  Selecionar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
