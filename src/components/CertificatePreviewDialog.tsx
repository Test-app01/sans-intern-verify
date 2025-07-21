
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Share2 } from 'lucide-react';
import { CertificateTemplate } from './CertificateTemplate';
import { useCertificateDownload } from '@/hooks/useCertificateDownload';
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
  status: string;
  created_at: string;
}

interface CertificatePreviewDialogProps {
  intern: Intern;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CertificatePreviewDialog: React.FC<CertificatePreviewDialogProps> = ({
  intern,
  open,
  onOpenChange,
}) => {
  const { downloadCertificate } = useCertificateDownload();
  const { toast } = useToast();

  const handleDownload = async () => {
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

  const handleShare = async () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Certificate Preview - {intern.full_name}</span>
            <div className="flex gap-2">
              <Button onClick={handleShare} variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={handleDownload} variant="default" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="border rounded-lg p-4 bg-white">
          <CertificateTemplate
            fullName={intern.full_name}
            role={intern.role}
            startDate={intern.start_date}
            endDate={intern.end_date}
            certificateId={intern.certificate_id}
            verificationCode={intern.verification_code}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
