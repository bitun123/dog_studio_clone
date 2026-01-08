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

const  [
  mat1,
  mat2,
  mat3,
  mat4,
  mat5,
  mat6,
  mat7,
  mat8,
  mat9,
  mat10,
  mat11,
  mat12,
  mat13,
  mat14,
  mat15,
  mat16,
  mat17,
  mat18,
  mat19,
  mat20,
] = (useTexture([
      "/matcap/mat-1.png",
      "/matcap/mat-2.png",
      "/matcap/mat-3.png",
      "/matcap/mat-4.png",
      "/matcap/mat-5.png",
      "/matcap/mat-6.png",
      "/matcap/mat-7.png",
      "/matcap/mat-8.png",
      "/matcap/mat-9.png",
      "/matcap/mat-10.png",
      "/matcap/mat-11.png",
       "/matcap/mat-12.png",
      "/matcap/mat-13.png",
      "/matcap/mat-14.png",
      "/matcap/mat-15.png",
      "/matcap/mat-16.png",
      "/matcap/mat-17.png",
      "/matcap/mat-18.png",
      "/matcap/mat-19.png",
      "/matcap/mat-20.png",
     
])).map(texture => {
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    })

const material = useRef({
  uMatCap1:{value:mat19},
  uMatCap2:{value:mat2},
  uProgress:{value:1}
})


  function onBeforeCompile(shader) {
        shader.uniforms.uMatcapTexture1 = material.current.uMatCap1
        shader.uniforms.uMatcapTexture2 = material.current.uMatCap2
        shader.uniforms.uProgress = material.current.uProgress

        // Store reference to shader uniforms for GSAP animation

        shader.fragmentShader = shader.fragmentShader.replace(
            "void main() {",
            `
        uniform sampler2D uMatcapTexture1;
        uniform sampler2D uMatcapTexture2;
        uniform float uProgress;

        void main() {
        `
        )

        shader.fragmentShader = shader.fragmentShader.replace(
            "vec4 matcapColor = texture2D( matcap, uv );",
            `
          vec4 matcapColor1 = texture2D( uMatcapTexture1, uv );
          vec4 matcapColor2 = texture2D( uMatcapTexture2, uv );
          float transitionFactor  = 0.2;
          
          float progress = smoothstep(uProgress - transitionFactor,uProgress, (vViewPosition.x+vViewPosition.y)*0.5 + 0.5);

          vec4 matcapColor = mix(matcapColor2, matcapColor1, progress );
        `
        )
    }

    dogMaterial.onBeforeCompile = onBeforeCompile



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
        endTrigger: "#section-4",
        start: "top top",
        end: "bottom bottom",
        // markers: true,
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
      y: "-=0.0015", // down
      z: "-=0.040", // farther away (NOT +)
      ease: "none",
    },
    "third"
  );
  }, []);

useEffect(()=>{
document.querySelector(`.title[img-title="tomorrow"]`).addEventListener("mouseenter",()=>{
 material.current.uMatCap1.value = mat19
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})


document.querySelector(`.title[img-title="navy"]`).addEventListener("mouseenter",()=>{
material.current.uMatCap1.value = mat8
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})

document.querySelector(`.title[img-title="msi"]`).addEventListener("mouseenter",()=>{
material.current.uMatCap1.value = mat9
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})
document.querySelector(`.title[img-title="phone"]`).addEventListener("mouseenter",()=>{
material.current.uMatCap1.value = mat12
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})

document.querySelector(`.title[img-title="kikk"]`).addEventListener("mouseenter",()=>{
material.current.uMatCap1.value = mat10
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})


document.querySelector(`.title[img-title="kennedy"]`).addEventListener("mouseenter",()=>{
material.current.uMatCap1.value = mat11
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})
document.querySelector(`.title[img-title="opera"]`).addEventListener("mouseenter",()=>{
material.current.uMatCap1.value = mat13
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})
document.querySelector(`.titles`).addEventListener("mouseleave",()=>{
material.current.uMatCap1.value = mat2
 
  gsap.to(material.current.uProgress,{
    value:0.0,
    duration:0.5,
    onComplete:()=>{
      material.current.uMatCap2.value = material.current.uMatCap1.value
      material.current.uProgress.value = 1.0
    }
  })

})
},[])


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
   
    </>
  );
}

export default Dog;
