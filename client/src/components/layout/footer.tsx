export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p>&copy; 2024 iManage Bulk Upload Client. All rights reserved.</p>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Help & Support
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              API Documentation
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              System Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
