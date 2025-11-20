import { useEffect, useRef } from "react";

// Simple Three.js-based globe initialisation inside a React component.
// This mirrors the behaviour of the standalone embed but keeps logic minimal
// and client-only for use inside Next.js pages.

export default function BitcoinNodeGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current || typeof window === "undefined") return;

      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );

      const container = containerRef.current;
      const { clientWidth: width, clientHeight: height } = container;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 0, 4);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.minDistance = 2.3;
      controls.maxDistance = 8;

      let isUserInteracting = false;
      let lastInteractionTime = Date.now();
      const AUTO_ROTATE_DELAY = 2500;

      controls.addEventListener("start", () => {
        isUserInteracting = true;
        lastInteractionTime = Date.now();
      });
      controls.addEventListener("end", () => {
        lastInteractionTime = Date.now();
        setTimeout(() => {
          isUserInteracting = false;
        }, AUTO_ROTATE_DELAY);
      });

      const ambient = new THREE.AmbientLight(0xffffff, 0.7);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 0.6);
      dir.position.set(5, 3, 5);
      scene.add(dir);

      const RADIUS = 1;
      const globeGeometry = new THREE.SphereGeometry(RADIUS, 64, 64);
      const globeMaterial = new THREE.MeshStandardMaterial({
        color: 0x224466,
        roughness: 1,
        metalness: 0
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      function latLonToVector3(lat: number, lon: number, radius: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      }

      function addNode(lat: number, lon: number, type: "core" | "knots") {
        const color = type === "core" ? 0xff4444 : 0xff9900;
        const nodeGeometry = new THREE.SphereGeometry(0.015, 6, 6);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        const pos = latLonToVector3(lat, lon, RADIUS + 0.01);
        node.position.copy(pos);
        scene.add(node);
      }

      function addDummyNodes() {
        const dummyNodes = [
          { lat: 37.7749, lon: -122.4194, type: "core" as const },
          { lat: 40.7128, lon: -74.006, type: "knots" as const },
          { lat: 51.5074, lon: -0.1278, type: "core" as const },
          { lat: 52.52, lon: 13.405, type: "knots" as const },
          { lat: 35.6895, lon: 139.6917, type: "core" as const },
          { lat: -33.8688, lon: 151.2093, type: "knots" as const },
          { lat: 1.3521, lon: 103.8198, type: "core" as const }
        ];
        dummyNodes.forEach((n) => addNode(n.lat, n.lon, n.type));
      }

      async function loadNodes() {
        try {
          const res = await fetch(
            "https://bitnodes.io/api/v1/snapshots/latest/"
          );
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (!data.nodes) throw new Error("Unexpected response format");

          const entries = Object.entries(data.nodes) as any[];
          const maxNodes = 800;
          for (let i = 0; i < entries.length && i < maxNodes; i++) {
            const [, nodeInfo] = entries[i];
            const lat = nodeInfo[5];
            const lon = nodeInfo[6];
            if (typeof lat === "number" && typeof lon === "number") {
              const type = Math.random() > 0.5 ? "core" : "knots";
              addNode(lat, lon, type);
            }
          }
        } catch (e) {
          console.error(e);
          addDummyNodes();
        }
      }

      loadNodes();

      function handleResize() {
        if (!container) return;
        const { clientWidth, clientHeight } = container;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
      }

      window.addEventListener("resize", handleResize);

      const animate = () => {
        if (!mounted) return;
        requestAnimationFrame(animate);

        const now = Date.now();
        const timeSinceInteraction = now - lastInteractionTime;
        if (!isUserInteracting && timeSinceInteraction > AUTO_ROTATE_DELAY) {
          globe.rotation.y += 0.0018;
        }

        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        mounted = false;
        window.removeEventListener("resize", handleResize);
        controls.dispose();
        renderer.dispose();
        container.removeChild(renderer.domElement);
      };
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  return <div ref={containerRef} className="mp-node-globe-container" />;
}


