"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScrollProgress;

  void main() {
    vColor = aColor;
    vec3 pos = position;

    float n1 = sin(pos.y * 0.4 + uTime * 0.6) * cos(pos.z * 0.3 + uTime * 0.4);
    float n2 = cos(pos.x * 0.35 + uTime * 0.5) * sin(pos.z * 0.4 + uTime * 0.3);
    float n3 = sin(pos.x * 0.3 + pos.y * 0.3 + uTime * 0.4);
    pos += normalize(pos) * (n1 + n2 + n3) * 0.55;

    float expandRadius = uScrollProgress * 18.0;
    pos += normalize(position) * expandRadius;

    float dissolve = 1.0 - uScrollProgress * 1.2;
    vAlpha = clamp(dissolve, 0.0, 1.0);

    vec4 projected = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec2 screenPos = projected.xy / projected.w;
    float mouseDist = distance(screenPos, uMouse);
    float mouseEffect = 1.0 - smoothstep(0.0, 0.5, mouseDist);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float pulse = sin(uTime * 0.4 + length(position) * 0.5) * 0.05 + 1.0;
    gl_PointSize = aSize * (320.0 / -mvPosition.z) * pulse * (1.0 + mouseEffect * 0.4);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;

    float glow = exp(-r * 2.5);
    float twinkle = fract(
      sin(dot(gl_PointCoord, vec2(127.1, 311.7)) + uTime * 0.3) * 43758.5453
    ) * 0.12 + 0.88;

    vec3 finalColor = vColor * glow * twinkle;
    float alpha = smoothstep(0.0, 1.0, glow) * vAlpha;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const RING_VERTEX = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uScrollProgress;

  void main() {
    vColor = aColor;
    float expand = uScrollProgress * 22.0;
    vec3 pos = position + normalize(position) * expand;
    float dissolve = 1.0 - uScrollProgress * 1.3;
    vAlpha = clamp(dissolve, 0.0, 1.0);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float twinkle = sin(uTime * 0.6 + position.x * 0.1 + position.z * 0.1) * 0.12 + 0.88;
    gl_PointSize = aSize * twinkle * (280.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const RING_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;
    float glow = exp(-r * 3.5);
    gl_FragColor = vec4(vColor * glow, glow * vAlpha * 0.7);
  }
`;

const STAR_VERTEX = `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vAlpha;
  uniform float uTime;
  uniform float uScrollProgress;

  void main() {
    vColor = aColor;
    vAlpha = uScrollProgress * 0.9;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float twinkle = sin(uTime * 0.8 + position.x * 0.06 + position.y * 0.1) * 0.18 + 0.82;
    gl_PointSize = aSize * twinkle * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const STAR_FRAGMENT = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    float r = dot(cxy, cxy);
    if (r > 1.0) discard;
    float glow = exp(-r * 4.0);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

export default function CosmicSphere() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    );
    camera.position.set(-10, 0, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uScrollProgress: { value: 0 },
    };

    // Sphere
    const PARTICLE_COUNT = 22000;
    const sPos = new Float32Array(PARTICLE_COUNT * 3);
    const sCol = new Float32Array(PARTICLE_COUNT * 3);
    const sSiz = new Float32Array(PARTICLE_COUNT);

    const palette = [
      new THREE.Color(0x2a2a2e),
      new THREE.Color(0x3a3b42),
      new THREE.Color(0x1b2a4a),
      new THREE.Color(0x252535),
      new THREE.Color(0x333340),
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT);
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi;
      const r = 5.5;
      sPos[i * 3] = r * Math.cos(theta) * Math.sin(phi);
      sPos[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      sPos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      sCol[i * 3] = c.r + (Math.random() - 0.5) * 0.06;
      sCol[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.06;
      sCol[i * 3 + 2] = c.b + (Math.random() - 0.5) * 0.06;
      sSiz[i] = Math.random() * 0.16 + 0.1;
    }

    const sphereGeo = new THREE.BufferGeometry();
    sphereGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sphereGeo.setAttribute("aColor", new THREE.BufferAttribute(sCol, 3));
    sphereGeo.setAttribute("aSize", new THREE.BufferAttribute(sSiz, 1));

    const sphereMat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const sphere = new THREE.Points(sphereGeo, sphereMat);
    const mainGroup = new THREE.Group();
    mainGroup.add(sphere);

    // Rings
    const rings = [];
    for (let i = 0; i < 8; i++) {
      const rCount = 2400;
      const rPos = new Float32Array(rCount * 3);
      const rCol = new Float32Array(rCount * 3);
      const rSiz = new Float32Array(rCount);
      const radius = 7.5 + (Math.random() - 0.5) * 1.5;

      for (let j = 0; j < rCount; j++) {
        const angle = (j / rCount) * Math.PI * 2;
        const rr = radius + (Math.random() - 0.5) * 0.5;
        rPos[j * 3] = Math.cos(angle) * rr;
        rPos[j * 3 + 1] = (Math.random() - 0.5) * 0.4;
        rPos[j * 3 + 2] = Math.sin(angle) * rr;
        const c = new THREE.Color().setHSL(
          0.6 + (i / 8) * 0.08,
          0.35,
          0.3 + Math.random() * 0.2
        );
        rCol[j * 3] = c.r;
        rCol[j * 3 + 1] = c.g;
        rCol[j * 3 + 2] = c.b;
        rSiz[j] = Math.random() * 0.1 + 0.06;
      }

      const rGeo = new THREE.BufferGeometry();
      rGeo.setAttribute("position", new THREE.BufferAttribute(rPos, 3));
      rGeo.setAttribute("aColor", new THREE.BufferAttribute(rCol, 3));
      rGeo.setAttribute("aSize", new THREE.BufferAttribute(rSiz, 1));

      const rMat = new THREE.ShaderMaterial({
        vertexShader: RING_VERTEX,
        fragmentShader: RING_FRAGMENT,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const ring = new THREE.Points(rGeo, rMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      rings.push(ring);
      mainGroup.add(ring);
    }

    scene.add(mainGroup);

    // Starfield
    const STAR_COUNT = 4000;
    const stPos = new Float32Array(STAR_COUNT * 3);
    const stCol = new Float32Array(STAR_COUNT * 3);
    const stSiz = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      stPos[i * 3] = (Math.random() - 0.5) * 600;
      stPos[i * 3 + 1] = (Math.random() - 0.5) * 600;
      stPos[i * 3 + 2] = (Math.random() - 0.5) * 600;
      const c = new THREE.Color().setHSL(
        0.6 + Math.random() * 0.1, 0.3, 0.55 + Math.random() * 0.35
      );
      stCol[i * 3] = c.r;
      stCol[i * 3 + 1] = c.g;
      stCol[i * 3 + 2] = c.b;
      stSiz[i] = 0.4 + Math.random() * 0.9;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(stPos, 3));
    starGeo.setAttribute("aColor", new THREE.BufferAttribute(stCol, 3));
    starGeo.setAttribute("aSize", new THREE.BufferAttribute(stSiz, 1));

    const starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERTEX,
      fragmentShader: STAR_FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const pointerTarget = new THREE.Vector2(-10, -10);
    const onMouseMove = (e) => {
      pointerTarget.set(
        ((e.clientX / window.innerWidth) * 2 - 1) * 0.35,
        (-(e.clientY / window.innerHeight) * 2 + 1) * 0.35
      );
    };
    const onMouseLeave = () => pointerTarget.set(-10, -10);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const t = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      uniforms.uScrollProgress.value = t;
      // Drift camera from right offset (7) to center (0) as scroll increases
      camera.position.x = -10 * (1 - Math.min(1, t * 2.5));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const clock = new THREE.Clock();
    let frameId;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.lerp(pointerTarget, 0.04);

      mainGroup.rotation.y += 0.00055;
      mainGroup.rotation.x = -0.18 + Math.sin(elapsed * 0.07) * 0.02;
      mainGroup.position.y = Math.sin(elapsed * 0.11) * 0.15;
      sphere.scale.setScalar(1 + Math.sin(elapsed * 0.2) * 0.015);

      rings.forEach((ring, i) => {
        const speed = 0.00045 * (i + 1);
        ring.rotation.z += speed;
        ring.rotation.x += speed * 0.18;
        ring.rotation.y += speed * 0.1;
      });

      stars.rotation.y += 0.00002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      scene.traverse((c) => {
        if (c.isPoints) { c.geometry?.dispose(); c.material?.dispose(); }
      });
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