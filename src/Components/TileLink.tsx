import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../Utils/cn';

/** A framed link to somewhere else in the app, with a line of explanation. */
export default function TileLink({
  to,
  title,
  children,
  badge,
  current = false,
  compact = false,
  onClick,
}: {
  to: string;
  title: ReactNode;
  children?: ReactNode;
  badge?: ReactNode;
  /** Draws the yellow selection border, as if already hovered */
  current?: boolean;
  /** Drops the explanation on phones, so more tiles fit on screen */
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'block h-full ds-frame ds-frame-hover p-3 transition sm:p-4',
        current && 'border-pk-gold! ring-3 ring-pk-yellow'
      )}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="t-h3 ds-text">{title}</span>
        {badge}
      </span>
      {children && (
        <span
          className={cn(
            'mt-1 t-small text-pk-muted',
            compact ? 'hidden sm:block' : 'block'
          )}
        >
          {children}
        </span>
      )}
    </Link>
  );
}
