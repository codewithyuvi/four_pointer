import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  connections: number[];
}

export default function BlockchainNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const frameRef = useRef<number>(0);
  const flashRef = useRef<{ x: number; y: number; t: number }[]>([]);

  const init = useCallback(() => {
    const count = 40;
    const nodes: Node[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        radius: 2 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        connections: [],
      });
    }
    // Create connections
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx * dx + dy * dy) < 25 && nodes[i].connections.length < 3) {
          nodes[i].connections.push(j);
        }
      }
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    init();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    // Random flash every few seconds
    const flashInterval = setInterval(() => {
      const nodes = nodesRef.current;
      if (nodes.length > 0) {
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        flashRef.current.push({ x: n.x, y: n.y, t: 1 });
      }
    }, 3000);

    const draw = () => {
      frameRef.current++;
      const t = frameRef.current * 0.01;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > 100) node.vx *= -1;
        if (node.y < 0 || node.y > 100) node.vy *= -1;
        node.x = Math.max(0, Math.min(100, node.x));
        node.y = Math.max(0, Math.min(100, node.y));
      }

      // Draw connections
      for (const node of nodes) {
        for (const ci of node.connections) {
          const other = nodes[ci];
          const x1 = (node.x / 100) * w;
          const y1 = (node.y / 100) * h;
          const x2 = (other.x / 100) * w;
          const y2 = (other.y / 100) * h;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(191, 90, 242, 0.12)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw nodes
      for (const node of nodes) {
        const x = (node.x / 100) * w;
        const y = (node.y / 100) * h;
        const pulse = Math.sin(t * 2 + node.pulsePhase) * 0.3 + 0.7;
        const r = node.radius * (w / 1000);

        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 209, ${0.05 * pulse})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 209, ${0.4 * pulse})`;
        ctx.fill();
      }

      // Draw flashes
      flashRef.current = flashRef.current.filter(f => {
        f.t -= 0.02;
        if (f.t <= 0) return false;
        const x = (f.x / 100) * w;
        const y = (f.y / 100) * h;
        const r = (1 - f.t) * 30 * (w / 1000);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 0, ${f.t * 0.3})`;
        ctx.fill();
        return true;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(flashInterval);
      window.removeEventListener("resize", resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
