import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Payment = () => {
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [sourceSecretKey, setSourceSecretKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionHash, setTransactionHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleTransaction = async () => {
    if (!donorName || !amount || !destinationAddress || !sourceSecretKey) {
      setErrorMessage('Por favor, preencha todos os campos');
      return;
    }

    setIsProcessing(true);
    setTransactionStatus('processing');
    setErrorMessage('');

    try {
      // @ts-ignore  
      const StellarSdk = await import('stellar-sdk');

      // Conectar ao servidor Stellar (usando testnet para desenvolvimento)
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      const networkPassphrase = StellarSdk.Networks.TESTNET;

      // Criar o keypair a partir da chave secreta
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);

      // 1. Carregar a conta de origem
      const account = await server.loadAccount(sourceKeypair.publicKey());

      // 2. Construir a transação com a operação de pagamento
      const transaction = new StellarSdk.TransactionBuilder(account, { 
        fee: StellarSdk.BASE_FEE, 
        networkPassphrase: networkPassphrase 
      })
      .addOperation(StellarSdk.Operation.payment({
        destination: destinationAddress,
        asset: StellarSdk.Asset.native(), // Define que o ativo é o XLM
        amount: amount
      }))
      .setTimeout(30) // Define um tempo limite para a transação
      .build();

      // 3. Assinar a transação
      transaction.sign(sourceKeypair);

      // 4. Enviar a transação para a rede Stellar
      const result = await server.submitTransaction(transaction);
      
      // Salvar doação no banco de dados
      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_name: donorName,
          amount: parseFloat(amount),
          transaction_hash: result.hash
        });

      if (dbError) {
        console.error('Erro ao salvar doação no banco:', dbError);
      }
      
      setTransactionHash(result.hash);
      setTransactionStatus('success');
      console.log('Transação enviada com sucesso! Hash:', result.hash);
      
    } catch (error: any) {
      console.error('Erro ao enviar a transação:', error);
      setTransactionStatus('error');
      setErrorMessage(error.message || 'Erro desconhecido ao processar transação');
    } finally {
      setIsProcessing(false);
    }
  };

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
            <Card className="bg-theme-surface border-theme-details min-h-[350px]">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-center text-theme-surface-foreground flex items-center justify-center">
                <Send className="mr-2 h-6 w-6" />
                Transação Stellar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              <p className="text-center text-theme-surface-foreground text-sm">
                Faça sua doação usando a rede Stellar (XLM). Transações rápidas e com baixas taxas.
              </p>
              
              {transactionStatus === 'idle' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="donorName" className="text-theme-surface-foreground font-semibold">
                      Seu Nome
                    </Label>
                    <Input
                      id="donorName"
                      type="text"
                      placeholder="Digite seu nome"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="bg-theme-background border-theme-details text-theme-surface-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-theme-surface-foreground font-semibold">
                      Quantia (XLM)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="10.00"
                      min="0.0000001"
                      step="0.0000001"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-theme-background border-theme-details text-theme-surface-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-theme-surface-foreground font-semibold">
                      Endereço de Destino
                    </Label>
                    <Input
                      id="destination"
                      type="text"
                      placeholder="GXXX...XXXX"
                      value={destinationAddress}
                      onChange={(e) => setDestinationAddress(e.target.value)}
                      className="bg-theme-background border-theme-details text-theme-surface-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secretKey" className="text-theme-surface-foreground font-semibold">
                      Chave Secreta (Secret Key)
                    </Label>
                    <Input
                      id="secretKey"
                      type="password"
                      placeholder="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      value={sourceSecretKey}
                      onChange={(e) => setSourceSecretKey(e.target.value)}
                      className="bg-theme-background border-theme-details text-theme-surface-foreground"
                    />
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3">
                      <p className="text-red-500 text-sm">{errorMessage}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleTransaction}
                    disabled={isProcessing || !donorName || !amount || !destinationAddress || !sourceSecretKey}
                    size="lg" 
                    className="w-full mt-6 bg-white text-black hover:bg-white/80 font-bold py-4 text-lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    ENVIAR TRANSAÇÃO
                  </Button>
                </div>
              )}

              {transactionStatus === 'processing' && (
                <div className="text-center space-y-4">
                  <div className="animate-spin mx-auto h-12 w-12 border-4 border-theme-details border-t-transparent rounded-full"></div>
                  <p className="text-theme-surface-foreground">
                    Processando transação...
                  </p>
                  <p className="text-sm text-theme-surface-foreground/70">
                    Enviando para a rede Stellar
                  </p>
                </div>
              )}

              {transactionStatus === 'success' && (
                <div className="text-center space-y-4">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <p className="text-green-500 font-semibold">
                    Transação enviada com sucesso!
                  </p>
                  <p className="text-xs text-theme-surface-foreground/70 break-all">
                    Hash: {transactionHash.slice(0, 16)}...{transactionHash.slice(-16)}
                  </p>
                  <Button 
                    onClick={() => {
                      setTransactionStatus('idle');
                      setDonorName('');
                      setAmount('');
                      setDestinationAddress('');
                      setSourceSecretKey('');
                      setTransactionHash('');
                      setErrorMessage('');
                    }}
                    variant="outline"
                    className="bg-theme-background border-theme-details text-theme-surface-foreground hover:bg-theme-details hover:text-theme-background"
                  >
                    Nova Transação
                  </Button>
                </div>
              )}

              {transactionStatus === 'error' && (
                <div className="text-center space-y-4">
                  <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                  <p className="text-red-500 font-semibold">
                    Erro ao processar transação
                  </p>
                  {errorMessage && (
                    <p className="text-sm text-red-500/80 break-words px-4">
                      {errorMessage}
                    </p>
                  )}
                  <Button 
                    onClick={() => {
                      setTransactionStatus('idle');
                      setErrorMessage('');
                    }}
                    variant="outline"
                    className="bg-theme-background border-theme-details text-theme-surface-foreground hover:bg-theme-details hover:text-theme-background"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;