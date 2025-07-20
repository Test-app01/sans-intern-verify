
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
      className="w-[800px] h-[600px] bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 relative p-8 mx-auto"
      style={{
        backgroundImage: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
        border: '8px solid #F59E0B',
        boxShadow: '0 0 0 4px #8B5CF6'
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-4 left-4 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 bg-purple-400 rounded-full opacity-60"></div>
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-wider">SANS MEDIA</h1>
            <p className="text-lg text-purple-200 mt-1">Digital Innovation & Excellence</p>
          </div>
          <div className="w-12 h-12 border-4 border-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-yellow-400 font-bold text-xl">&</span>
          </div>
        </div>
      </div>

      {/* Main Certificate Content */}
      <div className="text-center mb-8 mt-12">
        <h2 className="text-4xl font-bold text-purple-300 mb-8 tracking-wider">
          CERTIFICATE OF EXCELLENCE
        </h2>
        <div className="w-32 h-1 bg-yellow-400 mx-auto mb-8"></div>
        
        <p className="text-lg text-white italic mb-6">This is to certify that</p>
        
        <h3 className="text-5xl font-bold text-yellow-400 mb-2 tracking-wide">
          {fullName}
        </h3>
        <div className="w-48 h-1 bg-yellow-400 mx-auto mb-8"></div>
        
        <p className="text-lg text-white mb-4">has successfully completed the internship program as</p>
        
        <h4 className="text-2xl font-bold text-purple-300 mb-6">
          {role}
        </h4>
        
        <p className="text-lg text-white">
          Duration: {new Date(startDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} to {new Date(endDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="flex justify-between items-end text-white text-sm">
          <div>
            <p><strong>Certificate ID:</strong> {certificateId}</p>
            <p><strong>Verification Code:</strong> {verificationCode}</p>
            <p><strong>Issued:</strong> {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          <div className="text-right">
            <p><strong>Director, SANS Media</strong></p>
            <p>Digital Innovation Department</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
