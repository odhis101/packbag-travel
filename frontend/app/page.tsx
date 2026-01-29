'use client';

import Navigation from './components/Navigation';

export default function Home() {
  return (
    <div className="blue-gradient">
      <Navigation />

      <div className="flex items-end min-h-[85vh] pb-16">
        <div className="text-left px-8 pl-16">
          <h2 className="text-white text-5xl md:text-6xl font-normal mb-2">
            EXPLORE YOUR
          </h2>
          <h2 className="text-white text-7xl md:text-8xl font-bold mb-4">
            WORLD
          </h2>
          <p className="text-white text-3xl md:text-4xl font-light">
            WITH US...
          </p>
        </div>
      </div>
    </div>
  );
}
