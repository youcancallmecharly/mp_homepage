import { useEffect, useRef, useState } from "react";

type NodePoint = {
  lat: number;
  lon: number;
  type: "core" | "knots";
};

type CachePayload = {
  updatedAt?: string;
  totalNodes?: number;
  nodes?: NodePoint[];
};

export default function BitcoinNodeGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderNodesRef = useRef<(points: NodePoint[]) => void>();
  const [nodes, setNodes] = useState<NodePoint[]>([]);
  const [meta, setMeta] = useState<{ updatedAt?: string; totalNodes?: number }>(
    {}
  );

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
      camera.position.set(0, 0, 3.7);

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

      const ambient = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambient);
      const dir = new THREE.DirectionalLight(0xffffff, 0.7);
      dir.position.set(5, 3, 5);
      scene.add(dir);

      const RADIUS = 1;
      const globeGeometry = new THREE.SphereGeometry(RADIUS, 96, 96);
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load("/textures/earth-daymap.jpg");
      const globeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 8
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      const nodeGroup = new THREE.Group();
      scene.add(nodeGroup);

      const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xff4d4d });
      const knotsMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
      const nodeGeometry = new THREE.SphereGeometry(0.015, 8, 8);

      function latLonToVector3(lat: number, lon: number, radius: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -radius * Math.sin(phi) * Math.cos(theta);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      }

      const renderNodes = (points: NodePoint[]) => {
        while (nodeGroup.children.length) {
          const child = nodeGroup.children.pop();
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        }

        points.forEach((point) => {
          const mesh = new THREE.Mesh(
            nodeGeometry,
            point.type === "core" ? coreMaterial : knotsMaterial
          );
          const pos = latLonToVector3(point.lat, point.lon, RADIUS + 0.01);
          mesh.position.copy(pos);
          nodeGroup.add(mesh);
        });
      };

      renderNodesRef.current = renderNodes;

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
          globe.rotation.y += 0.0015;
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
        texture.dispose();
        globeGeometry.dispose();
        container.removeChild(renderer.domElement);
      };
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (renderNodesRef.current) {
      renderNodesRef.current(nodes);
    }
  }, [nodes]);

  useEffect(() => {
    let cancelled = false;

    async function loadCache() {
      try {
        const res = await fetch("/data/bitnodes-cache.json");
        if (!res.ok) throw new Error(`Cache fetch failed: ${res.status}`);
        const payload = (await res.json()) as CachePayload;
        if (cancelled) return;
        setNodes(payload.nodes ?? []);
        setMeta({
          updatedAt: payload.updatedAt,
          totalNodes: payload.totalNodes ?? payload.nodes?.length
        });
      } catch (error) {
        console.error("Unable to load cached node data", error);
      }
    }

    loadCache();

    return () => {
      cancelled = true;
    };
  }, []);

  const formattedMeta = meta.updatedAt
    ? new Date(meta.updatedAt).toLocaleString()
    : null;

  return (
    <div>
      <div ref={containerRef} className="mp-node-globe-container" />
      <div className="mp-node-globe-meta">
        {meta.totalNodes ? `${meta.totalNodes} nodes visualised` : "Loading…"}
        {formattedMeta ? ` • Cache updated ${formattedMeta}` : null}
      </div>
    </div>
  );
}



