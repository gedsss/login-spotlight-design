import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import freighterApi, { 
  isConnected, 
  isAllowed, 
  requestAccess
} from '@stellar/freighter-api';

const Index = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [userAddress, setUserAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Helper para evitar ficar carregando eternamente
  const withTimeout = <T,>(promise: Promise<T>, ms = 5000, timeoutMessage = 'Tempo esgotado aguardando resposta do Freighter.'): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
      promise.then(
        (val) => { clearTimeout(timer); resolve(val); },
        (err) => { clearTimeout(timer); reject(err); }
      );
    });
  };

  // Tenta usar getPublicKey; se indisponível, faz fallback para getAddress
  const fetchPublicKey = async (): Promise<string> => {
    try {
      const maybeGetPublicKey = (freighterApi as any).getPublicKey;
      if (typeof maybeGetPublicKey === 'function') {
        const pk = await withTimeout<string>(maybeGetPublicKey(), 5000, 'Tempo esgotado aguardando resposta do Freighter.');
        if (pk) return pk;
      }
    } catch (_e) {
      // Ignora e tenta fallback
    }

    const addressResult = await withTimeout<any>((freighterApi as any).getAddress(), 5000, 'Tempo esgotado aguardando resposta do Freighter.');
    if (addressResult?.address) return addressResult.address;
    throw new Error('Não foi possível obter a chave pública da carteira.');
  };
  const connectFreighter = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage('');
    
    try {
      // Verificar se Freighter está instalado
      const connected = await isConnected();
      if (!connected) {
        throw new Error('Freighter não está instalado. Por favor, instale a extensão Freighter.');
      }

      // Verificar se já temos permissão
      const allowed = await isAllowed();
      if (!allowed) {
        // Solicitar acesso com timeout para evitar travar
        const accessResult = await withTimeout(requestAccess(), 5000, 'Tempo esgotado aguardando permissão do Freighter.');
        if (!accessResult) {
          throw new Error('Acesso negado pelo usuário.');
        }
      }

      // Obter chave pública do usuário (com timeout e fallback)
      const publicKey = await fetchPublicKey();
      if (!publicKey) {
        throw new Error('Não foi possível obter a chave pública da carteira.');
      }

      setUserAddress(publicKey);
      setConnectionStatus('connected');
      
      // Aguardar um pouco antes de navegar
      setTimeout(() => {
        navigate('/donation');
      }, 1500);
      
    } catch (error: any) {
      console.error('Erro ao conectar com Freighter:', error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Erro desconhecido ao conectar com Freighter');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-theme-background overflow-hidden">
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

      {/* Freighter Connection Box */}
      <div className="relative z-10 bg-theme-surface text-theme-surface-foreground p-8 rounded-lg shadow-2xl w-96 border-2 border-theme-details/20">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide text-theme-surface-foreground">CONECTE SUA CARTEIRA!</h1>
        
        <div className="space-y-6">
          {connectionStatus === 'idle' && (
            <>
              <div className="text-center space-y-3">
                <Wallet className="mx-auto h-12 w-12 text-theme-details" />
                <p className="text-sm text-theme-surface-foreground">
                  Conecte sua carteira Freighter para fazer doações na rede Stellar
                </p>
              </div>
              
              <Button 
                onClick={connectFreighter}
                disabled={isConnecting}
                className="w-full mt-6 bg-white text-black hover:bg-white/80 font-bold py-3 transition-all duration-300"
              >
                {isConnecting ? 'Conectando...' : 'Conectar Freighter'}
              </Button>
            </>
          )}

          {connectionStatus === 'connecting' && (
            <div className="text-center space-y-3">
              <div className="animate-spin mx-auto h-8 w-8 border-2 border-theme-details border-t-transparent rounded-full"></div>
              <p className="text-sm text-theme-surface-foreground">
                Conectando com Freighter...
              </p>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="text-center space-y-3">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-sm text-theme-surface-foreground">
                Conectado com sucesso!
              </p>
              <p className="text-xs text-theme-surface-foreground/70 break-all">
                {userAddress.slice(0, 8)}{userAddress.slice(-8)}
              </p>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-center space-y-3">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <p className="text-sm text-red-500 mb-2">
                {errorMessage}
              </p>
              <Button 
                onClick={connectFreighter}
                variant="outline"
                className="w-full bg-theme-background border-theme-details text-theme-surface-foreground hover:bg-theme-details hover:text-theme-background"
              >
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
