import React from 'react';
import { itemSpriteUrl } from '../api/sprites';
import { BagIcon } from './Icons';
import { cn } from '../Utils/cn';

// Some items have no artwork in the sprites repository
export default function ItemImage({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = React.useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          'flex items-center justify-center text-pk-line',
          className
        )}
      >
        <BagIcon className="size-1/2" />
      </span>
    );
  }

  return (
    <img
      src={itemSpriteUrl(name)}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('object-contain [image-rendering:pixelated]', className)}
    />
  );
}
