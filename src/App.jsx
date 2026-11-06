import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, Center, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ==================================================================
   1. CONTENT CONFIGURATION (PROFESSIONAL LUXURY HOROLOGY COPY)
================================================================== */
const CONFIG = {
  brand: "TEMPUS",
  heroTitle: "TEMPUS 01",
  modelLabel: "Model",
  modelName: "146GR Chronograph",
  colorLabel: "Finish",
  colorName: "Silver Steel & Emerald Dial",
  heroSub: "The timeless Swiss automatic chronograph. Precision engineering, crafted to endure for generations.",
  ctaLabel: "Order now",
  ctaUrl: "#finish",
  price: "From $1,290",
  statement: ["THE", "TIMELESS", "AUTOMATIC", "41MM"],
  details: [
    {
      title: "Case & Architectural Finishes",
      text: "Sculpted from marine-grade 316L stainless steel, featuring hand-beveled mirror chamfers and vertical satin-brushed surfaces designed to catch light from every angle."
    },
    {
      title: "Dial & Tri-Compax Complications",
      text: "Sunburst emerald dial with concentric azurage sub-dials, precision tachymeter bezel, and high-intensity Super-LumiNova BGW9 luminescence for legibility in any light."
    },
  ],
  features: [
    {
      n: "01",
      word: "SAPPHIRE",
      title: "Anti-Reflective Sapphire Crystal",
      text: "Double-domed synthetic sapphire crystal with multi-layered anti-reflective coating on both interior and exterior surfaces, delivering scratch-proof optical clarity under direct sunlight.",
      img: "/assets/feature_sapphire.jpg",
      badge: "Mohs Hardness 9",
    },
    {
      n: "02",
      word: "AUTOMATIC",
      title: "Calibre T-01 Mechanical Movement",
      text: "Proprietary Swiss-engineered automatic chronograph beating at 28,800 vibrations per hour (4 Hz). Equipped with 25 ruby jewel bearings and an extended 72-hour power reserve.",
      img: "/assets/feature_movement.jpg",
      badge: "72h Power Reserve",
    },
    {
      n: "03",
      word: "316L STEEL",
      title: "Solid 316L Oyster Bracelet",
      text: "Crafted from marine-grade 316L solid stainless steel with hand-beveled chamfers, vertical brushed satin links, and a precision micro-adjusting deployment clasp.",
      img: "/assets/feature_steel.jpg",
      badge: "Solid 316L Steel",
    },
    {
      n: "04",
      word: "100M DIVE",
      title: "Hermetic Water Resistance",
      text: "Engineered with a screw-down crown and dual fluoroelastomer gaskets, tested to withstand pressures of 10 ATM (100 meters / 330 feet) for daily swimming and marine adventure.",
      img: "/assets/feature_sapphire.jpg",
      badge: "10 ATM / 330 FT",
    },
  ],
  anatomyTitle: "Anatomy of Precision",
  anatomySub: "Explore the microscopic craftsmanship of the TEMPUS 01",
  dark: { title: "Crafted in motion", text: "Every gear, bridge, and jewel operates in absolute mechanical equilibrium." },
  contours: { title: "Sculpted contours", text: "The curved dial, faceted indices, and beveled lugs, inspected at the micron scale." },
  specs: [
    { v: 41, s: " mm", label: "Case diameter" },
    { v: 100, s: " m", label: "Water resistance" },
    { v: 72, s: " h", label: "Power reserve" },
    { v: 316, s: "L", label: "Stainless steel" },
  ],
  techTitle: "Technical specifications",
  techSpecs: [
    ["Calibre", "Calibre T-01 Automatic Chronograph, 28,800 vph, 25 jewels"],
    ["Case Dimensions", "316L stainless steel, 41 mm diameter, 12.8 mm thickness"],
    ["Crystal", "Domed sapphire crystal, dual-sided anti-reflective coating"],
    ["Bezel", "Ceramic tachymeter bezel with laser-etched graduations"],
    ["Water Resistance", "100 m / 10 ATM / 330 ft (screw-down crown)"],
    ["Bracelet & Clasp", "Solid 316L steel oyster links, micro-adjusting deployment clasp"],
    ["Power Reserve", "72 hours continuous reserve"],
    ["Warranty", "5-Year International Manufacturer Warranty"],
  ],
  faqTitle: "Frequently asked questions",
  faq: [
    {
      q: "What does the 5-year international warranty cover?",
      a: "Every TEMPUS timepiece includes an unbroken 5-year international manufacturer warranty covering all internal mechanical components, timing accuracy, and hermetic seals. Servicing is conducted exclusively by master horologists."
    },
    {
      q: "What are the shipping options and delivery timelines?",
      a: "We provide complimentary white-glove, fully insured worldwide shipping on all orders. Deliveries typically arrive within 3 to 5 business days via tracked priority courier with signature requirement upon delivery."
    },
    {
      q: "What is your return and exchange policy?",
      a: "We offer a 30-day trial period. If you are not completely enchanted with your timepiece, you may return it in its original unworn condition with all protective seals intact for a full, hassle-free refund or exchange."
    },
    {
      q: "How often should an automatic watch be serviced?",
      a: "We recommend a routine inspection and recalibration every 4 to 5 years to ensure optimal synthetic lubrication, chronometer-grade timing accuracy, and fresh gasket seals."
    },
  ],
  finish: { title: "Choose your finish" },
  marquee: ["Swiss Automatic", "41mm Chronometer", "Sapphire Crystal", "316L Steel", "100M Water Resistant", "Super-LumiNova"],
  footerLinks: [
    { label: "Instagram", url: "#" },
    { label: "LinkedIn", url: "#" },
    { label: "Concierge", url: "#" },
  ],
  credit: '"Watch – Luxury Wristwatch 3D Model" by DevPoly3D, licensed under CC BY 4.0.',
};

const FINISHES = [
  { name: "Original", color: null, tone: "#489f65" },
  { name: "Black", color: "#222222", tone: "#1a1a1a" },
  { name: "Gold", color: "#d4af37", tone: "#d4af37" },
  { name: "Rose", color: "#b76e79", tone: "#b76e79" },
];

const HOTSPOTS = [
  {
    id: "bezel",
    num: "01",
    label: "Ceramic Bezel",
    tag: "Tachymeter Scale",
    desc: "Laser-etched high-tech ceramic bezel impervious to scratching and UV fading, calibrated for measuring elapsed speed over distance.",
  },
  {
    id: "dial",
    num: "02",
    label: "Emerald Dial",
    tag: "Tri-Compax Chronograph",
    desc: "Sunburst textured dial with concentric azurage sub-dials and Super-LumiNova BGW9 luminous markers for legibility in total darkness.",
  },
  {
    id: "crown",
    num: "03",
    label: "Screw-Down Crown",
    tag: "Hermetic Seal 100M",
    desc: "Knurled steel crown equipped with dual fluoroelastomer gaskets, engineered to resist pressures up to 10 ATM (100 meters).",
  },
  {
    id: "clasp",
    num: "04",
    label: "Oyster Clasp",
    tag: "Micro-Adjustment",
    desc: "Solid 316L stainless steel folding deployment clasp with dual safety pushers and 5mm tool-free comfort extension.",
  },
];

/* ==================================================================
   2. WATCH CHOREOGRAPHY (DESKTOP & MOBILE RESPONSIVE POSES)
================================================================== */
const TAU = Math.PI * 2;

// Desktop Poses
const POSE = {
  hero:      { ry: 0,         rx: 0,    x: 0,     y: 0,    s: 1 },
  statement: { ry: -0.6,      rx: 0.2,  x: -0.4,  y: 0,    s: 1 },
  details:   { ry: TAU,       rx: 0,    x: 0.4,   y: 0,    s: 1 },
  features:  { ry: TAU,       rx: 0.05, x: 0,     y: 0.45, s: 0.85 },
  anatomy:   { ry: TAU + 0.35, rx: 0.12, x: 0.3,   y: 0,    s: 1.1 },
  dark:      { ry: TAU + 0.4, rx: 0.1,  x: 0,     y: 0.4,  s: 0.85 },
  contours:  { ry: TAU,       rx: 0,    x: 0,     y: -0.5, s: 1.9 },
  specs:     { ry: TAU - 0.5, rx: 0.1,  x: -0.45, y: 0,    s: 1 },
  table:     { ry: TAU + 0.3, rx: 0.05, x: 0.4,   y: 0,    s: 1 },
  faq:       { ry: TAU - 0.3, rx: 0.05, x: -0.4,  y: 0,    s: 0.95 },
  finish:    { ry: TAU,       rx: 0,    x: 0,     y: 0.4,  s: 0.8 },
};

// Mobile Poses: Watch sits in the upper 40% with tuned scale and zero text overlap
const MOBILE_POSE = {
  hero:      { ry: 0,         rx: 0,    x: 0, y: 0.32, s: 0.62 },
  statement: { ry: -0.6,      rx: 0.15, x: 0, y: 0.44, s: 0.58 },
  details:   { ry: TAU,       rx: 0,    x: 0, y: 0.44, s: 0.58 },
  features:  { ry: TAU,       rx: 0.05, x: 0, y: 0.46, s: 0.56 },
  anatomy:   { ry: TAU + 0.35, rx: 0.12, x: 0, y: 0.42, s: 0.62 },
  dark:      { ry: TAU + 0.4, rx: 0.1,  x: 0, y: 0.42, s: 0.60 },
  contours:  { ry: TAU,       rx: 0,    x: 0, y: 0.22, s: 1.05 },
  specs:     { ry: TAU - 0.5, rx: 0.1,  x: 0, y: 0.44, s: 0.58 },
  table:     { ry: TAU + 0.3, rx: 0.05, x: 0, y: 0.46, s: 0.56 },
  faq:       { ry: TAU - 0.3, rx: 0.05, x: 0, y: 0.46, s: 0.56 },
  finish:    { ry: TAU,       rx: 0,    x: 0, y: 0.42, s: 0.60 },
};

let currentZone = "hero";
const initialIsMobile = typeof window !== "undefined" && window.innerWidth < 800;
const pose = { ...(initialIsMobile ? MOBILE_POSE.hero : POSE.hero) };

const mouse = { x: 0, y: 0 };
const vel = { v: 0 };   // scroll velocity
const hp = { v: 0 };    // progress of the horizontal features section (0..1)
const dark = { v: 0 };  // 1 while a dark section is active

/* Web Audio API Micro-Sound Synthesizer */
function playClickSound(freq = 750) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

/* ==================================================================
   3. 3D WATCH & VISUAL EFFECTS
================================================================== */
function Watch({ finish }) {
  const anim = useRef();
  const { scene } = useGLTF("/watch.glb");

  // Recolor metal materials when a finish is chosen
  useEffect(() => {
    scene.traverse((o) => {
      if (!o.isMesh) return;
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
        if (!m.color) return;
        if (!m.userData.orig) m.userData.orig = m.color.clone();
        if (m.metalness > 0.5) {
          if (finish.color) m.color.set(finish.color);
          else m.color.copy(m.userData.orig);
        }
      });
    });
  }, [finish, scene]);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    return 2 / Math.max(size.x, size.y, size.z);
  }, [scene]);

  useFrame((state, dt) => {
    const g = anim.current;
    if (!g) return;
    const w = state.size.width;
    const mobile = w < 800;
    const kx = w >= 1100 ? 1 : w >= 800 ? 0.7 : 0;
    const halfW = state.viewport.width / 2;
    const d = THREE.MathUtils.damp;

    // Smooth rotational damping with subtle mouse tilt on desktop
    g.rotation.y = d(g.rotation.y, pose.ry + hp.v * TAU + (mobile ? 0 : mouse.x * 0.25), 4, dt);
    g.rotation.x = d(g.rotation.x, pose.rx - (mobile ? 0 : mouse.y * 0.15), 4, dt);
    g.rotation.z = d(g.rotation.z, vel.v * 0.12, 4, dt);

    // Responsive X and Y positioning
    g.position.x = d(g.position.x, mobile ? pose.x : pose.x * halfW * kx, 4, dt);
    g.position.y = d(g.position.y, pose.y, 4, dt);
    g.scale.setScalar(d(g.scale.x, pose.s, 4, dt));
  });

  return (
    <group ref={anim}>
      <group scale={fit}>
        <Center>
          <primitive object={scene} />
        </Center>
      </group>
    </group>
  );
}
useGLTF.preload("/watch.glb");

function DynamicShadow() {
  const ref = useRef();
  useFrame((state, dt) => {
    if (!ref.current) return;
    const mobile = state.size.width < 800;
    const targetY = mobile ? -0.48 : -1.2;
    const targetScale = mobile ? 7 : 10;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, targetY, 4, dt);
    ref.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, targetScale, 4, dt);
    ref.current.scale.z = THREE.MathUtils.damp(ref.current.scale.z, targetScale, 4, dt);
  });
  return <ContactShadows ref={ref} position={[0, initialIsMobile ? -0.48 : -1.2, 0]} opacity={0.4} blur={2.5} scale={initialIsMobile ? 7 : 10} />;
}

// Particle field optimized for mobile CPU/battery
function Particles() {
  const ref = useRef();
  const isMobile = typeof window !== "undefined" && window.innerWidth < 800;
  const positions = useMemo(() => {
    const cols = isMobile ? 55 : 140;
    const rows = isMobile ? 28 : 70;
    const pos = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        pos[i++] = (x / cols - 0.5) * 14;
        pos[i++] = 0;
        pos[i++] = (z / rows - 0.5) * 8;
      }
    }
    return pos;
  }, [isMobile]);

  useFrame(({ clock }) => {
    const pts = ref.current;
    if (!pts) return;
    const t = clock.elapsedTime;
    const attr = pts.geometry.attributes.position;
    const arr = attr.array;
    for (let i = 0; i < arr.length; i += 3) {
      const x = arr[i];
      const z = arr[i + 2];
      arr[i + 1] = Math.sin(x * 0.8 + t) * 0.3 + Math.cos(z * 1.2 + t * 0.8) * 0.2;
    }
    attr.needsUpdate = true;
    pts.material.opacity = dark.v * 0.8;
  });

  return (
    <points ref={ref} position={[0, -1, -1.5]} rotation={[0.2, 0, -0.2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#888888" transparent opacity={0} depthWrite={false} />
    </points>
  );
}

function SweepLight() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.x = Math.sin(clock.elapsedTime * 0.8) * 3;
  });
  return <pointLight ref={ref} position={[0, 1, 3]} intensity={15} distance={10} />;
}

/* ==================================================================
   4. UI HELPERS
================================================================== */
function Letters({ text }) {
  return text.split("").map((c, i) => (
    <span className="lt" key={i}>
      <span>{c === " " ? "\u00A0" : c}</span>
    </span>
  ));
}

function Split({ text, as: Tag = "span", className = "" }) {
  return (
    <Tag className={`split ${className}`}>
      {text.split(" ").map((w, i) => (
        <span className="w" key={i}>
          <span className="wi">{w}</span>{" "}
        </span>
      ))}
    </Tag>
  );
}

function Marquee({ items, reverse = false }) {
  const row = items.map((t, i) => (
    <span key={i} className="marq-item">
      {t}
      <b>✦</b>
    </span>
  ));
  return (
    <div className={`marq ${reverse ? "rev" : ""}`}>
      <div className="marq-track">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

function Loader({ onDone }) {
  const { progress } = useProgress();
  const [minDone, setMinDone] = useState(false);
  const [forced, setForced] = useState(false);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const a = setTimeout(() => setMinDone(true), 1500);
    const b = setTimeout(() => setForced(true), 7000);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  const done = minDone && (progress >= 100 || forced);

  useEffect(() => {
    if (done && !fired) {
      setFired(true);
      onDone();
    }
  }, [done, fired, onDone]);

  return (
    <div className={`loader ${done ? "done" : ""}`}>
      <span>{Math.round(forced ? 100 : progress)}</span>
      <small>{CONFIG.brand}</small>
    </div>
  );
}

/* ==================================================================
   5. PAGE MASTER COMPONENT
================================================================== */
export default function App() {
  const lenisRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [finish, setFinish] = useState(FINISHES[0]);
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState(0); // First FAQ open by default
  const [activeHotspot, setActiveHotspot] = useState(HOTSPOTS[0]);

  const go = (id) => {
    if (!lenisRef.current) return;
    playClickSound(600);
    lenisRef.current.scrollTo(id === "top" ? 0 : `#${id}`, { duration: 1.4 });
  };

  /* Hide intro elements until loader is finished */
  useEffect(() => {
    gsap.set(".hero-title .lt > span", { yPercent: 115 });
    gsap.set(".hero-meta, .hero-sub, .hero-btn, .scroll-hint, .nav", { opacity: 0, y: 30 });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-title .lt > span", { yPercent: 0, duration: 1.2, stagger: 0.05, ease: "power4.out" });
      gsap.to(".hero-meta, .hero-sub, .hero-btn, .scroll-hint, .nav", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.5,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, [ready]);

  /* Scroll, GSAP, and Smooth Scrolling lifecycle */
  useEffect(() => {
    const cleanups = [];

    // Initialize smooth scrolling with native mobile touch sensitivity
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    cleanups.push(() => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    });

    // Custom cursor and magnetic physics (desktop only)
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (canHover) {
      const xTo = gsap.quickTo(".cursor", "x", { duration: 0.25 });
      const yTo = gsap.quickTo(".cursor", "y", { duration: 0.25 });
      const cursor = document.querySelector(".cursor");
      const onMove = (e) => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const onOver = (e) => cursor && cursor.classList.toggle("big", !!e.target.closest("a, button, summary, .faq-item, .hotspot-pill"));
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseover", onOver);
      cleanups.push(() => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseover", onOver);
      });

      document.querySelectorAll(".magnetic").forEach((el) => {
        const mv = (e) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, {
            x: (e.clientX - (r.left + r.width / 2)) * 0.25,
            y: (e.clientY - (r.top + r.height / 2)) * 0.25,
            duration: 0.35,
          });
        };
        const lv = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("mousemove", mv);
        el.addEventListener("mouseleave", lv);
        cleanups.push(() => {
          el.removeEventListener("mousemove", mv);
          el.removeEventListener("mouseleave", lv);
        });
      });
    }

    const ctx = gsap.context(() => {
      /* 1) PINNED HORIZONTAL FEATURES ON DESKTOP, FLUID VERTICAL SCROLL ON MOBILE */
      const track = document.querySelector(".feat-track");
      if (track && window.innerWidth > 800) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".features",
            start: "top top",
            end: () => "+=" + (track.scrollWidth - window.innerWidth),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => (hp.v = self.progress),
          },
        });
      } else {
        ScrollTrigger.create({
          trigger: ".features",
          start: "top bottom",
          end: "bottom top",
          refreshPriority: 1,
          onUpdate: (self) => (hp.v = self.progress),
        });
      }

      /* 2) Scroll velocity, nav hide/show, sticky bottom order bar */
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          vel.v = THREE.MathUtils.clamp(self.getVelocity() / 3000, -2, 2);
          document.querySelector(".nav")?.classList.toggle("hide", self.direction === 1 && self.scroll() > 200);
          document.querySelector(".sticky")?.classList.toggle("show", self.scroll() > window.innerHeight * 0.8);
        },
      });
      ScrollTrigger.create({
        trigger: ".finish",
        start: "top 60%",
        end: "max",
        onToggle: (self) => document.querySelector(".sticky")?.classList.toggle("off", self.isActive),
      });

      /* Top reading progress line */
      gsap.to(".topbar-fill", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true },
      });

      /* 3) Dynamic Zone Poser (Desktop & Mobile) */
      gsap.utils.toArray(".zone").forEach((el) => {
        const zoneName = el.dataset.zone;
        const isDark = el.dataset.theme === "dark";
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (!self.isActive) return;
            currentZone = zoneName;
            const isMobile = window.innerWidth < 800;
            const targetPose = (isMobile && MOBILE_POSE[zoneName]) ? MOBILE_POSE[zoneName] : POSE[zoneName];
            if (targetPose) Object.assign(pose, targetPose);
            gsap.to(".bg-dark", { opacity: isDark ? 1 : 0, duration: 0.8, overwrite: "auto" });
            gsap.to(document.body, { color: isDark ? "#f2f0ea" : "#0a0a0a", duration: 0.7, overwrite: "auto" });
            gsap.to(dark, { v: isDark ? 1 : 0, duration: 0.8, overwrite: "auto" });
          },
        });
      });

      /* Hero title fades out, ring draws */
      gsap.to(".hero-title", {
        opacity: 0,
        scale: 0.92,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "+=700", scrub: true },
      });
      const ringTrigger = { trigger: document.body, start: "top top", end: "+=900", scrub: true };
      gsap.fromTo(".ring circle", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: ringTrigger });
      gsap.to(".ring", { rotation: 180, ease: "none", scrollTrigger: ringTrigger });
      gsap.to(".ring", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: ".statement", start: "top 60%", end: "top 20%", scrub: true },
      });

      /* Statement words reveal */
      gsap.utils.toArray(".words span").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          delay: i * 0.08,
          scrollTrigger: { trigger: ".statement", start: "top 65%" },
        });
      });

      /* Content reveals & text splits */
      gsap.utils.toArray(".split").forEach((el) => {
        gsap.from(el.querySelectorAll(".wi"), {
          yPercent: 115,
          duration: 1,
          stagger: 0.04,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 50, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      /* Marquees track drift with scroll */
      gsap.utils.toArray(".marq").forEach((el) => {
        const track = el.querySelector(".marq-track");
        if (!track) return;
        gsap.fromTo(
          track,
          { x: el.classList.contains("rev") ? -60 : 60 },
          {
            x: el.classList.contains("rev") ? 60 : -60,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      /* Numeric spec counters */
      gsap.utils.toArray(".stat-num").forEach((el) => {
        const end = Number(el.dataset.v);
        const suf = el.dataset.s || "";
        const o = { v: 0 };
        el.textContent = "0" + suf;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(o, {
              v: end,
              duration: 2,
              ease: "power3.out",
              onUpdate: () => (el.textContent = Math.round(o.v) + suf),
            }),
        });
      });
    });

    // Orientation change and window resize listener
    const onResize = () => {
      ScrollTrigger.refresh();
      const isMobile = window.innerWidth < 800;
      const target = isMobile ? (MOBILE_POSE[currentZone] || MOBILE_POSE.hero) : (POSE[currentZone] || POSE.hero);
      if (target) Object.assign(pose, target);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    cleanups.push(() => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    });

    // Re-measure ScrollTrigger once custom fonts render
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      <Loader onDone={() => setReady(true)} />

      <div className="topbar"><div className="topbar-fill" /></div>

      <nav className="nav">
        <button className="brand" onClick={() => go("top")}>{CONFIG.brand}</button>
        <div className="links">
          <button onClick={() => go("details")}>Details</button>
          <button onClick={() => go("features")}>Features</button>
          <button onClick={() => go("anatomy")}>Anatomy</button>
          <button onClick={() => go("finish")}>Finishes</button>
          <button onClick={() => go("faq")}>FAQ</button>
          <a className="order" href={CONFIG.ctaUrl}>{CONFIG.ctaLabel}</a>
        </div>
      </nav>

      <div className="sticky">
        <div className="sticky-info">
          <strong>{CONFIG.modelName}</strong>
          <span>{CONFIG.price}</span>
        </div>
        <a className="order gold" href={CONFIG.ctaUrl} onClick={() => playClickSound(800)}>{CONFIG.ctaLabel}</a>
      </div>

      <div className="bg" />
      <div className="bg-dark" />

      <svg className="ring" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" pathLength="1" strokeDasharray="1" strokeDashoffset="1" />
      </svg>

      <h1 className="hero-title" aria-label={CONFIG.heroTitle}>
        <Letters text={CONFIG.heroTitle} />
      </h1>

      <div className="canvas-wrap">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 35 }}
          dpr={typeof window !== "undefined" && window.innerWidth < 800 ? [1, 1.5] : [1, 2]}
          gl={{ powerPreference: "high-performance", antialias: true }}
        >
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <SweepLight />
            <Particles />
            <Watch finish={finish} />
            <DynamicShadow />
          </Suspense>
        </Canvas>
      </div>

      <div className="cursor"><i /></div>
      <div className="grain" />

      <main className="content">
        {/* 1. HERO */}
        <header className="zone sec hero" id="top" data-zone="hero" data-theme="light">
          <div className="hero-meta">
            <small>{CONFIG.modelLabel}</small>
            <strong>{CONFIG.modelName}</strong>
            <em>{CONFIG.colorLabel}: {CONFIG.colorName}</em>
          </div>
          <div className="hero-right">
            <p className="hero-sub">{CONFIG.heroSub}</p>
            <a className="order big hero-btn magnetic" href={CONFIG.ctaUrl} onClick={() => playClickSound(800)}>{CONFIG.ctaLabel}</a>
          </div>
          <div className="scroll-hint"><span>Scroll</span><i /></div>
        </header>

        {/* 2. STATEMENT */}
        <section className="zone sec statement" data-zone="statement" data-theme="light">
          <div className="words">
            {CONFIG.statement.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
        </section>

        <Marquee items={CONFIG.marquee} />

        {/* 3. DETAILS */}
        <section className="zone sec left" id="details" data-zone="details" data-theme="light">
          <div className="reveal">
            {CONFIG.details.map((d) => (
              <div key={d.title} className="detail">
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FEATURES WITH 8K EDITORIAL MACRO IMAGES */}
        <div className="zone features-wrap" id="features" data-zone="features" data-theme="light">
          <section className="features">
            <div className="feat-track">
              <div className="feat-intro">
                <p className="eyebrow">( Features & Materials )</p>
                <h2 className="h2">Built to endure</h2>
                <p className="muted">Scroll through microscopic precision →</p>
              </div>
              {CONFIG.features.map((f) => (
                <div className="feat" key={f.n}>
                  <div className="feat-card-visual">
                    <img src={f.img} alt={f.title} className="feat-macro-img" loading="lazy" />
                    <span className="feat-pill-badge">{f.badge}</span>
                  </div>
                  <div className="feat-word">{f.word}</div>
                  <div className="feat-cap">
                    <span className="num">{f.n}</span>
                    <h3>{f.title}</h3>
                    <p>{f.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 5. INTERACTIVE ANATOMY & HOTSPOTS INSPECTION */}
        <section className="zone sec anatomy-sec" id="anatomy" data-zone="anatomy" data-theme="light">
          <div className="anatomy-inner reveal">
            <div className="anatomy-header">
              <p className="eyebrow">( Horological Engineering )</p>
              <h2 className="h2 mid">{CONFIG.anatomyTitle}</h2>
              <p className="anatomy-lead">{CONFIG.anatomySub}</p>
            </div>

            <div className="anatomy-interactive-area">
              <div className="hotspot-pills">
                {HOTSPOTS.map((h) => (
                  <button
                    key={h.id}
                    className={`hotspot-pill ${activeHotspot.id === h.id ? "is-active" : ""}`}
                    onClick={() => {
                      playClickSound(700);
                      setActiveHotspot(h);
                    }}
                  >
                    <span className="h-num">{h.num}</span>
                    <span className="h-name">{h.label}</span>
                  </button>
                ))}
              </div>

              <div className="hotspot-detail-card">
                <div className="h-card-top">
                  <span className="h-card-tag">{activeHotspot.tag}</span>
                  <span className="h-card-num">{activeHotspot.num} / 04</span>
                </div>
                <h3 className="h-card-title">{activeHotspot.label}</h3>
                <p className="h-card-desc">{activeHotspot.desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DARK + PARTICLES */}
        <section className="zone sec center bottom dark" data-zone="dark" data-theme="dark">
          <div className="reveal">
            <h2 className="h2 mid">{CONFIG.dark.title}</h2>
            <p>{CONFIG.dark.text}</p>
          </div>
        </section>

        {/* 7. CONTOURS (close-up) */}
        <section className="zone sec center top" data-zone="contours" data-theme="light">
          <div className="reveal">
            <h2 className="h2 mid">{CONFIG.contours.title}</h2>
            <p>{CONFIG.contours.text}</p>
          </div>
        </section>

        {/* 8. SPEC COUNTERS */}
        <section className="zone sec specs" data-zone="specs" data-theme="light">
          <div className="spec-grid">
            {CONFIG.specs.map((s) => (
              <div className="spec reveal" key={s.label}>
                <span className="stat-num" data-v={s.v} data-s={s.s} />
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </section>

        <Marquee items={CONFIG.marquee} reverse />

        {/* 9. TECHNICAL SPECIFICATIONS */}
        <section className="zone sec left tablesec" data-zone="table" data-theme="light">
          <div className="tspec reveal">
            <h2 className="h2 mid">{CONFIG.techTitle}</h2>
            {CONFIG.techSpecs.map(([k, v]) => (
              <div className="row" key={k}>
                <span>{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 10. ACTIVATED FAQ ACCORDION WITH CLICK AUDIO */}
        <section className="zone sec right faq" id="faq" data-zone="faq" data-theme="light">
          <div className="faq-box reveal">
            <h2 className="h2 mid">{CONFIG.faqTitle}</h2>
            <div className="faq-list">
              {CONFIG.faq.map((f, i) => (
                <div
                  key={f.q}
                  className={`faq-item ${openFaq === i ? "is-open" : ""}`}
                  onClick={() => {
                    playClickSound(openFaq === i ? 450 : 680);
                    setOpenFaq(openFaq === i ? null : i);
                  }}
                >
                  <div className="faq-q">
                    <span>{f.q}</span>
                    <i className="faq-icon" />
                  </div>
                  <div className="faq-a">
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. FINISH + CTA */}
        <section className="zone sec center finish" id="finish" data-zone="finish" data-theme="light">
          <div className="reveal">
            <h2 className="h2 mid">{CONFIG.finish.title}</h2>
            <div className="finishes">
              {FINISHES.map((f) => (
                <button
                  key={f.name}
                  className={finish.name === f.name ? "active" : ""}
                  onClick={() => {
                    playClickSound(850);
                    setFinish(f);
                  }}
                >
                  <span className="finish-dot" style={{ background: f.tone }} />
                  {f.name}
                </button>
              ))}
            </div>
            <a className="order big magnetic" href={CONFIG.ctaUrl} onClick={() => playClickSound(800)}>{CONFIG.ctaLabel}</a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <div className="foot-top">
            <div className="foot-brand">
              <strong>{CONFIG.brand}</strong>
              <p>Timeless Swiss design, crafted to last.</p>
            </div>
            <form
              className="news"
              onSubmit={(e) => {
                e.preventDefault();
                playClickSound(900);
                setSubscribed(true);
              }}
            >
              <label>Join the private list</label>
              {subscribed ? (
                <p className="thanks">Thank you. An invitation will be sent to your inbox.</p>
              ) : (
                <div className="news-row">
                  <input type="email" required placeholder="Your email address" />
                  <button type="submit">Subscribe</button>
                </div>
              )}
            </form>
            <nav className="foot-links">
              {CONFIG.footerLinks.map((l) => (
                <a key={l.label} href={l.url}>{l.label}</a>
              ))}
            </nav>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} {CONFIG.brand} · Swiss Haute Horlogerie</span>
            <span className="credit">{CONFIG.credit}</span>
            <button onClick={() => go("top")}>Back to top ↑</button>
          </div>
        </footer>
      </main>
    </>
  );
}