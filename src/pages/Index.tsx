import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TransactionBuilder, Networks } from 'stellar-sdk';
import { Wallet, CheckCircle, AlertCircle, Key, Shield } from "lucide-react";
import { isConnected, signTransaction } from '@stellar/freighter-api';
import { toast } from '@/hooks/use-toast';

type ConnectionStatus = 'idle' | 'connecting' | 'challenge' | 'verifying' | 'connected' | 'error';

const Index = () => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [userAddress, setUserAddress] = useState<string>('');
  const [publicKeyInput, setPublicKeyInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [challengeData, setChallengeData] = useState<{transaction: string, transactionId: string} | null>(null);

  const EDGE_FUNCTION_URL = 'https://coguyaxzvbakmypoxiuh.supabase.co/functions/v1/stellar-auth';

  // Gerar desafio de autenticação SEP-10
  const generateChallenge = async () => {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/challenge`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar desafio de autenticação');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao gerar desafio:', error);
      throw error;
    }
  };

  // Verificar a transação assinada
  const verifyChallenge = async (signedXdr: string, transactionId: string) => {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signedTransaction: signedXdr,
          transactionId: transactionId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao verificar autenticação');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao verificar desafio:', error);
      throw error;
    }
  };

  // Iniciar processo de autenticação SEP-10
  const startAuthentication = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setErrorMessage('');

    // Timeout de 5 segundos para verificar Freighter
    const connectionTimeout = setTimeout(() => {
      setIsConnecting(false);
      setConnectionStatus('error');
      setErrorMessage('Tempo esgotado. A conexão com Freighter demorou mais de 5 segundos.');
    }, 5000);

    try {
      // Verificar se Freighter está instalado
      const connected = await Promise.race([
        isConnected(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: Freighter não respondeu')), 3000)
        )
      ]);

      if (!connected) {
        throw new Error('Freighter não está instalado. Por favor, instale a extensão Freighter.');
      }

      clearTimeout(connectionTimeout);

      // Gerar desafio SEP-10
      const challenge = await generateChallenge();
      setChallengeData(challenge);
      setConnectionStatus('challenge');
      setIsConnecting(false);

      toast({
        title: "Desafio gerado",
        description: "Agora assine a transação com sua carteira Freighter",
      });

    } catch (error: any) {
      clearTimeout(connectionTimeout);
      console.error('Erro ao iniciar autenticação:', error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Erro desconhecido ao conectar com Freighter');
      setIsConnecting(false);
    }
  };

  // Assinar e verificar o desafio
  const signAndVerifyChallenge = async () => {
    if (!challengeData) {
      setErrorMessage('Nenhum desafio encontrado');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('verifying');
    setErrorMessage('');

    try {
      // Assinar a transação com Freighter
      const signedResult = await signTransaction(challengeData.transaction, {
        networkPassphrase: Networks.TESTNET,
        address: publicKeyInput.trim()
      });

      // Verificar a assinatura no backend
      const verificationResult = await verifyChallenge(signedResult.signedTxXdr, challengeData.transactionId);

      if (verificationResult.success) {
        setUserAddress(verificationResult.userPublicKey);
        setConnectionStatus('connected');
        
        toast({
          title: "Autenticação bem-sucedida!",
          description: `Conectado como: ${verificationResult.userPublicKey.slice(0, 8)}...${verificationResult.userPublicKey.slice(-8)}`,
        });

        // Navegar para a página de doação após 2 segundos
        setTimeout(() => {
          navigate('/donation');
        }, 2000);
      } else {
        throw new Error('Falha na verificação da autenticação');
      }

    } catch (error: any) {
      console.error('Erro ao assinar/verificar desafio:', error);
      setConnectionStatus('error');
      setErrorMessage(error.message || 'Erro ao processar autenticação');
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

      {/* SEP-10 Authentication Box */}
      <div className="relative z-10 bg-theme-surface text-theme-surface-foreground p-8 rounded-lg shadow-2xl w-96 border-2 border-theme-details/20">
        <h1 className="text-2xl font-bold text-center mb-6 tracking-wide text-theme-surface-foreground">AUTENTICAÇÃO STELLAR</h1>
        
        <div className="space-y-6">
          {connectionStatus === 'idle' && (
            <>
              <div className="text-center space-y-3">
                <Shield className="mx-auto h-12 w-12 text-theme-details" />
                <p className="text-sm text-theme-surface-foreground">
                  Autentique-se usando o protocolo SEP-10 da rede Stellar
                </p>
              </div>
              
              <Button 
                onClick={startAuthentication}
                disabled={isConnecting}
                className="w-full mt-6 bg-white text-black hover:bg-white/80 font-bold py-3 transition-all duration-300"
              >
                {isConnecting ? 'Conectando...' : 'Iniciar Autenticação'}
              </Button>
            </>
          )}

          {connectionStatus === 'connecting' && (
            <div className="text-center space-y-3">
              <div className="animate-spin mx-auto h-8 w-8 border-2 border-theme-details border-t-transparent rounded-full"></div>
              <p className="text-sm text-theme-surface-foreground">
                Verificando Freighter e gerando desafio...
              </p>
            </div>
          )}

          {connectionStatus === 'challenge' && (
            <div className="text-center space-y-4">
              <Key className="mx-auto h-12 w-12 text-theme-details" />
              <div className="space-y-3">
                <p className="text-sm text-theme-surface-foreground">
                  Desafio gerado com sucesso!
                </p>
                <p className="text-xs text-theme-surface-foreground/70">
                  Digite sua chave pública e assine a transação:
                </p>
              </div>
              
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={publicKeyInput}
                  onChange={(e) => {
                    setPublicKeyInput(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full text-xs"
                />
                {errorMessage && (
                  <p className="text-xs text-red-500">{errorMessage}</p>
                )}
                <Button 
                  onClick={signAndVerifyChallenge}
                  disabled={isConnecting}
                  className="w-full bg-white text-black hover:bg-white/80 font-bold py-3 transition-all duration-300"
                >
                  {isConnecting ? 'Verificando...' : 'Assinar e Autenticar'}
                </Button>
              </div>
            </div>
          )}

          {connectionStatus === 'verifying' && (
            <div className="text-center space-y-3">
              <div className="animate-spin mx-auto h-8 w-8 border-2 border-theme-details border-t-transparent rounded-full"></div>
              <p className="text-sm text-theme-surface-foreground">
                Verificando assinatura...
              </p>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="text-center space-y-3">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="text-sm text-theme-surface-foreground">
                Autenticação bem-sucedida!
              </p>
              <p className="text-xs text-theme-surface-foreground/70 break-all">
                {userAddress.slice(0, 8)}...{userAddress.slice(-8)}
              </p>
              <p className="text-xs text-theme-surface-foreground/70">
                Redirecionando...
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
                onClick={startAuthentication}
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