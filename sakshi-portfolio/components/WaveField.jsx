"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Particle wave field: a quiet, ambient grid of points rippling gently.
// Restrained by design - visible enough to register, never competing
// with foreground text.

const VERTEX_SHADER = `
  uniform float uTime;
  uniform float uAmplitude;
  uniform vec2 uField;
  attribute float aSize;

  varying float vWave;

  void main() {
    vec3 pos = position;
    float waveX = cos((pos.x / uField.x) * 3.14159265 * 6.0 + uTime * 0.6);
    float waveZ = sin((pos.z / uField.y) * 3.14159265 * 6.0 + uTime * 0.45);
    pos.y += (waveX + waveZ) * uAmplitude;
    vWave = (waveX + waveZ) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (260.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vWave;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float dist = dot(uv, uv);
    if (dist > 1.0) discard;

    float falloff = pow(1.0 - clamp(dist, 0.0, 1.0), 2.4);
    vec3 color = mix(uColorA, uColorB, clamp(vWave * 0.5 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(color, falloff * uOpacity);
  }
`;

export default function WaveField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const FIELD_SIZE = 380;
    const STEP = 13;
    const segments = Math.round(FIELD_SIZE / STEP);
    const count = (segments + 1) * (segments + 1);

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    let ptr = 0;
    const half = (segments * STEP) / 2;

    for (let xi = 0; xi <= segments; xi++) {
      const x = -half + xi * STEP;
      for (let zi = 0; zi <= segments; zi++) {
        const z = -half + zi * STEP;
        positions[ptr * 3] = x;
        positions[ptr * 3 + 1] = 0;
        positions[ptr * 3 + 2] = z;
        sizes[ptr] = 1.6 + Math.random() * 1.2;
        ptr++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: 6 },
        uField: { value: new THREE.Vector2(half * 2, half * 2) },
        uColorA: { value: new THREE.Color(0x6b6c72) },
        uColorB: { value: new THREE.Color(0x4a5578) },
        uOpacity: { value: 0.32 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.set(0, 95, 165);
    camera.lookAt(0, -20, -40);

    const pointerTarget = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };

    const handlePointerMove = (e) => {
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frameId;
    let t = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.006;

      pointer.x += (pointerTarget.x - pointer.x) * 0.05;
      pointer.y += (pointerTarget.y - pointer.y) * 0.05;

      if (!prefersReducedMotion) {
        material.uniforms.uTime.value = t;
        camera.position.x = pointer.x * 20;
        camera.position.y = 95 - pointer.y * 12;
        camera.lookAt(pointer.x * 10, -20, -40);
      }

      const progress = parseFloat(
        document.documentElement.getAttribute("data-scroll-progress") || "0"
      );
      material.uniforms.uOpacity.value = 0.28 + progress * 0.18;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -10, pointerEvents: "none" }}
    />
  );
}