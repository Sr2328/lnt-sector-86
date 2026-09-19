import { useState } from "react";

export default function Img({ src, alt = "", className = "", imgClass = "", overscan = false, eager = false }) {
  const [failed, setFailed] = useState(false);
  const base = overscan
    ? "absolute left-0 top-[-10%] h-[120%] w-full object-cover"
    : "absolute inset-0 h-full w-full object-cover";
  return (
    <div className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden bg-gradient-to-br from-navy to-navy-deep ${className}`}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`${base} ${imgClass}`}
        />
      )}
    </div>
  );
}
