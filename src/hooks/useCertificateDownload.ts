
import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateData {
  fullName: string;
  role: string;
  startDate: string;
  endDate: string;
  certificateId: string;
  verificationCode: string;
}

export const useCertificateDownload = () => {
  const downloadCertificate = useCallback(async (certificateData: CertificateData) => {
    try {
      // Create a temporary container for the certificate
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.height = '600px';
      
      // Create certificate HTML
      tempContainer.innerHTML = `
        <div style="
          width: 800px;
          height: 600px;
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
          position: relative;
          padding: 32px;
          border: 8px solid #F59E0B;
          box-shadow: 0 0 0 4px #8B5CF6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        ">
          <!-- Decorative circles -->
          <div style="position: absolute; top: 16px; left: 16px; width: 16px; height: 16px; background: rgba(196, 181, 253, 0.6); border-radius: 50%;"></div>
          <div style="position: absolute; bottom: 16px; right: 16px; width: 16px; height: 16px; background: rgba(196, 181, 253, 0.6); border-radius: 50%;"></div>
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <div></div>
              <div>
                <h1 style="font-size: 36px; font-weight: bold; color: white; letter-spacing: 0.1em; margin: 0;">SANS MEDIA</h1>
                <p style="font-size: 18px; color: #C4B5FD; margin: 4px 0 0 0;">Digital Innovation & Excellence</p>
              </div>
              <div style="width: 48px; height: 48px; border: 4px solid #F59E0B; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: #F59E0B; font-weight: bold; font-size: 20px;">&</span>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div style="text-align: center; margin-bottom: 32px; margin-top: 48px;">
            <h2 style="font-size: 36px; font-weight: bold; color: #C4B5FD; margin-bottom: 32px; letter-spacing: 0.1em;">
              CERTIFICATE OF EXCELLENCE
            </h2>
            <div style="width: 128px; height: 4px; background: #F59E0B; margin: 0 auto 32px;"></div>
            
            <p style="font-size: 18px; color: white; font-style: italic; margin-bottom: 24px;">This is to certify that</p>
            
            <h3 style="font-size: 48px; font-weight: bold; color: #F59E0B; margin-bottom: 8px; letter-spacing: 0.05em;">
              ${certificateData.fullName}
            </h3>
            <div style="width: 192px; height: 4px; background: #F59E0B; margin: 0 auto 32px;"></div>
            
            <p style="font-size: 18px; color: white; margin-bottom: 16px;">has successfully completed the internship program as</p>
            
            <h4 style="font-size: 24px; font-weight: bold; color: #C4B5FD; margin-bottom: 24px;">
              ${certificateData.role}
            </h4>
            
            <p style="font-size: 18px; color: white;">
              Duration: ${new Date(certificateData.startDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} to ${new Date(certificateData.endDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <!-- Footer -->
          <div style="position: absolute; bottom: 32px; left: 32px; right: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: end; color: white; font-size: 14px;">
              <div>
                <p style="margin: 0 0 4px 0;"><strong>Certificate ID:</strong> ${certificateData.certificateId}</p>
                <p style="margin: 0 0 4px 0;"><strong>Verification Code:</strong> ${certificateData.verificationCode}</p>
                <p style="margin: 0;"><strong>Issued:</strong> ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0 0 4px 0;"><strong>Director, SANS Media</strong></p>
                <p style="margin: 0;">Digital Innovation Department</p>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(tempContainer);

      // Generate canvas from HTML
      const canvas = await html2canvas(tempContainer.firstElementChild as HTMLElement, {
        width: 800,
        height: 600,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#8B5CF6'
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 600]
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);

      // Download PDF
      const fileName = `${certificateData.fullName.replace(/\s+/g, '_')}_Certificate.pdf`;
      pdf.save(fileName);

      return true;
    } catch (error) {
      console.error('Error generating certificate:', error);
      return false;
    }
  }, []);

  return { downloadCertificate };
};
