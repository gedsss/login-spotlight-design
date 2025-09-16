import { User, Trophy, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const ProfileButton = () => {
  const [donorName, setDonorName] = useState('');
  const [userStats, setUserStats] = useState({
    totalXLM: 0,
    tokens: 0,
    donationCount: 0
  });
  const [isOpen, setIsOpen] = useState(false);

  // Load saved donor name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('donorName');
    if (savedName) {
      setDonorName(savedName);
      fetchUserStats(savedName);
    }
  }, []);

  const fetchUserStats = async (name: string) => {
    if (!name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('donations')
        .select('amount')
        .eq('donor_name', name.trim());

      if (error) throw error;

      const totalXLM = data?.reduce((sum, donation) => sum + Number(donation.amount), 0) || 0;
      const tokens = Math.floor(totalXLM / 10);

      setUserStats({
        totalXLM,
        tokens,
        donationCount: data?.length || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
    }
  };

  const handleNameSubmit = () => {
    if (donorName.trim()) {
      localStorage.setItem('donorName', donorName.trim());
      fetchUserStats(donorName.trim());
    }
  };

  const handleNameChange = (value: string) => {
    setDonorName(value);
    if (value.trim()) {
      localStorage.setItem('donorName', value.trim());
      fetchUserStats(value.trim());
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-16 z-50 bg-theme-surface border-theme-details text-theme-details hover:bg-theme-details hover:text-theme-surface"
        >
          <User className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-theme-surface border-theme-details">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-theme-surface-foreground flex items-center">
              <User className="mr-2 h-5 w-5" />
              Meu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-surface-foreground">
                Digite seu nome:
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Seu nome aqui..."
                  value={donorName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="bg-theme-background border-theme-details text-theme-surface-foreground"
                />
                <Button
                  onClick={handleNameSubmit}
                  size="sm"
                  className="bg-theme-details text-theme-surface hover:bg-theme-details/80"
                >
                  OK
                </Button>
              </div>
            </div>

            {donorName.trim() && (
              <div className="space-y-3 pt-4 border-t border-theme-details/20">
                <div className="flex items-center justify-between p-3 rounded-lg bg-theme-background/20">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="text-theme-surface-foreground font-medium">Total XLM Doados</span>
                  </div>
                  <span className="font-bold text-theme-surface-foreground">
                    {userStats.totalXLM.toFixed(2)} XLM
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-theme-background/20">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-blue-500" />
                    <span className="text-theme-surface-foreground font-medium">Tokens Ganhos</span>
                  </div>
                  <span className="font-bold text-theme-surface-foreground">
                    {userStats.tokens} tokens
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-theme-background/20">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-green-500" />
                    <span className="text-theme-surface-foreground font-medium">Doações Realizadas</span>
                  </div>
                  <span className="font-bold text-theme-surface-foreground">
                    {userStats.donationCount}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <p className="text-xs text-theme-surface-foreground/80 text-center">
                    💡 Você ganha 1 token a cada 10 XLM doados!
                  </p>
                  <p className="text-xs text-theme-surface-foreground/80 text-center mt-1">
                    Próximo token em: {(10 - (userStats.totalXLM % 10)).toFixed(2)} XLM
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};