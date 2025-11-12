import Image from 'next/image';
import { useState } from 'react';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallbackSrc?: string;
}

export default function UserAvatar({ 
  src, 
  alt = "User", 
  size = 44, 
  className = "",
  fallbackSrc = "/images/user/owner.jpg"
}: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`overflow-hidden rounded-full ${className}`} style={{ width: size, height: size }}>
      <Image
        width={size}
        height={size}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        className="object-cover w-full h-full"
        priority={size > 32} // Prioritize larger avatars
      />
    </div>
  );
}