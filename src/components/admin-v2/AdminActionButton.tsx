import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type AdminActionVariant = 'primary' | 'secondary' | 'quiet' | 'danger';

interface AdminActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminActionVariant;
  icon?: ReactNode;
  loading?: boolean;
  iconOnly?: boolean;
}

/** A deliberately compact action control for every admin toolbar. */
export function AdminActionButton({
  variant = 'secondary', icon, loading = false, iconOnly = false, className = '', children, disabled, ...props
}: AdminActionButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`da-action-button da-action-${variant} ${iconOnly ? 'is-icon-only' : ''} ${className}`}
    >
      {loading ? <Loader2 className="da-action-icon animate-spin" aria-hidden="true" /> : icon && <span className="da-action-icon" aria-hidden="true">{icon}</span>}
      {children && <span className="da-action-label">{children}</span>}
    </button>
  );
}
