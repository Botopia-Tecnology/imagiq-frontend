"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useProgress, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

import "@google/model-viewer";

type ARViewerProps = {
  modelUrl: string;
};{/*ios-src="https://mi-bucket.s3.amazonaws.com/models/product.usdz"*/}

export default function ARViewer({ modelUrl }: ARViewerProps) {
  return (
    <model-viewer
      src={modelUrl}
      
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      autoplay
      style={{ width: "100%", height: "500px" }}
    />
  );
}

// type Product3DViewerProps = {
//   modelUrl: string;
//   autoRotate?: boolean;
// };

// function Loader() {
//   const { progress } = useProgress();
//   return (
//     <Html center>
//       <span style={{ color: "#444", fontSize: "14px" }}>
//         Cargando... {progress.toFixed(0)}%
//       </span>
//     </Html>
//   );
// }

// function Model({ modelUrl }: { modelUrl: string }) {
//   const { scene } = useGLTF(modelUrl);
//   return <primitive object={scene} scale={1} />;
// }

// export default function Product3DViewerR3F({
//   modelUrl,
//   autoRotate = true,
// }: Product3DViewerProps) {
//   return (
//     <div style={{ width: "100%", height: "500px" }}>
//       <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />
//         <Suspense fallback={<Loader />}>
//           <Model modelUrl={modelUrl} />
//           <Environment preset="sunset" />
//         </Suspense>
//         <OrbitControls
//           enablePan={true}
//           enableZoom={true}
//           autoRotate={autoRotate}
//           autoRotateSpeed={1}
//           minDistance={1}
//           maxDistance={10}
//         />
//       </Canvas>
//     </div>
//   );
// }
