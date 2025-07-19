import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserPlus, Users, LogOut, Calendar, Mail, User, Award, Hash, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Intern {
  id: string;
  fullName: string;
  email: string;
  role: string;
  startDate: string;
  endDate: string;
  certificateId: string;
  verificationCode: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admit');
      return;
    }

    // Load existing interns from localStorage (demo data)
    const savedInterns = localStorage.getItem('sans-interns');
    if (savedInterns) {
      setInterns(JSON.parse(savedInterns));
    }
  }, [navigate]);

  const generateId = () => {
    return 'SM' + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const handleAddIntern = (e: React.FormEvent) => {
    e.preventDefault();
    
    const certificateId = generateId();
    const verificationCode = generateId();
    
    const newIntern: Intern = {
      id: Date.now().toString(),
      ...formData,
      certificateId,
      verificationCode
    };

    const updatedInterns = [...interns, newIntern];
    setInterns(updatedInterns);
    localStorage.setItem('sans-interns', JSON.stringify(updatedInterns));
    
    toast({
      title: "Intern Added Successfully",
      description: `Certificate ID: ${certificateId} | Verification Code: ${verificationCode}`,
    });

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      role: '',
      startDate: '',
      endDate: ''
    });
  };

  const generateCertificate = (intern: Intern) => {
    toast({
      title: "Certificate Generated",
      description: `PDF certificate for ${intern.fullName} is ready for download`,
    });
    // This will be implemented with PDF generation library
  };

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
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-3">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Enter full name"
                        required
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
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="role">Internship Role *</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        placeholder="e.g., Frontend Development Intern"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Certificate ID</Label>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <p className="text-sm text-muted-foreground">Auto-generated SMxxxx format</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          Generate
                        </Button>
                      </div>

                      <div>
                        <Label>Verification Code</Label>
                        <div className="p-3 bg-muted/30 rounded-md">
                          <p className="text-sm text-muted-foreground">Auto-generated SMxxxx format</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-2">
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <Button type="submit" variant="gradient" size="lg" className="w-full md:w-auto">
                    <Award className="w-4 h-4 mr-2" />
                    Add Intern & Generate Certificate
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
                              <h3 className="font-semibold text-lg">{intern.fullName}</h3>
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
                                  {intern.startDate} to {intern.endDate}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="outline">
                                  <Hash className="w-3 h-3 mr-1" />
                                  {intern.certificateId}
                                </Badge>
                                <Badge variant="secondary">
                                  Code: {intern.verificationCode}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="accent"
                              size="sm"
                              onClick={() => generateCertificate(intern)}
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Generate PDF
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