
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a verification code",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data: intern, error } = await supabase
        .from('interns')
        .select('*')
        .or(`verification_code.eq.${verificationCode},certificate_id.eq.${verificationCode}`)
        .single();

      if (error || !intern) {
        toast({
          title: "Invalid Code",
          description: "The verification code you entered was not found in our system.",
          variant: "destructive"
        });
        return;
      }

      navigate(`/intern/${verificationCode}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">&</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SANS MEDIA</h1>
                <p className="text-sm text-muted-foreground">Digital Innovation & Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Intern Verification Portal
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Verify the authenticity of SANS Media internship certificates and credentials
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-md mx-auto">
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verify Certificate</CardTitle>
              <CardDescription>
                Enter the verification code found on your certificate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Enter verification code (e.g., SM1234)"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                    className="text-center text-lg font-mono"
                    disabled={loading}
                  />
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? 'Verifying...' : 'Verify Certificate'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
