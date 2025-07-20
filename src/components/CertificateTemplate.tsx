
import React from 'react';

interface CertificateTemplateProps {
  fullName: string;
  role: string;
  startDate: string;
  endDate: string;
  certificateId: string;
  verificationCode: string;
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  fullName,
  role,
  startDate,
  endDate,
  certificateId,
  verificationCode
}) => {
  return (
    <div 
      id="certificate-template"
      className="w-[800px] h-[600px] bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative p-6 mx-auto"
      style={{
        backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
        border: '8px solid #F59E0B',
        boxShadow: '0 0 0 4px #8B5CF6'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-4 left-4 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
      <div className="absolute bottom-4 left-4 w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-3">
          <div></div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wider">SANS MEDIA</h1>
            <p className="text-base text-purple-200 mt-1">Digital Innovation & Excellence</p>
          </div>
          <div className="w-10 h-10 border-3 border-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-lg">&</span>
          </div>
        </div>
      </div>

      {/* Main Certificate Content */}
      <div className="text-center mb-6 mt-8">
        <h2 className="text-3xl font-bold text-purple-300 mb-6 tracking-wider">
          CERTIFICATE OF EXCELLENCE
        </h2>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
        
        <p className="text-base text-white italic mb-4">This is to certify that</p>
        
        <h3 className="text-4xl font-bold text-yellow-400 mb-2 tracking-wide">
          {fullName}
        </h3>
        <div className="w-40 h-1 bg-yellow-400 mx-auto mb-6"></div>
        
        <p className="text-base text-white mb-3">has successfully completed the internship program as</p>
        
        <h4 className="text-xl font-bold text-purple-300 mb-4">
          {role}
        </h4>
        
        <p className="text-sm text-white mb-4">
          From {new Date(startDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric' 
          })} to {new Date(endDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric' 
          })}
        </p>
      </div>

      {/* Signature and Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
          <div className="text-white text-xs">
            <p className="mb-1"><strong>Certificate ID:</strong> {certificateId}</p>
            <p className="mb-1"><strong>Verification:</strong> {verificationCode}</p>
            <p><strong>Issued:</strong> {new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric' 
            })}</p>
          </div>
          
          <div className="text-right">
            {/* Signature Image */}
            <div className="mb-2 flex justify-end">
              <img 
                src="/lovable-uploads/a7a0c72c-c107-4971-aba0-0fb500d8e818.png" 
                alt="Director Signature" 
                className="w-20 h-12 object-contain"
              />
            </div>
            <div className="text-white text-xs">
              <p className="font-semibold">Director, SANS Media</p>
              <p>Digital Innovation Department</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
