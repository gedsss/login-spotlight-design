import { User, Trophy, Coins, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const ProfileButton = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ donor_name: string | null } | null>(null);
  const [userStats, setUserStats] = useState({
    totalXLM: 0,
    tokens: 0,
    donationCount: 0
  });
  const [isOpen, setIsOpen] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('donor_name')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
      setDonorName(data?.donor_name || "");
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('amount')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user stats:', error);
        return;
      }

      if (data) {
        const totalXLM = data.reduce((sum, donation) => sum + Number(donation.amount), 0);
        const tokens = Math.floor(totalXLM / 10);
        const donationCount = data.length;

        setUserStats({
          totalXLM,
          tokens,
          donationCount
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUpdateDonorName = async () => {
    if (!user || !donorName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          donor_name: donorName.trim() 
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Nome do doador atualizado com sucesso.",
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar nome do doador.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sucesso!",
        description: "Logout realizado com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-theme-surface-foreground flex items-center">
                <User className="mr-2 h-5 w-5" />
                Meu Perfil
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-theme-surface-foreground/70 hover:text-theme-surface-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-surface-foreground">
                Nome do doador:
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Digite seu nome de doador"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="bg-theme-background border-theme-details text-theme-surface-foreground"
                />
                <Button
                  onClick={handleUpdateDonorName}
                  size="sm"
                  disabled={!donorName.trim() || isUpdating}
                  className="bg-theme-details text-theme-surface hover:bg-theme-details/80"
                >
                  {isUpdating ? "..." : "OK"}
                </Button>
              </div>
            </div>

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
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};