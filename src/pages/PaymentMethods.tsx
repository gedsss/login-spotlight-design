import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Bitcoin } from "lucide-react";

const PaymentMethods = () => {
  return (
    <div className="relative min-h-screen w-full bg-theme-background overflow-hidden">
      <ThemeToggle />
      
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-60 overflow-hidden">
        <svg
          className="w-full h-full min-h-screen"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--theme-details))" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Geometric shapes */}
          <circle cx="200" cy="200" r="100" fill="none" stroke="hsl(var(--theme-details))" strokeWidth="3" />
          <circle cx="1720" cy="300" r="150" fill="none" stroke="hsl(var(--theme-details))" strokeWidth="3" />
          <path d="M 400 600 L 600 800 L 400 1000 L 200 800 Z" fill="none" stroke="hsl(var(--theme-details))" strokeWidth="3" />
          <path d="M 1500 700 L 1700 500 L 1900 700 L 1700 900 Z" fill="none" stroke="hsl(var(--theme-details))" strokeWidth="3" />
          
          {/* Additional lines */}
          <line x1="0" y1="400" x2="500" y2="400" stroke="hsl(var(--theme-details))" strokeWidth="3" />
          <line x1="1420" y1="0" x2="1420" y2="500" stroke="hsl(var(--theme-details))" strokeWidth="3" />
          <line x1="800" y1="0" x2="1200" y2="400" stroke="hsl(var(--theme-details))" strokeWidth="3" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/payment">
          <Button variant="outline" className="mb-6 bg-transparent border-theme-details text-theme-details hover:bg-theme-details hover:text-theme-background">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Main content */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-theme-surface border-theme-details">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-theme-surface-foreground">
                Escolha o Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-theme-surface-foreground mb-8">
                Selecione como deseja realizar sua doação
              </p>
              
              {/* Payment options */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-black hover:bg-white/80 font-bold py-6 text-lg border border-theme-details"
                >
                  <CreditCard className="mr-3 h-6 w-6" />
                  Cartão de Crédito
                </Button>
                
                <Button 
                  size="lg" 
                  className="w-full bg-white text-black hover:bg-white/80 font-bold py-6 text-lg border border-theme-details"
                >
                  <Wallet className="mr-3 h-6 w-6" />
                  PayPal
                </Button>
                
                <Button 
                  size="lg" 
                  className="w-full bg-white text-black hover:bg-white/80 font-bold py-6 text-lg border border-theme-details"
                >
                  <Bitcoin className="mr-3 h-6 w-6" />
                  Criptomoedas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;