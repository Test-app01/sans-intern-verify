
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Share2, ArrowLeft, Calendar, Mail, User, Award, CheckCircle, FileText, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Intern {
  id: string;
  full_name: string;
  email: string;
  role: string;
  start_date: string;
  end_date: string;
  certificate_id: string;
  verification_code: string;
  created_at: string;
}

const InternProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [intern, setIntern] = useState<Intern | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntern();
  }, [code]);

  const loadIntern = async () => {
    if (!code) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('interns')
        .select('*')
        .or(`verification_code.eq.${code},certificate_id.eq.${code}`)
        .single();

      if (error || !data) {
        setIntern(null);
      } else {
        setIntern(data);
      }
    } catch (error) {
      setIntern(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = () => {
    if (!intern) return;

    // Create certificate content
    const certificateContent = `
CERTIFICATE OF COMPLETION

This is to certify that

${intern.full_name}

has successfully completed the internship program as

${intern.role}

From: ${new Date(intern.start_date).toLocaleDateString()}
To: ${new Date(intern.end_date).toLocaleDateString()}

Certificate ID: ${intern.certificate_id}
Verification Code: ${intern.verification_code}

SANS Media
Digital Innovation & Excellence

This certificate can be verified at: ${window.location.origin}/intern/${intern.verification_code}
    `;

    // Create and download the file
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${intern.full_name.replace(/\s+/g, '_')}_Certificate.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully",
    });
  };

  const handleShareCertificate = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${intern?.full_name} - SANS Media Certificate`,
          text: `Verify this internship certificate from SANS Media`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Certificate link copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Certificate link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (!intern) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Certificate Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The verification code "{code}" was not found in our system. Please check the code and try again.
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Verification Status */}
          <Card className="mb-8 border-success bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <h2 className="text-xl font-semibold text-success">Certificate Verified ✓</h2>
                  <p className="text-muted-foreground">This certificate is authentic and issued by SANS Media</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intern Details */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">{intern.full_name}</CardTitle>
                  <CardDescription>Internship Certificate Details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Position</p>
                        <p className="text-muted-foreground">{intern.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground">{intern.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-muted-foreground">
                          {new Date(intern.start_date).toLocaleDateString()} - {new Date(intern.end_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Certificate ID</p>
                        <p className="text-muted-foreground font-mono">{intern.certificate_id}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Verification Details</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        Code: {intern.verification_code}
                      </Badge>
                      <Badge variant="secondary">
                        Verified
                      </Badge>
                      <Badge variant="outline">
                        SANS Media Official
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Certificate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="w-full"
                    onClick={handleDownloadCertificate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full"
                    onClick={handleShareCertificate}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Certificate
                  </Button>
                </CardContent>
              </Card>

              {/* Certificate Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Certificate preview will be shown here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issuer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Issued By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">&</span>
                    </div>
                    <div>
                      <p className="font-semibold">SANS Media</p>
                      <p className="text-sm text-muted-foreground">Digital Innovation & Excellence</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">
                    This certificate has been digitally verified and is authentic.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternProfile;
