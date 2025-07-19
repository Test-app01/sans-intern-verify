
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Users, LogOut, Calendar, Mail, User, Award, Hash } from 'lucide-react';
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

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      setIsAuthenticated(true);
      loadInterns();
    } else {
      setShowLogin(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.username.trim() || !loginData.password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setLoginLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-login', {
        body: { username: loginData.username, password: loginData.password }
      });

      if (error || !data.success) {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Store admin session
      localStorage.setItem('adminAuth', JSON.stringify(data.admin));
      setIsAuthenticated(true);
      setShowLogin(false);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin panel",
      });

      loadInterns();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const loadInterns = async () => {
    try {
      const { data, error } = await supabase
        .from('interns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInterns(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load interns",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setShowLogin(true);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleAddIntern = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('add-intern', {
        body: formData
      });

      if (error || !data.success) {
        throw new Error('Failed to add intern');
      }

      toast({
        title: "Intern Added Successfully",
        description: `Certificate ID: ${data.intern.certificate_id} | Verification Code: ${data.intern.verification_code}`,
      });

      // Reset form and reload interns
      setFormData({
        fullName: '',
        email: '',
        role: '',
        startDate: '',
        endDate: ''
      });
      
      await loadInterns();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add intern. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCertificatePDF = (intern: Intern) => {
    // Create a simple certificate content
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
    `;

    // Create a blob with the certificate content
    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${intern.full_name.replace(/\s+/g, '_')}_Certificate.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded",
      description: `Certificate for ${intern.full_name} has been downloaded`,
    });
  };

  // Login form
  if (showLogin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    disabled={loginLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    disabled={loginLoading}
                  />
                </div>

                <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loginLoading}>
                  {loginLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">SANS Media Intern Management</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="add-intern" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="add-intern" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add Intern
            </TabsTrigger>
            <TabsTrigger value="manage-interns" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Manage Interns ({interns.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add-intern">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  Add New Intern
                </CardTitle>
                <CardDescription>
                  Create a new intern profile and generate certificates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddIntern} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Enter full name"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email ID *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Enter email address"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Internship Role *</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        placeholder="e.g., Frontend Development Intern"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Separator />

                  <Button type="submit" variant="gradient" size="lg" className="w-full md:w-auto" disabled={loading}>
                    <Award className="w-4 h-4 mr-2" />
                    {loading ? 'Adding Intern...' : 'Add Intern & Generate Certificate'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-interns">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Manage Interns
                </CardTitle>
                <CardDescription>
                  View and manage all registered interns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {interns.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No interns yet</h3>
                    <p className="text-muted-foreground">Add your first intern to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interns.map((intern) => (
                      <Card key={intern.id} className="bg-card/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{intern.full_name}</h3>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  {intern.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4" />
                                  {intern.role}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4" />
                                  {intern.start_date} to {intern.end_date}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline">
                                  <Hash className="w-3 h-3 mr-1" />
                                  {intern.certificate_id}
                                </Badge>
                                <Badge variant="secondary">
                                  Code: {intern.verification_code}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => generateCertificatePDF(intern)}
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Download Certificate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
