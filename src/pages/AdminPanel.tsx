
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Users, LogOut, User, Award, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { InternTable } from '@/components/InternTable';

interface Intern {
  id: string;
  full_name: string;
  email: string;
  role: string;
  start_date: string;
  end_date: string;
  certificate_id: string;
  verification_code: string;
  status: string;
  created_at: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
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
      
      // Map the data to ensure status field is present with default value
      const internsWithStatus = (data || []).map(intern => ({
        ...intern,
        status: intern.status || 'Active'
      }));
      
      setInterns(internsWithStatus);
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
    setLoginData({ username: '', password: '' });
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

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md px-6">
          <Card className="bg-card border-border shadow-2xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-foreground" />
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
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      className="pl-10"
                      disabled={loginLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="pl-10"
                      disabled={loginLoading}
                    />
                  </div>
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
            <InternTable interns={interns} onUpdate={loadInterns} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
