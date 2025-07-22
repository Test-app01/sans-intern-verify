import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Edit, Trash2, Eye, FileText, Share2 } from 'lucide-react';
import { EditInternDialog } from './EditInternDialog';
import { CertificatePreviewDialog } from './CertificatePreviewDialog';
import { useToast } from '@/hooks/use-toast';
import { useCertificateDownload } from '@/hooks/useCertificateDownload';
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
  status: string;
  created_at: string;
}

interface InternTableProps {
  interns: Intern[];
  onUpdate: () => void;
}

export const InternTable: React.FC<InternTableProps> = ({ interns, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingIntern, setEditingIntern] = useState<Intern | null>(null);
  const [previewIntern, setPreviewIntern] = useState<Intern | null>(null);
  const [deletingIntern, setDeletingIntern] = useState<string | null>(null);
  const { toast } = useToast();
  const { downloadCertificate } = useCertificateDownload();

  const filteredInterns = interns.filter(intern => {
    const matchesSearch = intern.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         intern.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || intern.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (internId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('interns')
        .update({ status: newStatus })
        .eq('id', internId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Intern status has been updated to ${newStatus}`,
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (internId: string, internName: string) => {
    if (!confirm(`Are you sure you want to delete ${internName}? This action cannot be undone.`)) {
      return;
    }

    setDeletingIntern(internId);

    try {
      const { data, error } = await supabase.functions.invoke('delete-intern', {
        body: { internId }
      });

      if (error) {
        console.error('Error calling delete function:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to delete intern');
      }

      toast({
        title: "Intern Deleted",
        description: `${internName} has been removed from the system`,
      });

      onUpdate();
    } catch (error) {
      console.error('Error deleting intern:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete intern",
        variant: "destructive"
      });
    } finally {
      setDeletingIntern(null);
    }
  };

  const handleDownloadCertificate = async (intern: Intern) => {
    const success = await downloadCertificate({
      fullName: intern.full_name,
      role: intern.role,
      startDate: intern.start_date,
      endDate: intern.end_date,
      certificateId: intern.certificate_id,
      verificationCode: intern.verification_code
    });

    if (success) {
      toast({
        title: "Certificate Downloaded",
        description: `PDF certificate for ${intern.full_name} has been downloaded`,
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Failed to generate certificate PDF",
        variant: "destructive"
      });
    }
  };

  const handleShareCertificate = async (intern: Intern) => {
    const shareUrl = `${window.location.origin}/intern/${intern.verification_code}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Certificate verification link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Start Date', 'End Date', 'Certificate ID', 'Verification Code', 'Status', 'Created Date'],
      ...filteredInterns.map(intern => [
        intern.full_name,
        intern.email,
        intern.role,
        intern.start_date,
        intern.end_date,
        intern.certificate_id,
        intern.verification_code,
        intern.status || 'Active',
        new Date(intern.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interns-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Intern data has been exported to CSV",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="default">Completed</Badge>;
      case 'Revoked':
        return <Badge variant="destructive">Revoked</Badge>;
      default:
        return <Badge variant="secondary">Active</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Manage Interns ({filteredInterns.length})</span>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardTitle>
        
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredInterns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No interns found matching your criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Certificate ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInterns.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell className="font-medium">{intern.full_name}</TableCell>
                  <TableCell>{intern.email}</TableCell>
                  <TableCell>{intern.role}</TableCell>
                  <TableCell className="text-sm">
                    {intern.start_date} to {intern.end_date}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{intern.certificate_id}</TableCell>
                  <TableCell>
                    <Select
                      value={intern.status || 'Active'}
                      onValueChange={(value) => handleStatusChange(intern.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Revoked">Revoked</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewIntern(intern)}
                        title="Preview Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadCertificate(intern)}
                        title="Download Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShareCertificate(intern)}
                        title="Share Certificate"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingIntern(intern)}
                        title="Edit Intern"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(intern.id, intern.full_name)}
                        title="Delete Intern"
                        disabled={deletingIntern === intern.id}
                      >
                        <Trash2 className={`w-4 h-4 text-destructive ${deletingIntern === intern.id ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {editingIntern && (
        <EditInternDialog
          intern={editingIntern}
          open={!!editingIntern}
          onOpenChange={(open) => !open && setEditingIntern(null)}
          onUpdate={onUpdate}
        />
      )}

      {previewIntern && (
        <CertificatePreviewDialog
          intern={previewIntern}
          open={!!previewIntern}
          onOpenChange={(open) => !open && setPreviewIntern(null)}
        />
      )}
    </Card>
  );
};
