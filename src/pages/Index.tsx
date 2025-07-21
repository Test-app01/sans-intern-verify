
// Updated for GitHub sync - SANS Media Intern Management System
const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">SANS Media Intern Management</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Professional certificate management system for interns
        </p>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Visit <strong>/admin</strong> for admin panel access
          </p>
          <p className="text-sm text-muted-foreground">
            Use verification codes to view certificates
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
