import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="bg-login text-login-foreground p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">ENTRE COM SUA CONTA!</h1>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-login-foreground">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Digite seu email"
              className="bg-white text-gray-900 border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-login-foreground">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Digite sua senha"
              className="bg-white text-gray-900 border-gray-300"
            />
          </div>
          
          <Button className="w-full mt-6 bg-black text-white hover:bg-gray-800">
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
