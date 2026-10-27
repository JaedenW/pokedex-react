import React, { type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import Spinner from './Spinner';
import { CloseIcon, SearchIcon } from './Icons';
import { cn } from '../Utils/cn';

/* ---------- layout ---------- */

export function Page({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 py-5 sm:px-6 sm:py-8 lg:px-8',
        wide ? 'max-w-7xl' : 'max-w-6xl',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Panel({
  title,
  children,
  className,
  actions,
}: {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-pk-line bg-pk-paper p-4 shadow-card sm:p-6',
        className
      )}
    >
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          {title && (
            <h2 className="flex items-center gap-2.5 t-h3 text-pk-ink">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rotate-45 bg-pk-yellow"
              />
              {title}
            </h2>
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Loading({ className }: { className?: string }) {
  return (
    <div className={cn('flex h-48 items-center justify-center', className)}>
      <Spinner />
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-pk-line px-4 py-12 text-center">
      <p className="t-h3 text-pk-ink">{title}</p>
      {children && <div className="mt-2 t-body text-pk-muted">{children}</div>}
    </div>
  );
}

/* ---------- controls ---------- */

const BUTTON_BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition motion-safe:active:scale-95 disabled:pointer-events-none disabled:opacity-40';
const BUTTON_VARIANT = {
  primary: 'bg-pk-navy text-white hover:bg-pk-navy-deep',
  accent: 'bg-pk-yellow text-pk-navy hover:brightness-95',
  secondary:
    'border-2 border-pk-line bg-white text-pk-ink hover:border-pk-navy',
};
const BUTTON_SIZE = {
  sm: 'h-10 px-4 t-small',
  md: 'h-12 px-6 t-small',
  lg: 'h-14 px-8 t-body',
};

/** Class names for a button or a link that should look like one. */
export function buttonClass(
  variant: keyof typeof BUTTON_VARIANT = 'secondary',
  size: keyof typeof BUTTON_SIZE = 'md',
  className?: string
) {
  return cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className);
}

export function Chip({
  active,
  onClick,
  children,
  colour,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  colour?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={
        active && colour
          ? { backgroundColor: colour, borderColor: colour }
          : undefined
      }
      className={cn(
        'inline-flex h-10 shrink-0 items-center rounded-full border-2 px-4 t-small font-bold whitespace-nowrap transition',
        active
          ? 'border-pk-navy bg-pk-navy text-white'
          : 'border-pk-line bg-white text-pk-ink hover:border-pk-navy',
        className
      )}
    >
      {children}
    </button>
  );
}

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
}

/** Underlined tabs; the active one carries the yellow accent. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-1 overflow-x-auto border-b-2 border-pk-line',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === value}
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-0.5 shrink-0 border-b-4 px-4 py-2.5 t-body font-bold whitespace-nowrap transition',
            tab.id === value
              ? 'border-pk-yellow text-pk-navy'
              : 'border-transparent text-pk-muted hover:text-pk-ink'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const FIELD =
  'h-12 w-full rounded-xl border-2 border-pk-line bg-white font-sans text-pk-ink shadow-xs transition placeholder:text-pk-muted/70 hover:border-pk-navy/50 focus:border-pk-navy focus:outline-none';

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
  label: string;
}) {
  return (
    <label className={cn('relative block', className)}>
      <span className="sr-only">{label}</span>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-pk-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        enterKeyHint="search"
        className={cn(FIELD, 'pr-4 pl-11')}
      />
    </label>
  );
}

export function SelectBox({
  value,
  onChange,
  children,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(FIELD, 'cursor-pointer px-3.5')}
      >
        {children}
      </select>
    </label>
  );
}

export function Pill({
  children,
  colour = '#8a8fa0',
  className,
}: {
  children: ReactNode;
  colour?: string;
  className?: string;
}) {
  return (
    <span
      style={{ backgroundColor: colour }}
      className={cn(
        'inline-flex h-7 items-center rounded-md px-2.5 t-label font-bold text-white',
        className
      )}
    >
      {children}
    </span>
  );
}

/** A labelled number, used for move and item facts. */
export function StatTile({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-pk-line bg-white p-3 text-center">
      <dt className="t-label text-pk-muted">{label}</dt>
      <dd className="mt-1.5 t-h3 text-pk-ink">{value}</dd>
    </div>
  );
}

/* ---------- overlay ---------- */

/** A dialog: a bottom sheet on phones and a centred card from sm up. */
export function Modal({
  open,
  onClose,
  label,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // a portal, so the dialog covers the header and tab bar too
  return createPortal(
    <div
      className="fixed inset-0 z-[60] bg-pk-navy-deep/60 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          'absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col overflow-hidden rounded-t-3xl bg-pk-cream shadow-2xl outline-none sm:inset-x-auto sm:top-[8vh] sm:bottom-auto sm:left-1/2 sm:w-[min(52rem,calc(100%-3rem))] sm:-translate-x-1/2 sm:rounded-3xl',
          className
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 bg-pk-navy px-5 py-3 text-white">
          <h2 className="t-h3">{label}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-full hover:bg-white/15"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
