import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Heart } from "lucide-react";

const Donation = () => {
  // Mock data for donors
  const recentDonors = [
    { name: "João Silva", amount: "R$ 100,00", date: "Hoje" },
    { name: "Maria Santos", amount: "R$ 50,00", date: "Ontem" },
    { name: "Pedro Costa", amount: "R$ 200,00", date: "2 dias atrás" },
    { name: "Ana Lima", amount: "R$ 75,00", date: "3 dias atrás" },
    { name: "Carlos Pereira", amount: "R$ 150,00", date: "1 semana atrás" },
  ];

  const topDonors = [
    { name: "Pedro Costa", amount: "R$ 1.500,00", position: 1 },
    { name: "Maria Fernanda", amount: "R$ 1.200,00", position: 2 },
    { name: "João Silva", amount: "R$ 800,00", position: 3 },
    { name: "Ana Carolina", amount: "R$ 650,00", position: 4 },
    { name: "Roberto Santos", amount: "R$ 500,00", position: 5 },
  ];

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
        <Link to="/">
          <Button variant="outline" className="mb-6 bg-theme-surface border-theme-details text-theme-details hover:bg-theme-details hover:text-theme-surface">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Main content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Project description */}
          <Card className="bg-theme-surface border-theme-details">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-theme-surface-foreground">
                Projeto de Doação Comunitária
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-theme-surface-foreground text-lg">
                Nosso projeto tem como objetivo ajudar famílias em situação de vulnerabilidade social,
                fornecendo alimentos, roupas e materiais escolares para crianças e adolescentes.
              </p>
              <p className="text-theme-surface-foreground">
                Cada doação faz a diferença na vida de quem mais precisa. Junte-se a nós nessa causa
                e ajude a transformar vidas através da solidariedade.
              </p>
              
              {/* Donation button */}
              <Button 
                size="lg" 
                className="mt-8 bg-theme-details text-theme-background hover:bg-theme-details/80 font-bold py-4 px-8 text-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                CLIQUE AQUI PARA FAZER SUA DOAÇÃO
              </Button>
            </CardContent>
          </Card>

          {/* Donors section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent donors */}
            <Card className="bg-theme-surface border-theme-details">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-theme-surface-foreground">
                  Últimos Doadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-theme-background/10">
                      <div>
                        <p className="font-semibold text-theme-surface-foreground">{donor.name}</p>
                        <p className="text-sm text-theme-surface-foreground/70">{donor.date}</p>
                      </div>
                      <p className="font-bold text-theme-surface-foreground">{donor.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top donors ranking */}
            <Card className="bg-theme-surface border-theme-details">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-theme-surface-foreground flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Ranking de Doadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topDonors.map((donor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-theme-background/10">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          donor.position === 1 ? 'bg-yellow-500 text-black' :
                          donor.position === 2 ? 'bg-gray-400 text-black' :
                          donor.position === 3 ? 'bg-orange-600 text-white' :
                          'bg-theme-details/20 text-theme-surface-foreground'
                        }`}>
                          {donor.position}
                        </div>
                        <p className="font-semibold text-theme-surface-foreground">{donor.name}</p>
                      </div>
                      <p className="font-bold text-theme-surface-foreground">{donor.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;