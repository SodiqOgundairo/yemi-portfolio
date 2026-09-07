import { useEffect, useRef, useState } from "react";

/** Global 0..1 document scroll, read once per frame and shared. */
export function useScrollProgress() {
  const [p, setP] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
      raf.current = requestAnimationFrame(read);
    };
    raf.current = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return p;
}
