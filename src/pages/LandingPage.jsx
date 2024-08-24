import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import GradientBackground from '../components/GradientBackground';
import { useRef, useEffect, useContext, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AuthContext } from '../contexts/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const sectionRef = useRef(null);
  const circleRef = useRef(null); // This is your mark
  const titleRef = useRef(null);
  const dotRef = useRef(null);
  const { setUser } = useContext(AuthContext);
  const [scrollEnabled, setScrollEnabled] = useState(false); // State to control scroll

  useEffect(() => {
    if (!sectionRef.current || !dotRef.current || !titleRef.current) return;
    setUser(null);

    // Set up the initial state of the dotRef (your mark)
    gsap.set(dotRef.current, {
      width: '0vmax',
      height: '0vmax',
      xPercent: -50,
      yPercent: -50,
      top: '50%',
      left: '50%',
      backgroundColor: '#C466F9',
      borderRadius: '50%',
      position: 'absolute',
      zIndex: 2, // Ensure it appears on top
    });

    let tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: sectionRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });

    // Animation sequence
    tl1
      .fromTo(
        dotRef.current,
        {
          scale: 0,
          x: () => {
            let markBounds = circleRef.current.getBoundingClientRect();
            let px = markBounds.left + markBounds.width * 0.5;
            return px - sectionRef.current.getBoundingClientRect().width / 2;
          },
          y: () => {
            let markBounds = circleRef.current.getBoundingClientRect();
            let py = markBounds.top + markBounds.height * 0.5;
            return py - sectionRef.current.getBoundingClientRect().height / 2;
          },
          backgroundColor: '#C466F9',
        },
        {
          scale: 1,
          width: '100lvw',
          height: '100lvh',
          x: 0,
          y: 0,
          backgroundColor: '#ffffff60',
          ease: 'power3.inOut',
          duration: 2,
          borderRadius: '0',
          onUpdate: function () {
            const bounds = dotRef.current.getBoundingClientRect();
            if (bounds.top <= 0) {
              tl1.pause();
              gsap.to(dotRef.current, { y: -bounds.top, duration: 0.1 });
            }
            setScrollEnabled(false); // Disable scroll during animation
          },
          onComplete: function () {
            setScrollEnabled(true); // Enable scroll after animation completes
          },
        }
      )
      .to(sectionRef.current, { opacity: 0, duration: 2, ease: 'power3.inOut' }, '<')
      .to(dotRef.current, { scale: 1, duration: 1, ease: 'power2.out' }, '-=1');

    // Cleanup function to stop animations and remove ScrollTrigger instances
    return () => {
      if (tl1) tl1.kill(); // Kill the timeline
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Kill all ScrollTriggers
      setScrollEnabled(true); // Reset scroll state
    };
  }, [setUser]);

  // Dynamic style for HowItWorks component
  const howItWorksStyle = scrollEnabled ? { overflowY: 'auto', maxHeight: '100lvh' } : { overflowY: 'hidden' };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      <div className="relative">
        <div ref={sectionRef}>
          <HeroSection circleRef={circleRef} titleRef={titleRef} nextSectionRef={dotRef}/>
        </div>
        <div ref={dotRef} className="absolute w-0 h-0 rounded-full overflow-hidden">
          {/* Apply dynamic styles based on scroll state */}
          <HowItWorks scroll={howItWorksStyle.overflowY} style={howItWorksStyle} />
        </div>

        <div style={{ height: '100lvh' }} /> {/* Placeholder div */}
      </div>
    </div>
  );
};

export default LandingPage;
