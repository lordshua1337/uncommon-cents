import { DollarSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer-elevated py-8 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-text-muted text-sm">
          <DollarSign className="w-4 h-4" />
          Uncommon Cents
        </div>
        <p className="text-text-muted text-xs">
          Financial education, not financial advice.
        </p>
      </div>
    </footer>
  );
}
