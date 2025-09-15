import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowLeft, CreditCard } from "lucide-react";

const Payment = () => {
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
        <Link to="/donation">
          <Button variant="outline" className="mb-6 bg-transparent border-theme-details text-theme-details hover:bg-theme-details hover:text-theme-background">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Main content */}
        <div className="max-w-md mx-auto">
          <Card className="bg-theme-surface border-theme-details min-h-[500px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-center text-theme-surface-foreground flex items-center justify-center">
                <CreditCard className="mr-2 h-6 w-6" />
                Fazer Doação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 px-8">
              <p className="text-center text-theme-surface-foreground text-sm">
                Sua contribuição fará a diferença na vida de muitas pessoas. Obrigado por sua generosidade!
              </p>
              
              {/* Payment form */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-theme-surface-foreground font-semibold">
                    Quantia
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0,00"
                    min="1"
                    step="0.01"
                    className="bg-theme-background border-theme-details text-theme-surface-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-theme-surface-foreground font-semibold">
                    Moeda
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-theme-background border-theme-details text-theme-surface-foreground">
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                      <SelectItem value="USD">Dólar Americano (US$)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Link to="/payment-methods">
                  <Button 
                    size="lg" 
                    className="w-full mt-8 bg-white text-black hover:bg-white/80 font-bold py-4 text-lg"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    PROSSEGUIR PARA O PAGAMENTO
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;