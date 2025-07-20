
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CertificateTemplate from './CertificateTemplate';

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

interface CertificatePreviewDialogProps {
  intern: Intern | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CertificatePreviewDialog: React.FC<CertificatePreviewDialogProps> = ({
  intern,
  open,
  onOpenChange
}) => {
  if (!intern) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Certificate Preview</DialogTitle>
          <DialogDescription>
            Preview of {intern.full_name}'s certificate
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center py-4">
          <div className="transform scale-75 origin-center">
            <CertificateTemplate
              fullName={intern.full_name}
              role={intern.role}
              startDate={intern.start_date}
              endDate={intern.end_date}
              certificateId={intern.certificate_id}
              verificationCode={intern.verification_code}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificatePreviewDialog;
