import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { BackIcon } from './Icons';

/** Goes back in history when there is some, otherwise to a sensible fallback. */
export function BackButton({ fallback = '/' }: { fallback?: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const canGoBack = location.key !== 'default';

  return (
    <button
      type="button"
      onClick={() => (canGoBack ? navigate(-1) : navigate(fallback))}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-pk-line bg-white shadow-card transition hover:border-pk-navy"
      aria-label="Go back"
    >
      <BackIcon />
    </button>
  );
}

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  actions,
  back,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  back?: string;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3">
      {back !== undefined && <BackButton fallback={back} />}
      <div className="min-w-0 flex-[1_1_14rem]">
        {eyebrow && <p className="mb-1 t-label text-pk-muted">{eyebrow}</p>}
        <h1 className="t-h1 break-words text-pk-ink">{title}</h1>
        {subtitle && <p className="mt-1 t-body text-pk-muted">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}
