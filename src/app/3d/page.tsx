'use client';

import dynamic from 'next/dynamic';

// React Three Fiber 컴포넌트를 동적으로 불러옵니다 (SSR 비활성화)
const ThreeGalleryManager = dynamic(
  () => import('@/components/gallery/ThreeGalleryManager'),
  { ssr: false }
);

export default function ThreeDPage() {
  return (
    <div className="min-h-screen pt-20 bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-cyan-400">
          3D Gallery
        </h1>
        <p className="text-lg mb-8 max-w-2xl">
          Explore interactive 3D models created with Three.js and React Three
          Fiber. This gallery showcases various 3D objects that you can interact
          with.
        </p>

        <ThreeGalleryManager modelPath="/assets/gallery/three/gallery_02.glb" />
      </div>
    </div>
  );
}
