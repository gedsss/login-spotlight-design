import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Donation = () => {
  const recentDonors = [
    { name: "Maria Silva", amount: "R$ 50,00", date: "Hoje" },
    { name: "João Santos", amount: "R$ 100,00", date: "Ontem" },
    { name: "Ana Costa", amount: "R$ 25,00", date: "2 dias atrás" },
    { name: "Pedro Lima", amount: "R$ 75,00", date: "3 dias atrás" },
  ];

  const ranking = [
    { position: 1, name: "João Santos", amount: "R$ 500,00" },
    { position: 2, name: "Maria Silva", amount: "R$ 350,00" },
    { position: 3, name: "Ana Costa", amount: "R$ 200,00" },
    { position: 4, name: "Pedro Lima", amount: "R$ 150,00" },
    { position: 5, name: "Carlos Oliveira", amount: "R$ 100,00" },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-theme-bg text-theme-text overflow-hidden">
      <ThemeToggle />
      
      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-40">
        <svg
          className="w-full h-full"
          viewBox="0 0 1920 1080"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-theme-text hover:text-theme-details transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Login
        </Link>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold tracking-wide">PROJETO DE DOAÇÃO</h1>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg leading-relaxed">
                Nosso projeto tem como objetivo ajudar famílias em situação de vulnerabilidade social, 
                fornecendo apoio essencial através de doações da comunidade. Cada contribuição faz a 
                diferença na vida de quem mais precisa. Juntos, podemos construir um futuro melhor 
                para todos.
              </p>
            </div>

            <Button 
              className="bg-theme-details text-theme-bg hover:opacity-80 font-bold py-4 px-8 text-lg transition-all duration-300"
              size="lg"
            >
              CLIQUE AQUI PARA FAZER SUA DOAÇÃO
            </Button>
          </div>

          {/* Donors Section */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Recent Donors */}
            <Card className="bg-theme-box text-theme-box-foreground border-theme-details">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center">ÚLTIMOS DOADORES</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDonors.map((donor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded border border-theme-details/20">
                      <div>
                        <p className="font-semibold">{donor.name}</p>
                        <p className="text-sm opacity-70">{donor.date}</p>
                      </div>
                      <p className="font-bold text-theme-details">{donor.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ranking */}
            <Card className="bg-theme-box text-theme-box-foreground border-theme-details">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-center">RANKING DE DOADORES</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ranking.map((donor) => (
                    <div key={donor.position} className="flex items-center justify-between p-3 rounded border border-theme-details/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-theme-details text-theme-bg flex items-center justify-center font-bold">
                          {donor.position}
                        </div>
                        <p className="font-semibold">{donor.name}</p>
                      </div>
                      <p className="font-bold text-theme-details">{donor.amount}</p>
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