
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Calendar,
  Mail,
  User,
  Hash,
  FileDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Intern {
  id: string;
  full_name: string;
  email: string;
  role: string;
  start_date: string;
  end_date: string;
  certificate_id: string;
  verification_code: string;
  status: 'Active' | 'Completed' | 'Revoked';
  created_at: string;
}

interface InternTableProps {
  interns: Intern[];
  onEdit: (intern: Intern) => void;
  onDelete: (id: string) => void;
  onDownloadCertificate: (intern: Intern) => void;
  onPreviewCertificate: (intern: Intern) => void;
  onShareCertificate: (intern: Intern) => void;
  onStatusChange: (id: string, status: 'Active' | 'Completed' | 'Revoked') => void;
  onExportCSV: () => void;
}

const InternTable: React.FC<InternTableProps> = ({
  interns,
  onEdit,
  onDelete,
  onDownloadCertificate,
  onPreviewCertificate,
  onShareCertificate,
  onStatusChange,
  onExportCSV
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Revoked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeleteId(null);
    toast({
      title: "Intern Deleted",
      description: "The intern record has been successfully deleted.",
    });
  };

  const handleShare = async (intern: Intern) => {
    const shareUrl = `${window.location.origin}/intern/${intern.verification_code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${intern.full_name} - Certificate`,
          text: `Certificate for ${intern.full_name} - ${intern.role}`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Certificate link has been copied to clipboard.",
        });
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Certificate link has been copied to clipboard.",
      });
    }
  };

  if (interns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No interns yet</h3>
          <p className="text-muted-foreground">Add your first intern to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Intern Management</CardTitle>
          <Button onClick={onExportCSV} variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Certificate ID</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interns.map((intern) => (
                <TableRow key={intern.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{intern.full_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {intern.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{intern.role}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {intern.start_date}
                      </div>
                      <div className="text-muted-foreground">
                        to {intern.end_date}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Badge className={getStatusColor(intern.status || 'Active')}>
                            {intern.status || 'Active'}
                          </Badge>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onStatusChange(intern.id, 'Active')}>
                          Active
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(intern.id, 'Completed')}>
                          Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusChange(intern.id, 'Revoked')}>
                          Revoked
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      <code className="text-xs">{intern.certificate_id}</code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onPreviewCertificate(intern)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownloadCertificate(intern)}>
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare(intern)}>
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Certificate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(intern)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(intern.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the intern record
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InternTable;
