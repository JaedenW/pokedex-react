import { Link } from 'react-router';
import { typeColours } from '../Utils/typeColours';
import { getDisplayName } from '../Utils/text';
import { cn } from '../Utils/cn';
import { typeIconUrl } from '../api/sprites';

interface TypeBadgeProps {
  name: string;
  /** Renders a link to the type page; turn off inside another link. */
  linked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  className?: string;
}

const SIZES = {
  sm: 'h-7 px-2.5 t-label',
  md: 'h-9 px-3 t-small',
  lg: 'h-11 px-5 t-body',
};

export default function TypeBadge({
  name,
  linked = true,
  size = 'md',
  icon = false,
  className,
}: TypeBadgeProps) {
  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-lg font-bold text-white ring-1 ring-black/10 ring-inset',
    SIZES[size],
    linked && 'transition hover:brightness-110',
    className
  );
  const style = { backgroundColor: typeColours[name] ?? '#68A090' };
  const content = (
    <>
      {icon && typeIconUrl(name) && (
        <img
          src={typeIconUrl(name)}
          alt=""
          className={cn(
            'rounded-full bg-white/90',
            size === 'lg' ? 'size-7' : 'size-5'
          )}
          loading="lazy"
        />
      )}
      {size === 'sm' ? name : getDisplayName(name)}
    </>
  );

  return linked ? (
    <Link to={`/type/${name}`} className={classes} style={style}>
      {content}
    </Link>
  ) : (
    <span className={classes} style={style}>
      {content}
    </span>
  );
}

/** The round type symbol on the type's colour. */
export function TypeIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      title={getDisplayName(name)}
      className={cn(
        'inline-flex items-center justify-center rounded-full',
        className
      )}
      style={{ backgroundColor: typeColours[name] }}
    >
      <img
        src={typeIconUrl(name)}
        alt={getDisplayName(name)}
        className="size-full"
        loading="lazy"
      />
    </span>
  );
}
