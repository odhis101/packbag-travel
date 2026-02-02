'use client';

import Navigation from './components/Navigation';

export default function Home() {
  return (
    <div className="blue-gradient">
      <Navigation />

      <div className="flex items-end min-h-[85vh] pb-8 md:pb-16">
        <div className="text-left px-6 md:px-8 md:pl-16">
          <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-normal mb-1 md:mb-2">
            EXPLORE YOUR
          </h2>
          <h2 className="text-white text-5xl sm:text-6xl md:text-8xl font-bold mb-2 md:mb-4">
            WORLD
          </h2>
          <p className="text-white text-xl sm:text-2xl md:text-4xl font-light">
            WITH US...
          </p>
        </div>
      </div>
    </div>
  );
}
