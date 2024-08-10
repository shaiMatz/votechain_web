import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import GradientBackground from '../components/GradientBackground';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const sectionRef = useRef(null);
  const circleRef = useRef(null); // This is your mark
  const titleRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !dotRef.current || !titleRef.current) return;

    // Set up the initial state of the dotRef (your mark)
    gsap.set(dotRef.current, {
      width: "0vmax",
      height: "0vmax",
      xPercent: -50,
      yPercent: -50,
      top: "50%",
      left: "50%",
      backgroundColor: "#C466F9",
      borderRadius: "50%",
    });

    let tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        pin: sectionRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });

    // Animation sequence
    tl1
.fromTo(dotRef.current,
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
        backgroundColor: "#C466F9",
      },
      {
        scale: 1,
        width: "100vw",
        height: "100vh",
        x: 0,
        y: 0,
        backgroundColor: "#ffffff60",
        ease: "power3.inOut",
        duration: 3,
        borderRadius: "0",
        onUpdate: function () {
          const bounds = dotRef.current.getBoundingClientRect();
          if (bounds.top <= 0 ) {  // Check if the timeline is not already paused
            tl1.pause();  // Pause the timeline when the dot reaches the top of the viewport
            gsap.to(dotRef.current, { y: -bounds.top, duration: 0.1 }); // Adjust the position to exactly 0
          }
        },
      }
    ).to(sectionRef.current, { opacity: 0, duration: 3, ease: "power3.inOut" }, "<") 
      .to(dotRef.current, { scale: 1, duration: 1, ease: "power2.out" }, "-=1");

    // Cleanup function to stop animations and remove ScrollTrigger instances
    return () => {
      if (tl1) tl1.kill(); // Kill the timeline
      ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill all ScrollTriggers
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GradientBackground />
      <div className="relative">
        <div ref={sectionRef}>
          <HeroSection circleRef={circleRef} titleRef={titleRef} />
        </div>
        <div ref={dotRef} className="absolute w-0 h-0 rounded-full flex items-center justify-center overflow-hidden">
          <HowItWorks />
        </div>
      
        <div style={{ height: "100vh" }} /> {/* Placeholder div */}
      </div>
    </div>
  );
};

export default LandingPage;
