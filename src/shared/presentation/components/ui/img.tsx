import React, { useState } from 'react';
import { mixStyle } from '../../../application/lib/mix-style';
import type { ImageProps } from '../../../presentation/html.types';

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, style, onLoad, ...props }, ref) => {
    const [aspectRatio, setAspectRatio] = useState<string | undefined>();

    const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (img.naturalHeight > 0) {
        setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
      }
      onLoad?.(event);
    };

    const combinedStyle = {
      ...style,
      aspectRatio,
    };

    return (
      <img
        ref={ref}
        className={mixStyle('size-auto object-cover object-center', className)}
        style={combinedStyle}
        onLoad={handleImageLoad}
        {...props}
      />
    );
  },
);
