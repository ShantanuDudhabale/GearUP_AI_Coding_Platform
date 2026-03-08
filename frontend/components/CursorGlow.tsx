'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorGlow() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [visible]);

  return (
    <>
      {/* Large glow orb */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full transition-opacity duration-300"
        style={{
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(59,130,246,0.12) 40%, transparent 70%)',
          willChange: 'transform',
          opacity: visible ? 1 : 0,
        }}
      />
      {/* Sharp cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: '8px',
          height: '8px',
          background: 'rgba(99,102,241,0.85)',
          boxShadow: '0 0 8px 2px rgba(99,102,241,0.6)',
          willChange: 'transform',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.2s',
        }}
      />
    </>
  );
}
