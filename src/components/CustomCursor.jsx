import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const dotRef     = useRef(null);
  const outlineRef = useRef(null);
  const pos        = useRef({ x: -200, y: -200 });
  const visible    = useRef(false);
  const rafId      = useRef(null);

  useEffect(() => {
    // Use RAF for smooth cursor movement without re-renders
    const moveCursor = (x, y) => {
      if (dotRef.current) {
        dotRef.current.style.transform     = `translate(${x}px, ${y}px)`;
      }
      if (outlineRef.current) {
        outlineRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const onMouseMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        dotRef.current     && (dotRef.current.style.opacity     = '1');
        outlineRef.current && (outlineRef.current.style.opacity = '1');
      }
      moveCursor(e.clientX, e.clientY);
    };

    const onMouseLeave = () => {
      visible.current = false;
      dotRef.current     && (dotRef.current.style.opacity     = '0');
      outlineRef.current && (outlineRef.current.style.opacity = '0');
    };

    const onMouseEnter = () => {
      // stays invisible until next mousemove
    };

    const onMouseOver = (e) => {
      const el = e.target;
      const hovering = el.tagName === 'BUTTON' || el.tagName === 'A' ||
                       !!el.closest('button')  || !!el.closest('a');
      dotRef.current?.classList.toggle('hover', hovering);
      outlineRef.current?.classList.toggle('hover', hovering);
    };

    document.addEventListener('mousemove',   onMouseMove,  { passive: true });
    document.addEventListener('mouseleave',  onMouseLeave);
    document.addEventListener('mouseenter',  onMouseEnter);
    document.addEventListener('mouseover',   onMouseOver,  { passive: true });

    return () => {
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover',  onMouseOver);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Don't render on true touch-only devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <div ref={dotRef}     className="custom-cursor-dot"     style={{ opacity: 0 }} />
      <div ref={outlineRef} className="custom-cursor-outline" style={{ opacity: 0 }} />
    </>
  );
};

export default CustomCursor;
