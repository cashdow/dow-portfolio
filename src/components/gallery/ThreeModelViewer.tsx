'use client';

import { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Environment,
  useProgress,
  Plane,
  Html,
} from '@react-three/drei';
import * as THREE from 'three';
import KeyboardControls from './KeyboardControls';

interface ThreeModelViewerProps {
  modelPath: string;
  coordinatePickerMode?: boolean;
  onCoordinatePicked?: (position: THREE.Vector3, normal: THREE.Vector3) => void;
  galleryImages?: {
    position: [number, number, number];
    normal: [number, number, number];
    imageUrl: string;
    title: string;
  }[];
}

function Model({
  modelPath,
  coordinatePickerMode = false,
  onCoordinatePicked,
}: {
  modelPath: string;
  coordinatePickerMode?: boolean;
  onCoordinatePicked?: (position: THREE.Vector3, normal: THREE.Vector3) => void;
}) {
  const { scene } = useGLTF(modelPath);
  const { camera, raycaster, mouse, gl } = useThree();

  // 모델 로드 시 디버깅 정보 출력
  // useEffect(() => {
  //   console.log('모델 로드됨:', modelPath);
  //   console.log('모델 크기:', scene.scale);

  //   // 모델 경계 상자 계산
  //   const boundingBox = new THREE.Box3().setFromObject(scene);
  //   console.log('모델 경계 박스:', boundingBox);

  //   // 모델 크기 계산
  //   const size = new THREE.Vector3();
  //   boundingBox.getSize(size);
  //   console.log('모델 크기 (너비, 높이, 깊이):', size);

  //   // 모델에 포함된 메시 정보 출력
  //   let meshCount = 0;
  //   scene.traverse((child) => {
  //     if ((child as THREE.Mesh).isMesh) {
  //       meshCount++;
  //       if (meshCount <= 5) {
  //         // 처음 5개만 출력
  //         console.log('메시 정보:', child.name, (child as THREE.Mesh).geometry);
  //       }
  //     }
  //   });
  //   console.log('총 메시 수:', meshCount);

  //   // 부모 컴포넌트에 모델 정보 전달
  //   window.postMessage(
  //     {
  //       type: 'MODEL_INFO',
  //       bounds: {
  //         min: {
  //           x: boundingBox.min.x.toFixed(2),
  //           y: boundingBox.min.y.toFixed(2),
  //           z: boundingBox.min.z.toFixed(2),
  //         },
  //         max: {
  //           x: boundingBox.max.x.toFixed(2),
  //           y: boundingBox.max.y.toFixed(2),
  //           z: boundingBox.max.z.toFixed(2),
  //         },
  //         size: {
  //           x: size.x.toFixed(2),
  //           y: size.y.toFixed(2),
  //           z: size.z.toFixed(2),
  //         },
  //       },
  //       meshCount,
  //     },
  //     '*'
  //   );
  // }, [scene, modelPath]);
  useEffect(() => {
    window.postMessage({ type: 'MODEL_INFO_LOADED' });
  }, [scene, modelPath]);

  const handleClick = (event: MouseEvent) => {
    if (!coordinatePickerMode || !onCoordinatePicked) return;

    event.stopPropagation();

    // 레이캐스터를 사용하여 마우스 클릭 지점의 3D 위치 찾기
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(scene, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      console.log('Hit position:', hit.point);
      console.log('Hit normal:', hit.face?.normal);

      // 클릭한 지점의 좌표와 법선 벡터 전달
      onCoordinatePicked(
        hit.point.clone(),
        hit.face?.normal?.clone() || new THREE.Vector3(0, 0, 1)
      );

      // 클릭한 지점에 임시 마커 표시 (디버깅용)
      const geometry = new THREE.SphereGeometry(0.05, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.copy(hit.point);
      scene.add(sphere);

      // 3초 후 마커 제거
      setTimeout(() => {
        scene.remove(sphere);
      }, 3000);
    }
  };

  useEffect(() => {
    if (coordinatePickerMode) {
      gl.domElement.addEventListener('click', handleClick);
      return () => {
        gl.domElement.removeEventListener('click', handleClick);
      };
    }
  }, [coordinatePickerMode, gl, handleClick]);

  return (
    <primitive
      object={scene}
      scale={0.8}
      position={[0, -2, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function GalleryItems({
  images,
}: {
  images?: {
    position: [number, number, number];
    normal: [number, number, number];
    imageUrl: string;
    title: string;
  }[];
}) {
  if (!images || images.length === 0) return null;

  return (
    <>
      {images.map((image, index) => (
        <GalleryImage
          key={index}
          position={image.position}
          normal={image.normal}
          imageUrl={image.imageUrl}
          title={image.title}
        />
      ))}
    </>
  );
}

function GalleryImage({
  position,
  normal,
  imageUrl,
  title,
}: {
  position: [number, number, number];
  normal: [number, number, number];
  imageUrl: string;
  title: string;
}) {
  // 법선 벡터를 사용하여 평면의 방향 설정
  const normalVector = new THREE.Vector3(...normal);
  const planeRotation = new THREE.Quaternion();

  // 법선 벡터가 z축과 정렬되도록 회전 계산
  planeRotation.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    normalVector.normalize()
  );

  // 약간의 오프셋을 적용하여 벽에서 조금 떨어지게 배치
  const offsetPosition = [
    position[0] + normal[0] * 0.02,
    position[1] + normal[1] * 0.02,
    position[2] + normal[2] * 0.02,
  ] as [number, number, number];

  const [hovered, setHovered] = useState(false);

  return (
    <group position={offsetPosition} quaternion={planeRotation}>
      <Plane
        // args={[2, 2.8]}
        args={[4, 4]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial transparent opacity={0} />
        <Html
          transform
          distanceFactor={0.5}
          position={[0, 0, 0.01]}
          scale={0.2}
          occlude
        >
          <div
            className={`relative transition-all duration-300 ${
              hovered ? 'scale-105' : 'scale-100'
            }`}
          >
            <img
              src={imageUrl}
              alt={title}
              className="rounded-md shadow-lg"
              style={{ width: '300px', height: 'auto' }}
            />
            {hovered && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 rounded-b-md">
                <h3 className="text-center font-bold">{title}</h3>
              </div>
            )}
          </div>
        </Html>
      </Plane>
    </group>
  );
}

function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mx-auto mb-4"></div>
        <p className="text-cyan-400 text-lg">
          Loading... {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

export default function ThreeModelViewer({
  modelPath,
  coordinatePickerMode = false,
  onCoordinatePicked,
  galleryImages,
}: ThreeModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, -5], fov: 60, far: 10000, near: 0.1 }}
        style={{ background: '#111' }}
      >
        <ambientLight intensity={1.0} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <hemisphereLight intensity={0.4} />

        {/* <fog attach="fog" args={['#111', 15, 150]} /> */}
        <fog attach="fog" args={['#111', 5, 50]} />

        <Model
          modelPath={modelPath}
          coordinatePickerMode={coordinatePickerMode}
          onCoordinatePicked={onCoordinatePicked}
        />

        {galleryImages && <GalleryItems images={galleryImages} />}

        <KeyboardControls />

        <Environment preset="city" />
      </Canvas>

      {isLoading && <LoadingScreen />}

      {coordinatePickerMode && (
        <div className="absolute top-4 left-4 bg-black/80 p-4 rounded-md text-white">
          <p className="text-sm">
            좌표 선택 모드 활성화: 모델의 원하는 위치를 클릭하세요
          </p>
          <p className="text-xs mt-2 text-cyan-400">콘솔에서 좌표 확인 가능</p>
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded p-3 text-xs text-white">
        <p className="font-bold text-cyan-300 mb-1">키보드 컨트롤:</p>
        <ul className="text-gray-300">
          <li>W / S: 앞 / 뒤 이동</li>
          <li>A / D: 좌 / 우 이동</li>
          <li>R / F: 위 / 아래 이동</li>
          <li>Q / E: 좌우 시점 회전</li>
          <li>Shift: 느린 이동</li>
          <li>마우스: 시점 회전, 휠: 줌</li>
        </ul>
      </div>
    </>
  );
}
