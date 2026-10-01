import { useEffect, useRef, useState } from "react";

export default function useInView(options = {}) {
  const ref = useRef();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    const node = ref.current; // ref.current có thể đã đổi lúc cleanup chạy
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [options]);

  return [ref, inView];
} 