'use client';

import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 초기 윈도우 높이 설정
    setWindowHeight(window.innerHeight);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const calculateParallax = (baseValue: number) => {
    // 패럴랙스 효과의 최대값을 제한하여 너무 많이 이동하지 않도록 함
    const maxScroll = 1000; // 스크롤 효과가 최대화되는 지점
    const limitedScroll = Math.min(scrollY, maxScroll);
    return baseValue + limitedScroll * 0.05; // 효과 강도 감소
  };

  const calculateOpacity = (
    elementRef: React.RefObject<HTMLDivElement | null>,
    startFade: number,
    endFade: number
  ) => {
    if (!elementRef.current) return 1;

    const rect = elementRef.current.getBoundingClientRect();
    const elementTop = rect.top + window.scrollY;
    const currentWindowHeight = windowHeight || window.innerHeight;

    const scrollPosition = scrollY + currentWindowHeight;
    const visibilityStart = elementTop - currentWindowHeight * startFade;
    const visibilityEnd = elementTop - currentWindowHeight * endFade;

    if (scrollPosition < visibilityStart) return 0;
    if (scrollPosition > visibilityEnd) return 1;

    return Math.min(
      Math.max(
        (scrollPosition - visibilityStart) / (visibilityEnd - visibilityStart),
        0
      ),
      1
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="section relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed z-0"
          style={{
            backgroundImage: 'url(/assets/images/home/home-1.webp)',
            transform: `translateY(${Math.min(scrollY * 0.2, 200)}px)`, // 최대 이동 제한
          }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="container mx-auto px-4 z-20 relative">
          <div
            className="text-center"
            style={{
              transform: `translateY(${Math.max(-scrollY * 0.1, -100)}px)`, // 최소 이동 제한
              opacity: Math.max(1 - scrollY * 0.001, 0.2), // 최소 불투명도 유지
            }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white animate-fade-in">
              <span className="text-cyan-400">D</span>owoo
            </h1>
            <h2
              className="text-xl md:text-3xl mb-8 text-cyan-200 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Senior Frontend Developer
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl mx-auto text-white/90 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              Crafting beautiful and functional user experiences with modern web
              technologies.
            </p>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="section bg-gray-900 relative py-16 md:py-24 min-h-[500px] flex items-center"
      >
        <div
          className="absolute right-0 top-0 w-full md:w-1/2 h-full opacity-20 md:opacity-30"
          style={{
            backgroundImage: 'url(/assets/images/home/home-2.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: calculateOpacity(aboutRef, 0.8, 0.4),
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div
              className="flex flex-col justify-center"
              style={{
                opacity: calculateOpacity(aboutRef, 0.9, 0.6),
                transform: `translateY(${Math.min(
                  calculateParallax(10),
                  30
                )}px)`, // 최대 이동 제한
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">
                About Me
              </h2>
              <p className="text-lg mb-4">
                I&apos;m a Senior Frontend Developer with extensive experience
                in building high-performance web and mobile applications.
              </p>
              <p className="text-lg mb-4">
                My journey in software development has taken me through various
                technologies and platforms, from Java and Objective-C to modern
                frameworks like React, React Native, Flutter, and Next.js.
              </p>
              <p className="text-lg">
                Recently, I&apos;ve developed an interest in AI and have been
                learning Python to explore machine learning and artificial
                intelligence concepts.
              </p>
            </div>
            <div
              className="flex flex-col justify-center"
              style={{
                opacity: calculateOpacity(aboutRef, 0.8, 0.5),
                transform: `translateY(${Math.min(
                  calculateParallax(20),
                  40
                )}px)`, // 최대 이동 제한
              }}
            >
              <div className="relative h-80 md:h-full rounded-lg overflow-hidden">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="/assets/images/home/video-1.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        ref={skillsRef}
        className="section bg-black relative py-16 md:py-24 min-h-[600px] flex items-center"
      >
        <div
          className="absolute left-0 top-0 w-full h-full bg-gradient-to-b from-gray-900/50 to-black"
          style={{
            opacity: calculateOpacity(skillsRef, 0.8, 0.4),
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-12 text-cyan-400 text-center"
            style={{
              opacity: calculateOpacity(skillsRef, 0.9, 0.6),
              transform: `translateY(${Math.min(calculateParallax(10), 30)}px)`,
            }}
          >
            My Skills
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            style={{
              opacity: calculateOpacity(skillsRef, 0.8, 0.5),
              transform: `translateY(${Math.min(calculateParallax(20), 40)}px)`,
            }}
          >
            {/* Frontend 카테고리 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">
                Frontend
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  React
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  TypeScript
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Next.js
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Redux
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Zustand
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Tailwind CSS
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Jest & Playwright
                </span>
              </div>
            </div>

            {/* Mobile 카테고리 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">
                Mobile
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  React Native
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Flutter
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  iOS (Objective-C)
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Android (Java)
                </span>
              </div>
            </div>

            {/* Backend 카테고리 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">
                Backend & DB
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Node & Express
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  PostgreSQL
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Firebase
                </span>
              </div>
            </div>

            {/* Tools & Others 카테고리 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">
                Tools & Others
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Git
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  Docker
                </span>
                <span className="px-3 py-1 bg-cyan-900/50 text-cyan-200 rounded-full text-sm">
                  CI/CD(Git Actions)
                </span>
              </div>
            </div>

            {/* Currently Learning 카테고리 */}
            <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/90 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/30">
              <h3 className="text-xl font-semibold mb-4 text-cyan-400 border-b border-gray-700 pb-2">
                Currently Learning
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm">
                  AI Service
                </span>
                <span className="px-3 py-1 bg-purple-900/50 text-purple-200 rounded-full text-sm">
                  Three.js
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section
        ref={projectsRef}
        className="section bg-gray-900 relative py-16 md:py-24 min-h-[600px] flex items-center"
      >
        <div
          className="absolute inset-0 w-full h-full opacity-20"
          style={{
            backgroundImage: 'url(/assets/images/home/home-1.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: calculateOpacity(projectsRef, 0.8, 0.4),
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-12 text-cyan-400 text-center"
            style={{
              opacity: calculateOpacity(projectsRef, 0.9, 0.6),
              transform: `translateY(${Math.min(calculateParallax(10), 30)}px)`, // 최대 이동 제한
            }}
          >
            Explore My Work
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            style={{
              opacity: calculateOpacity(projectsRef, 0.8, 0.5),
              transform: `translateY(${Math.min(calculateParallax(20), 40)}px)`, // 최대 이동 제한
            }}
          >
            <div className="bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 md:h-72">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: 'url(/assets/gallery/images/1.png)',
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    3D Exploration
                  </h3>
                  <p className="text-cyan-200">
                    Interactive 3D models and environments
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Explore interactive 3D models created with Three.js and React
                  Three Fiber.
                </p>
                <a
                  href="/3d"
                  className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full transition-colors"
                >
                  View Gallery
                </a>
              </div>
            </div>

            <div className="bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="relative h-48 md:h-72">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source
                    src="/assets/images/home/video-2.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    AI Projects
                  </h3>
                  <p className="text-cyan-200">
                    Machine learning and AI experiments
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 mb-4">
                  Check out my AI experiments and projects leveraging machine
                  learning technologies.
                </p>
                <a
                  href="/ai"
                  className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-full transition-colors"
                >
                  Explore AI
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
