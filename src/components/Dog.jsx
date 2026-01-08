import { useThree, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  useGLTF,
  useTexture,
  useAnimations,
} from "@react-three/drei";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Dog() {
  gsap.registerPlugin(useGSAP);
  gsap.registerPlugin(ScrollTrigger);

  const model = useGLTF("/models/dog.drc.glb");
  useThree(({ camera, scene, gl }) => {
    camera.position.z = 0.55;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });
  // const dogRef = useRef();
  // useFrame(({ mouse }) => {
  //   if (!dogRef.current) return;

  //   dogRef.current.rotation.y = THREE.MathUtils.lerp(
  //     dogRef.current.rotation.y,
  //     Math.PI / 4.9 + mouse.x * 0.25,
  //     0.05
  //   );
  // });

  const { actions } = useAnimations(model.animations, model.scene);

  useEffect(() => {
    actions["Take 001"].play();
  }, [actions]);

  const [normalMap, sampleMatCap] =
    useTexture([
      "/dog_normals.jpg",
      "/matcap/mat-2.png"
    ]).map((texture) => {
      texture.flipY = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

  const [branches_diffuse,branches_normals] = useTexture(['/branches_diffuse.jpg',
      '/branches_normals.jpg']).map((texture) => {
      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

  const dogMaterial = new THREE.MeshMatcapMaterial({
    normalMap: normalMap,
    matcap: sampleMatCap,
  });

const branch = new THREE.MeshMatcapMaterial({
  map: branches_diffuse,
  normalMap: branches_normals,
});




  model.scene.traverse((child) => {
    if (child.name.includes("DOG")) {
      child.material = dogMaterial;

    }
     else {
      child.material = branch;
    }
  });

  const dogModel = useRef(model);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#section-1",
        endTrigger: "#section-3",
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: true,
      },
    });

  // 1️⃣ Move away from camera (Z) + slight lift (Y)
  tl.to(dogModel.current.scene.position, {
    z: "-=0.3",  // depth (away)
    y: "+=0.02",  // up
    ease: "none",
  });

  // 2️⃣ Rotate forward (X)
  tl.to(dogModel.current.scene.rotation, {
    x: `+=${Math.PI / 13}`,
    ease: "none",
  });

  // 3️⃣ Turn + slide sideways + MORE depth
  tl.to(
    dogModel.current.scene.rotation,
    {
      y: `-=${Math.PI}`,
      ease: "none",
    },
    "third"
  );

  tl.to(
    dogModel.current.scene.position,
    {
      x: "-=0.50", // left
      y: "-=0.01", // down
      z: "-=0.05", // farther away (NOT +)
      ease: "none",
    },
    "third"
  );
  }, []);

  return (
    <>
      <primitive
        // ref={dogRef}
        object={model.scene}
        position={[0.2, -0.55, 0.12]}
        rotation={[0, Math.PI / 6, 0]}
      />
      <directionalLight
        position={[0, -0.5, 5]}
        color={0xffffff}
        intensity={10}
      />
      {/* <OrbitControls /> */}
    </>
  );
}

export default Dog;
