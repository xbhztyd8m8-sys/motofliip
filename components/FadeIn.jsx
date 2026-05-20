'use client';

import { useEffect, useRef } from 'react';

// FadeIn — wraps children in an IntersectionObserver that adds .mf-in-view
// when the element enters the viewport, triggering the .mf-fade-up animation
// defined in globals.css. Users with prefers-reduced-motion see content
// immediately (CSS handles that override).
export default function FadeIn({ children, style }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('mf-in-view');
          observer.disconnect(); // only animate in once
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="mf-fade-up" style={style}>
      {children}
    </div>
  );
}
