import type { ReactNode } from 'react';
import { BackButton } from './PageHeader';

/**
 * The header of a detail page: a soft wash of one colour (a type's colour, or
 * the Pokédex yellow) with the title, badges and an optional picture.
 */
export default function DetailBanner({
  back,
  eyebrow,
  title,
  subtitle,
  badges,
  media,
  colour = '#ffcc00',
}: {
  back: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  badges?: ReactNode;
  media?: ReactNode;
  colour?: string;
}) {
  return (
    <section
      className="mb-6 rounded-3xl border border-pk-line bg-pk-paper p-5 shadow-card sm:p-8"
      style={{
        backgroundImage: `linear-gradient(135deg, ${colour}66, ${colour}1a)`,
      }}
    >
      <div className="flex items-start gap-4">
        <BackButton fallback={back} />
        <div className="min-w-0 flex-1">
          {eyebrow && <p className="mb-1 t-label text-pk-ink/60">{eyebrow}</p>}
          <h1 className="t-h1 break-words text-pk-ink">{title}</h1>
          {subtitle && <p className="mt-1 t-body text-pk-ink/70">{subtitle}</p>}
          {badges && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {badges}
            </div>
          )}
        </div>
        {media && <div className="shrink-0">{media}</div>}
      </div>
    </section>
  );
}
