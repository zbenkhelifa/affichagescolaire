import React, { useState, useEffect } from 'react';
import { Slide } from '../types';

interface Props {
  slides: Slide[];
}

export const Slideshow: React.FC<Props> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setActiveIndex(i => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/20">
        <div className="text-6xl">🖼</div>
        <p className="text-lg font-medium">Aucune diapositive configurée</p>
        <p className="text-sm">Ajoutez des diapositives depuis le panneau admin</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 flex flex-col transition-opacity duration-1000"
          style={{ opacity: i === activeIndex ? 1 : 0 }}
        >
          {slide.img ? (
            <div className="flex-1 relative overflow-hidden">
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(9,9,11,0.85) 100%)' }}
              />
            </div>
          ) : (
            <div
              className="flex-1 flex flex-col items-center justify-center gap-4"
              style={{ background: slide.color || 'linear-gradient(135deg, #1a3a6b, #0a1628)' }}
            >
              {slide.emoji && <span className="text-8xl">{slide.emoji}</span>}
            </div>
          )}

          {(slide.title || slide.sub) && (
            <div className="absolute bottom-0 left-0 right-0 z-10 p-8">
              {slide.title && (
                <h2 className="font-syne text-4xl font-black text-white leading-tight"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {slide.title}
                </h2>
              )}
              {slide.sub && (
                <p className="text-xl text-white/80 mt-2">{slide.sub}</p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 right-5 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i === activeIndex ? '#e8b84b' : 'rgba(255,255,255,0.3)',
                transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
