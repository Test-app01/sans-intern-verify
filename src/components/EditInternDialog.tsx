
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  status?: 'Active' | 'Completed' | 'Revoked';
  created_at: string;
}

interface EditInternDialogProps {
  intern: Intern | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedIntern: Intern) => void;
}

const EditInternDialog: React.FC<EditInternDialogProps> = ({
  intern,
  open,
  onOpenChange,
  onSave
}) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (intern) {
      setFormData({
        full_name: intern.full_name,
        email: intern.email,
        role: intern.role,
        start_date: intern.start_date,
        end_date: intern.end_date
      });
    }
  }, [intern]);

  const handleSave = async () => {
    if (!intern) return;

    if (!formData.full_name || !formData.email || !formData.role || 
        !formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const updatedIntern = {
        ...intern,
        ...formData
      };

      onSave(updatedIntern);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: "Intern details updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update intern details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Intern Details</DialogTitle>
          <DialogDescription>
            Update the intern information below. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="edit-fullName">Full Name *</Label>
            <Input
              id="edit-fullName"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="Enter full name"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="edit-email">Email ID *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Enter email address"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="edit-role">Internship Role *</Label>
            <Input
              id="edit-role"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              placeholder="e.g., Frontend Development Intern"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-startDate">Start Date *</Label>
              <Input
                id="edit-startDate"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="edit-endDate">End Date *</Label>
              <Input
                id="edit-endDate"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditInternDialog;
