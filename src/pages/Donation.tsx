import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileButton } from "@/components/ProfileButton";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Donation = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [recentDonors, setRecentDonors] = useState<any[]>([]);
  const [topDonors, setTopDonors] = useState<any[]>([]);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  
  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    try {
      // Fetch recent donors (last 5 donations) - join with profiles to get donor names
      const { data: recentData, error: recentError } = await supabase
        .from('donations')
        .select(`
          amount,
          created_at,
          profiles!inner(donor_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Fetch all donations with profiles for top donors calculation
      const { data: topData, error: topError } = await supabase
        .from('donations')
        .select(`
          amount,
          profiles!inner(donor_name)
        `);

      if (topError) throw topError;

      // Process recent donors
      const formattedRecent = recentData?.map(donation => ({
        name: (donation.profiles as any)?.donor_name || 'Anônimo',
        amount: `${donation.amount} XLM`,
        date: formatDate(donation.created_at)
      })) || [];

      // Process and group top donors
      const donorTotals = (topData || []).reduce((acc: any, donation) => {
        const donorName = (donation.profiles as any)?.donor_name || 'Anônimo';
        if (acc[donorName]) {
          acc[donorName] += Number(donation.amount);
        } else {
          acc[donorName] = Number(donation.amount);
        }
        return acc;
      }, {});

      const sortedDonors = Object.entries(donorTotals)
        .sort(([,a]: any, [,b]: any) => b - a)
        .slice(0, 5)
        .map(([name, amount]: any, index) => ({
          name,
          amount: `${amount} XLM`,
          position: index + 1
        }));

      setRecentDonors(formattedRecent);
      setTopDonors(sortedDonors);
    } catch (error) {
      console.error('Erro ao buscar doações:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return 'Hoje';
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-theme-details" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="relative min-h-screen w-full bg-theme-background overflow-hidden">
      <ThemeToggle />
      <ProfileButton />
      
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
          <Button variant="outline" className="mb-6 bg-transparent border-theme-details text-theme-details hover:bg-theme-details hover:text-theme-background">
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
              <Link to="/payment">
                <Button 
                  size="lg" 
                  className="mt-8 bg-white text-black hover:bg-white/80 font-bold py-4 px-8 text-lg"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  CLIQUE AQUI PARA FAZER SUA DOAÇÃO
                </Button>
              </Link>
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