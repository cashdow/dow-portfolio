'use client';

import { useState, useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// OrbitControls의 타입 정의
type OrbitControlsImpl = {
  enabled: boolean;
  target: THREE.Vector3;
  update: () => void;
};

export default function KeyboardControls() {
  const { camera } = useThree();
  const [moveSpeed, setMoveSpeed] = useState(0.2);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const orbitControlsRef = useRef<OrbitControlsImpl | null>(null);

  // 디버그용: 현재 이동 속도 콘솔 출력
  useEffect(() => {
    console.log('Current move speed:', moveSpeed);
  }, [moveSpeed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 기본 키보드 이벤트 방지 (페이지 스크롤 등)
      if (
        ['w', 'a', 's', 'd', 'q', 'e', 'r', 'f'].includes(
          event.key.toLowerCase()
        )
      ) {
        event.preventDefault();
      }

      keysPressed.current[event.key.toLowerCase()] = true;

      // 이동 속도 조절 (Shift: 느리게)
      if (event.key === 'Shift') {
        console.log('Shift key pressed, setting speed to 0.05');
        setMoveSpeed(0.05); // 느린 이동
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key.toLowerCase()] = false;

      // 이동 속도 원복
      if (event.key === 'Shift') {
        console.log('Shift key released, setting speed to 0.2');
        setMoveSpeed(0.2); // 기본 이동 속도
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    // 키보드 입력 감지 여부
    const isMoving =
      keysPressed.current['w'] ||
      keysPressed.current['s'] ||
      keysPressed.current['a'] ||
      keysPressed.current['d'] ||
      keysPressed.current['q'] ||
      keysPressed.current['e'] ||
      keysPressed.current['r'] ||
      keysPressed.current['f'];

    // 현재 적용할 이동 속도 결정
    // Shift 키가 눌려있으면 낮은 속도, 아니면 기본 속도 사용
    const currentSpeed = keysPressed.current['shift'] ? 0.05 : moveSpeed;

    // 카메라 방향에 따라 이동 벡터 계산을 위한 변수들
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.quaternion
    );
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0);

    // 카메라 전진/후진 (W/S)
    if (keysPressed.current['w']) {
      camera.position.addScaledVector(forward, currentSpeed);
    }
    if (keysPressed.current['s']) {
      camera.position.addScaledVector(forward, -currentSpeed);
    }

    // 카메라 좌/우 이동 (A/D)
    if (keysPressed.current['a']) {
      camera.position.addScaledVector(right, -currentSpeed);
    }
    if (keysPressed.current['d']) {
      camera.position.addScaledVector(right, currentSpeed);
    }

    // 카메라 상/하 이동 (R/F)
    if (keysPressed.current['r']) {
      camera.position.addScaledVector(up, currentSpeed);
    }
    if (keysPressed.current['f']) {
      camera.position.addScaledVector(up, -currentSpeed);
    }

    // 카메라 y축 기준 회전 (Q/E)
    const rotationSpeed = currentSpeed * 0.3;
    if (keysPressed.current['q']) {
      // OrbitControls를 일시적으로 비활성화
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }

      // y축 기준 회전 실행
      const rotationMatrix = new THREE.Matrix4().makeRotationY(rotationSpeed);
      const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );
      cameraDirection.applyMatrix4(rotationMatrix);
      camera.lookAt(camera.position.clone().add(cameraDirection));

      // OrbitControls 다시 활성화
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
    }

    if (keysPressed.current['e']) {
      // OrbitControls를 일시적으로 비활성화
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = false;
      }

      // y축 기준 회전 실행
      const rotationMatrix = new THREE.Matrix4().makeRotationY(-rotationSpeed);
      const cameraDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );
      cameraDirection.applyMatrix4(rotationMatrix);
      camera.lookAt(camera.position.clone().add(cameraDirection));

      // OrbitControls 다시 활성화
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
    }

    // 카메라가 이동할 때 OrbitControls의 target도 함께 업데이트
    if (isMoving && orbitControlsRef.current) {
      // OrbitControls의 target을 카메라가 바라보는 방향으로 일정 거리 앞에 설정
      const targetDistance = 5;
      const newForward = new THREE.Vector3(0, 0, -1).applyQuaternion(
        camera.quaternion
      );
      const target = camera.position
        .clone()
        .add(newForward.multiplyScalar(targetDistance));
      orbitControlsRef.current.target.copy(target);
      orbitControlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef as any}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      zoomSpeed={0.8}
      panSpeed={0.8}
      rotateSpeed={0.8}
      maxDistance={500}
      minDistance={0.1}
      maxPolarAngle={Math.PI}
    />
  );
}
