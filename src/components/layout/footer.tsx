
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="py-6 px-6 md:px-12 border-t bg-slate-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} HealthLink Hub. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Terms of Service
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Privacy Policy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
