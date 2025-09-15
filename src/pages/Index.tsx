import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-theme-bg overflow-hidden">
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

      {/* Login box */}
      <div className="relative z-10 bg-theme-box text-theme-box-foreground p-8 rounded-lg shadow-2xl w-96 border-2 border-theme-details/20">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide">ENTRE COM SUA CONTA!</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-theme-box-foreground font-semibold">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Digite seu email"
              className="bg-white text-gray-900 border-gray-300 focus:border-golden focus:ring-golden"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-theme-box-foreground font-semibold">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Digite sua senha"
              className="bg-white text-gray-900 border-gray-300 focus:border-golden focus:ring-golden"
            />
          </div>
          
          <div className="space-y-4">
            <Button className="w-full bg-theme-details text-theme-bg hover:opacity-80 font-bold py-3 transition-all duration-300">
              Entrar
            </Button>
            
            <Link to="/donation" className="block">
              <Button variant="outline" className="w-full border-theme-details text-theme-details hover:bg-theme-details hover:text-theme-bg font-bold py-3 transition-all duration-300">
                Ver Projeto de Doação
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
