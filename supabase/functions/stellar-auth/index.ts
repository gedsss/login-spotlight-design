import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { StellarSdk } from "npm:stellar-sdk@13.3.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Use a rede de teste para este exemplo
const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

// Armazene os desafios temporariamente (em produção, use um banco de dados)
const challenges = new Map();

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url);
  const path = url.pathname;

  try {
    if (path === '/stellar-auth/challenge' && req.method === 'GET') {
      // Rota 1: Gerar o desafio de autenticação
      const clientDomain = req.headers.get('origin') || 'example.com';
      
      // 1. Crie uma chave de servidor temporária
      const serverKeypair = StellarSdk.Keypair.random();
      
      // 2. Gere um ID de transação único
      const transactionId = crypto.randomUUID();
      
      // 3. Carregue o número de sequência da conta do servidor
      const account = new StellarSdk.Account(serverKeypair.publicKey(), '-1');

      // 4. Construa a transação de desafio
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: '100',
        networkPassphrase: networkPassphrase,
        timebounds: { 
          minTime: 0, 
          maxTime: Math.floor(Date.now() / 1000) + 300 // Expira em 5 minutos
        }
      })
      .addOperation(StellarSdk.Operation.manageData({
        name: `${clientDomain} auth`,
        value: Buffer.from(transactionId)
      }))
      .addMemo(StellarSdk.Memo.text('SEP-10 challenge'))
      .build();
      
      // 5. Assine a transação com a chave do servidor
      transaction.sign(serverKeypair);

      // Armazene o desafio para verificação posterior
      challenges.set(transactionId, {
        serverPublicKey: serverKeypair.publicKey(),
        serverSecretKey: serverKeypair.secret(),
        expires: Date.now() + 300000
      });

      // 6. Envie a transação para o cliente
      return new Response(
        JSON.stringify({
          transaction: transaction.toXDR(),
          transactionId: transactionId
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } else if (path === '/stellar-auth/verify' && req.method === 'POST') {
      // Rota 2: Verificar a assinatura do usuário
      const body = await req.json();
      const { signedTransaction, transactionId } = body;
      
      if (!signedTransaction || !transactionId) {
        return new Response(
          JSON.stringify({ error: 'Transação assinada ou ID não fornecidos.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 1. Decodifique a transação assinada
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedTransaction, networkPassphrase);

      // 2. Valide o tempo de expiração
      if (signedTx.timeBounds && signedTx.timeBounds.maxTime * 1000 < Date.now()) {
        return new Response(
          JSON.stringify({ error: 'Transação expirada.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 3. Verifique o desafio armazenado
      const storedChallenge = challenges.get(transactionId);
      if (!storedChallenge || Date.now() > storedChallenge.expires) {
        return new Response(
          JSON.stringify({ error: 'Desafio inválido ou expirado.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 4. Verifique as assinaturas
      const serverKeypair = StellarSdk.Keypair.fromSecret(storedChallenge.serverSecretKey);
      const userPublicKey = signedTx.source;

      // Verificar se a transação tem as assinaturas corretas
      const serverSignatureValid = signedTx.signatures.some(sig => {
        try {
          return serverKeypair.verify(signedTx.hash(), sig.signature());
        } catch {
          return false;
        }
      });

      const userKeypair = StellarSdk.Keypair.fromPublicKey(userPublicKey);
      const userSignatureValid = signedTx.signatures.some(sig => {
        try {
          return userKeypair.verify(signedTx.hash(), sig.signature());
        } catch {
          return false;
        }
      });

      if (!serverSignatureValid || !userSignatureValid) {
        return new Response(
          JSON.stringify({ error: 'Assinaturas inválidas.' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // 5. Se tudo estiver correto, o login é bem-sucedido
      challenges.delete(transactionId);

      console.log(`Login bem-sucedido para a conta: ${userPublicKey}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Login bem-sucedido para o usuário: ${userPublicKey}`,
          userPublicKey: userPublicKey
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } else {
      return new Response(
        JSON.stringify({ error: 'Rota não encontrada' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Erro na edge function:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})