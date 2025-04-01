'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import * as THREE from 'three';

// React Three Fiber 컴포넌트를 동적으로 불러옵니다 (SSR 비활성화)
const ThreeModelViewer = dynamic(
  () => import('@/components/gallery/ThreeModelViewer'),
  { ssr: false }
);

interface ThreeGalleryManagerProps {
  modelPath: string;
}

export default function ThreeGalleryManager({
  modelPath,
}: ThreeGalleryManagerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [coordinatePickerMode, setCoordinatePickerMode] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    position: THREE.Vector3;
    normal: THREE.Vector3;
  } | null>(null);
  const [modelInfo, setModelInfo] = useState<string | null>(
    '모델 정보 로딩 중...'
  );

  const isMobile = useMediaQuery('(max-width: 768px)');

  // 다양한 위치에 이미지 배치
  const galleryImages = [
    // 중앙 이미지 (메인)
    {
      position: [0, 0, 1] as [number, number, number],
      normal: [0, 0, -1] as [number, number, number], // 카메라를 향하도록 반대 방향으로 설정
      imageUrl: '/assets/gallery/images/2.png',
      title: '중앙 이미지',
    },
    // 다른 이미지들
    {
      position: [3, 1, 3] as [number, number, number],
      normal: [-1, 0, -1] as [number, number, number],
      imageUrl: '/assets/gallery/images/1.png',
      title: '오른쪽 이미지',
    },
    {
      position: [-3, 1, 3] as [number, number, number],
      normal: [1, 0, -1] as [number, number, number],
      imageUrl: '/assets/gallery/images/2.png',
      title: '왼쪽 이미지',
    },
    {
      position: [0, 4, 0] as [number, number, number],
      normal: [0, -1, 0] as [number, number, number],
      imageUrl: '/assets/gallery/images/1.png',
      title: '위쪽 이미지',
    },
    {
      position: [0, -4, 0] as [number, number, number],
      normal: [0, 1, 0] as [number, number, number],
      imageUrl: '/assets/gallery/images/2.png',
      title: '아래쪽 이미지',
    },
    // 멀리 있는 위치 테스트
    {
      position: [10, 10, -10] as [number, number, number],
      normal: [-0.5, -0.5, 0.5] as [number, number, number],
      imageUrl: '/assets/gallery/images/2.png',
      title: '멀리 있는 이미지',
    },
  ];

  useEffect(() => {
    // 로딩 상태 처리
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // // 첫 로딩 후 콘솔에 모델 정보 출력
  useEffect(() => {
    const handleModelInfo = (event: MessageEvent) => {
      if (event.data && event.data.type === 'MODEL_INFO') {
        console.log('모델 정보 수신:', event.data);
        setModelInfo(
          `모델 경계: ${JSON.stringify(event.data.bounds)}, 메시 수: ${
            event.data.meshCount
          }`
        );
      } else if (event.data && event.data.type === 'MODEL_INFO_LOADED') {
        setModelInfo(null);
      }
    };

    window.addEventListener('message', handleModelInfo);
    return () => window.removeEventListener('message', handleModelInfo);
  }, []);

  // 좌표 선택 모드 토글
  const toggleCoordinatePicker = () => {
    setCoordinatePickerMode((prev) => !prev);
  };

  // 좌표 선택 핸들러
  const handleCoordinatePicked = (
    position: THREE.Vector3,
    normal: THREE.Vector3
  ) => {
    setSelectedCoordinates({ position, normal });
    // 콘솔에 좌표 출력 (나중에 복사해서 사용할 수 있도록)
    console.log(`선택된 좌표:
      position: [${position.x.toFixed(3)}, ${position.y.toFixed(
      3
    )}, ${position.z.toFixed(3)}],
      normal: [${normal.x.toFixed(3)}, ${normal.y.toFixed(
      3
    )}, ${normal.z.toFixed(3)}]
    `);
  };

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      ) : (
        <>
          {isMobile ? (
            // 모바일 뷰: 이미지 갤러리
            <div className="grid grid-cols-1 gap-8">
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/assets/gallery/images/1.png"
                  alt="3D Model Preview 1"
                  className="w-full h-auto"
                />
                <div className="p-4 bg-gray-900">
                  <h3 className="text-xl font-bold mb-2">Gallery Model 01</h3>
                  <p className="text-gray-300">
                    This 3D model is best viewed on desktop devices. Please
                    switch to a desktop device to interact with this model.
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img
                  src="/assets/gallery/images/2.png"
                  alt="3D Model Preview 2"
                  className="w-full h-auto"
                />
                <div className="p-4 bg-gray-900">
                  <h3 className="text-xl font-bold mb-2">Gallery Model 02</h3>
                  <p className="text-gray-300">
                    This 3D model is best viewed on desktop devices. Please
                    switch to a desktop device to interact with this model.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // 데스크탑 뷰: 3D 모델 뷰어
            <div className="relative h-[70vh] w-full rounded-lg overflow-hidden bg-gray-900">
              <ThreeModelViewer
                modelPath={modelPath}
                coordinatePickerMode={coordinatePickerMode}
                onCoordinatePicked={handleCoordinatePicked}
                galleryImages={
                  !coordinatePickerMode ? galleryImages : undefined
                }
              />

              {modelInfo && (
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded p-2 text-xs text-cyan-400">
                  <p>{modelInfo}</p>
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded p-4 max-w-md">
                <h3 className="text-xl font-bold mb-2 text-cyan-300">
                  Interactive Model
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Click and drag to rotate, scroll to zoom in/out, right-click
                  and drag to pan. 카메라 제한이 해제되었습니다.
                </p>

                {/* 좌표 선택 모드 토글 버튼 */}
                <button
                  onClick={toggleCoordinatePicker}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    coordinatePickerMode
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-cyan-600 hover:bg-cyan-700'
                  } transition-colors`}
                >
                  {coordinatePickerMode
                    ? '좌표 선택 모드 끄기'
                    : '좌표 선택 모드 켜기'}
                </button>

                {/* 디버그 정보 표시 */}
                <div className="mt-4 p-3 bg-gray-800 rounded text-xs">
                  <p className="font-bold text-cyan-300 mb-1">
                    렌더링된 이미지:
                  </p>
                  <ul className="text-gray-300 max-h-32 overflow-y-auto">
                    {!coordinatePickerMode &&
                      galleryImages.map((img, idx) => (
                        <li key={idx} className="mb-1">
                          {idx + 1}. {img.title} - 위치: [
                          {img.position[0].toFixed(1)},{' '}
                          {img.position[1].toFixed(1)},{' '}
                          {img.position[2].toFixed(1)}]
                        </li>
                      ))}
                  </ul>
                </div>

                {/* 선택된 좌표 정보 표시 */}
                {selectedCoordinates && coordinatePickerMode && (
                  <div className="mt-4 p-3 bg-gray-800 rounded text-xs">
                    <p className="font-bold text-cyan-300 mb-1">선택된 좌표:</p>
                    <p>
                      위치: [{selectedCoordinates.position.x.toFixed(3)},
                      {selectedCoordinates.position.y.toFixed(3)},
                      {selectedCoordinates.position.z.toFixed(3)}]
                    </p>
                    <p>
                      법선: [{selectedCoordinates.normal.x.toFixed(3)},
                      {selectedCoordinates.normal.y.toFixed(3)},
                      {selectedCoordinates.normal.z.toFixed(3)}]
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
