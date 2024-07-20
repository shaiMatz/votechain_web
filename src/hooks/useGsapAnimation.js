import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useGsapAnimation = (animationSettings) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        animationSettings.from,
        {
          ...animationSettings.to,
          scrollTrigger: {
            trigger: ref.current,
            start: animationSettings.start || 'top 80%',
            end: animationSettings.end || 'top 60%',
            toggleActions: animationSettings.toggleActions || 'play none none reverse',
          },
        }
      );
    }
  }, [animationSettings]);

  return ref;
};

export default useGsapAnimation;
