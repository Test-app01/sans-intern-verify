import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Search, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a verification code",
        variant: "destructive"
      });
      return;
    }

    // For now, we'll simulate verification - later this will connect to your database
    if (verificationCode === 'SM1234') {
      navigate(`/intern/SM1234`);
    } else {
      toast({
        title: "Invalid Code",
        description: "The verification code you entered was not found in our system.",
        variant: "destructive"
      });
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

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Secure Verification</CardTitle>
              <CardDescription>
                Advanced security measures ensure certificate authenticity
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <Search className="w-12 h-12 text-accent mx-auto mb-4" />
              <CardTitle>Quick Lookup</CardTitle>
              <CardDescription>
                Instantly verify certificates using unique verification codes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 border-border hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <Award className="w-12 h-12 text-success mx-auto mb-4" />
              <CardTitle>Trusted Credentials</CardTitle>
              <CardDescription>
                Official certificates backed by SANS Media's reputation
              </CardDescription>
            </CardHeader>
          </Card>
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
                  />
                </div>
                <Button type="submit" variant="gradient" size="lg" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Verify Certificate
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