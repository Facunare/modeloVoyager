import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Stars } from "@react-three/drei";
import { useEffect, useRef } from "react";
import "./App.css";

function Voyager({ scrollProgress }) {
  const model = useGLTF("/models/voyagerProbe.glb");
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;

    const p = scrollProgress.current;

    // Rotación constante
    ref.current.rotation.y += 0.004;

    // Movimiento de la nave según scroll
    if (p < 0.25) {
      ref.current.position.set(0, 0, 0);
      ref.current.scale.setScalar(1.4);
    } else if (p < 0.5) {
      ref.current.position.set(-1.8, 0.4, 0);
      ref.current.scale.setScalar(0.9);
    } else if (p < 0.75) {
      ref.current.position.set(1.5, -0.3, 0);
      ref.current.scale.setScalar(0.55);
    } else {
      ref.current.position.set(0, 0, 0);
      ref.current.scale.setScalar(0.28);
    }
  });

  return <primitive ref={ref} object={model.scene} />;
}

function CameraController({ scrollProgress }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollProgress.current;

    if (p < 0.25) {
      camera.position.lerp({ x: 0, y: 0, z: 4 }, 0.04);
    } else if (p < 0.5) {
      camera.position.lerp({ x: 0, y: 1.2, z: 8 }, 0.04);
    } else if (p < 0.75) {
      camera.position.lerp({ x: 3, y: 2, z: 12 }, 0.04);
    } else {
      camera.position.lerp({ x: 0, y: 4, z: 22 }, 0.04);
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Planet({ position, size, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function App() {
  const scrollProgress = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;

      if (maxScroll <= 0) {
        scrollProgress.current = 0;
        return;
      }

      scrollProgress.current = scrollTop / maxScroll;
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="scene">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 5, 5]} intensity={2} />

          <Stars radius={100} depth={50} count={3000} factor={4} fade />

          <Voyager scrollProgress={scrollProgress} />
          <CameraController scrollProgress={scrollProgress} />

          <Planet position={[-6, -1.5, -8]} size={1.2} color="#d6a35c" />
          <Planet position={[7, 2, -14]} size={1.7} color="#d9c39a" />
        </Canvas>
      </div>

      <div className="scroll-space" />
    </>
  );
}