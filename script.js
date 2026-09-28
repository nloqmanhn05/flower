// ==================== SCENE BEHAVIOR PROFILES ====================
const SCENE_PROFILES = [
  // Scene 0: Nebula Burst
  {
    title: "Dreamscape Nebula Burst",
    tagline: "Volcanic Pulsar & Rising Smoke Billows",
    bloomDuration: 4800,
    wanderDuration: 2600,
    flowDuration: 3400,
    spinSpeed: 0.0012,
    pitchFreq: 0.0004,
    pitchAmp: 0.08,
    breatheFreq: 0.0035, // rapid cosmic pulsation
    breatheAmp: 0.08,
    trailAlpha: 0.18,
    behavior: "pulsar_shockwave",
    wanderType: "smoke_billow"
  },
  // Scene 1: Dreamy Cloud Coral Flower
  {
    title: "Dreamy Cloud Coral Flower",
    tagline: "Oceanic Jellyfish Tumble & Soft Cloud Drift",
    bloomDuration: 5200,
    wanderDuration: 3000,
    flowDuration: 3800,
    spinSpeed: 0.0008, // slow dreamy rotation
    pitchFreq: 0.0006,
    pitchAmp: 0.26, // deep oceanic 3D tumble
    breatheFreq: 0.0012, // slow, gentle breathing
    breatheAmp: 0.05,
    trailAlpha: 0.22,
    behavior: "jellyfish_tumble",
    wanderType: "cloud_mist"
  },
  // Scene 2: Fine Spinning Polar Bloom
  {
    title: "Fine Spinning Polar Bloom",
    tagline: "High-Speed Gyroscopic Spin & Centrifugal Vortex",
    bloomDuration: 4600,
    wanderDuration: 2400,
    flowDuration: 3200,
    spinSpeed: 0.0075, // 5x faster gyroscopic spin!
    pitchFreq: 0.0014,
    pitchAmp: 0.34, // dynamic gyroscopic nutation
    breatheFreq: 0.0025,
    breatheAmp: 0.035,
    trailAlpha: 0.12, // low alpha = long bright light streaks!
    behavior: "gyroscopic_spin",
    wanderType: "centrifugal_spiral"
  },
  // Scene 3: Botanical Color Varieties
  {
    title: "Botanical Color Varieties",
    tagline: "Counter-Rotating Lotus & Falling Leaf Flutter",
    bloomDuration: 5200,
    wanderDuration: 3200,
    flowDuration: 3600,
    spinSpeed: 0.002,
    pitchFreq: 0.0007,
    pitchAmp: 0.14,
    breatheFreq: 0.0018,
    breatheAmp: 0.065,
    trailAlpha: 0.20,
    behavior: "counter_rotating_tiers",
    wanderType: "leaf_flutter"
  },
  // Scene 4: Arranged Particle Bouquet
  {
    title: "Arranged Particle Bouquet",
    tagline: "Orbital Satellites & Multi-Cluster Fireworks",
    bloomDuration: 5400,
    wanderDuration: 2800,
    flowDuration: 3600,
    spinSpeed: 0.0014,
    pitchFreq: 0.0006,
    pitchAmp: 0.12,
    breatheFreq: 0.002,
    breatheAmp: 0.05,
    trailAlpha: 0.22,
    behavior: "satellite_dance",
    wanderType: "multi_fireworks"
  },
  // Scene 5: Ethereal Peony & Sacred Matrix
  {
    title: "Ethereal Peony & Sacred Matrix",
    tagline: "Volumetric Peony & Hypercube Lattice Expansion",
    bloomDuration: 5600,
    wanderDuration: 3000,
    flowDuration: 3800,
    spinSpeed: 0.001,
    pitchFreq: 0.0004,
    pitchAmp: 0.20,
    breatheFreq: 0.0015,
    breatheAmp: 0.07,
    trailAlpha: 0.18,
    behavior: "sacred_cube_bloom",
    wanderType: "quantum_lattice"
  },
  // Scene 6: Stardust Message Finale
  {
    title: "Always Here For You",
    tagline: "i have always been here for you",
    bloomDuration: 7500,
    wanderDuration: 2800,
    flowDuration: 3800,
    spinSpeed: 0.0002,
    pitchFreq: 0.0003,
    pitchAmp: 0.02,
    breatheFreq: 0.0014,
    breatheAmp: 0.025,
    trailAlpha: 0.20,
    behavior: "stardust_typography",
    wanderType: "floating_wishes"
  }
];

const TOTAL_PARTICLES = 3400;
let currentSceneIndex = 0;
let cycleStartTime = performance.now();
let phaseStartTime = performance.now();
let phase = 'bloom'; // 'bloom', 'wander', 'flow'

// Canvas Setup
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
let W, H, DPR, cx, cy;

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  cx = W / 2;
  cy = H / 2;
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function rand(a, b) { return a + Math.random() * (b - a); }

function hexToRgb(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

const SCENE_PALETTES = [
  ['#ffffff', '#ffe5ec', '#ffb3c6', '#ff8fab', '#fb6f92', '#ffe08a', '#ff9ec7'],
  ['#ffffff', '#ffe6e0', '#ffb9a3', '#ff8f7a', '#f26a5c', '#ffe08a', '#fff6d8'],
  ['#ffd1e6', '#ff9ec7', '#ff6fa5', '#ffe9f2', '#fff2c9', '#ffe08a', '#d9c9ff', '#8fd9ff'],
  ['#ffffff', '#f1e8ff', '#d9c2ff', '#b48cff', '#8f5fe8', '#e7f8ff', '#7cc9ff', '#ffcfe0'],
  ['#ffd9c2', '#ffb08a', '#ff8a5c', '#ffd1e6', '#ff9ec7', '#8fd9ff', '#fff2c9', '#d9c9ff'],
  ['#ffffff', '#fff3ee', '#ffe3d6', '#ffc9b0', '#ffab8f', '#f7896e', '#ffe08a', '#fffaf2'],
  ['#ffffff', '#fff5eb', '#ffe3e8', '#ffd1dc', '#ffb6c1', '#ffe08a', '#ff9ec7']
];

// ==================== STARDUST TYPOGRAPHY GENERATOR ====================
function generateTextGeometry() {
  const points = [];
  const offCanvas = document.createElement('canvas');
  const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
  
  const w = 1200;
  const h = 550;
  offCanvas.width = w;
  offCanvas.height = h;
  
  offCtx.fillStyle = '#000';
  offCtx.fillRect(0, 0, w, h);
  
  // High quality elegant typography
  const fontSize = 62;
  offCtx.font = `600 ${fontSize}px 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif`;
  offCtx.fillStyle = '#fff';
  offCtx.textAlign = 'center';
  offCtx.textBaseline = 'middle';
  
  // Two balanced lines
  const line1 = "i have always";
  const line2 = "been here for you";
  
  const lineSpacing = fontSize * 1.35;
  offCtx.fillText(line1, w / 2, h / 2 - lineSpacing * 0.52);
  offCtx.fillText(line2, w / 2, h / 2 + lineSpacing * 0.52);
  
  const imgData = offCtx.getImageData(0, 0, w, h).data;
  const validPixels = [];
  
  const step = 3;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const idx = (y * w + x) * 4;
      const brightness = imgData[idx];
      if (brightness > 90) {
        validPixels.push({
          x: (x - w / 2),
          y: (y - h / 2),
          brightness: brightness / 255
        });
      }
    }
  }

  const TEXT_COLORS = ['#ffffff', '#fff5eb', '#ffe3e8', '#ffd1dc', '#ffb6c1', '#ffe08a', '#ff9ec7'];
  const maxDisplayWidth = Math.min(W * 0.88, 850);
  const scaleRatio = maxDisplayWidth / (w * 0.75);

  const textParticlesCount = Math.min(TOTAL_PARTICLES, validPixels.length);
  for (let i = 0; i < textParticlesCount; i++) {
    const pix = validPixels[i];
    points.push({
      x: (pix.x + rand(-0.8, 0.8)) * scaleRatio,
      y: (pix.y + rand(-0.8, 0.8)) * scaleRatio,
      z: rand(-8, 8),
      size: rand(0.9, 2.3),
      baseAlpha: rand(0.75, 1.0) * pix.brightness,
      color: TEXT_COLORS[Math.floor(rand(0, TEXT_COLORS.length))],
      isText: true
    });
  }

  // Any remaining particles form a soft ambient starry halo & celestial dust around the words
  for (let i = textParticlesCount; i < TOTAL_PARTICLES; i++) {
    const a = rand(0, Math.PI * 2);
    const rX = rand(maxDisplayWidth * 0.35, maxDisplayWidth * 0.58);
    const rY = rand(100, 240);
    points.push({
      x: Math.cos(a) * rX + rand(-20, 20),
      y: Math.sin(a) * rY + rand(-15, 15),
      z: rand(-35, 35),
      size: rand(0.5, 1.3),
      baseAlpha: rand(0.2, 0.55),
      color: Math.random() < 0.5 ? '#ffe08a' : '#ffd1dc',
      isText: false
    });
  }

  return points;
}

// ==================== GEOMETRIC FORMATION GENERATORS ====================
function generateSceneGeometry(sceneIdx) {
  if (sceneIdx === 6) {
    // Scene 6: Stardust Typography "i have always been here for you"
    return generateTextGeometry();
  }

  const points = [];
  const R_BASE = Math.min(W, H) * 0.38;

  if (sceneIdx === 0) {
    // Scene 1: Dreamscape Nebula Burst & Corona
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const isCore = i < 600;
      if (isCore) {
        const a = rand(0, Math.PI * 2);
        const r = Math.sqrt(Math.random()) * (R_BASE * 0.28);
        points.push({
          x: Math.cos(a) * r,
          y: Math.sin(a) * r * 0.85,
          z: rand(-40, 40),
          size: rand(1.2, 3.2),
          baseAlpha: rand(0.6, 1.0),
          isCore: true,
          rDist: r / (R_BASE * 0.28)
        });
      } else {
        const theta = rand(0, Math.PI * 2);
        const petalShape = Math.sin(theta * 6) * (R_BASE * 0.35);
        const r = rand(R_BASE * 0.3, R_BASE * 0.95) + petalShape;
        points.push({
          x: Math.cos(theta) * r,
          y: Math.sin(theta) * r * 0.9 + rand(-15, 15),
          z: Math.sin(theta * 3) * 60 + rand(-20, 20),
          size: rand(0.8, 2.4),
          baseAlpha: rand(0.4, 0.85),
          isCore: false,
          rDist: r / R_BASE
        });
      }
    }
  } else if (sceneIdx === 1) {
    // Scene 2: Dreamy Cloud Coral Bell & Stem
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const roll = i / TOTAL_PARTICLES;
      let ny, rFactor, zone;
      if (roll < 0.65) {
        zone = 'crown';
        ny = rand(-1.2, 0.2);
        rFactor = Math.sqrt(Math.max(0, 1 - Math.pow((ny + 0.4) / 1.1, 2))) * R_BASE * 0.9;
      } else if (roll < 0.85) {
        zone = 'throat';
        ny = rand(0.1, 0.6);
        rFactor = rand(0.2, 0.5) * (1 - (ny - 0.1) / 0.6) * R_BASE * 0.8;
      } else {
        zone = 'stem';
        ny = rand(0.5, 1.4);
        rFactor = (0.2 - (ny - 0.5) * 0.1) * R_BASE * 0.5;
      }
      const theta = rand(0, Math.PI * 2);
      const bump = 1 + 0.16 * Math.sin(theta * 5 + ny * 6);
      const r = rFactor * bump * rand(0.85, 1.15);
      points.push({
        x: Math.cos(theta) * r,
        y: ny * (R_BASE * 0.75),
        z: Math.sin(theta) * r * 0.6,
        size: rand(0.7, 2.2),
        baseAlpha: rand(0.45, 0.9),
        zone, ny
      });
    }
  } else if (sceneIdx === 2) {
    // Scene 3: Fine Spinning Polar Rose (6 Petals)
    const petals = 6;
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const isCore = i < 400;
      if (isCore) {
        const a = rand(0, Math.PI * 2);
        const r = Math.sqrt(Math.random()) * (R_BASE * 0.2);
        points.push({
          x: Math.cos(a) * r,
          y: Math.sin(a) * r,
          z: rand(-20, 20),
          size: rand(1.2, 2.8),
          baseAlpha: rand(0.7, 1.0),
          isCore: true,
          petalIdx: 0
        });
      } else {
        const p = i % petals;
        const petalAngle = (Math.PI * 2 / petals) * p;
        const t = (i / TOTAL_PARTICLES) * Math.PI;
        const r = Math.sin(t * petals) * (R_BASE * 0.95);
        const widthSpread = Math.sin(t) * (R_BASE * 0.28);
        const lx = (Math.random() - 0.5) * widthSpread;
        const ly = -Math.abs(r);

        const cosA = Math.cos(petalAngle), sinA = Math.sin(petalAngle);
        points.push({
          x: lx * cosA - ly * sinA,
          y: lx * sinA + ly * cosA,
          z: Math.sin(t * 4) * 45,
          size: rand(0.7, 2.2),
          baseAlpha: rand(0.4, 0.85),
          isCore: false,
          petalIdx: p
        });
      }
    }
  } else if (sceneIdx === 3) {
    // Scene 4: Botanical Varieties / Counter-Rotating Tiers
    const tiers = 4;
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const tier = i % tiers;
      const tierPetals = 6 + tier * 3;
      const tierRadius = R_BASE * (0.35 + (tier / tiers) * 0.65);
      const theta = rand(0, Math.PI * 2);
      const petalWave = Math.sin(theta * tierPetals);
      const r = tierRadius * (0.7 + 0.3 * Math.abs(petalWave)) * rand(0.9, 1.1);
      
      points.push({
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r * 0.85,
        z: (tier - 1.5) * 35 + rand(-10, 10),
        size: rand(0.8, 2.3),
        baseAlpha: rand(0.5, 0.9),
        tier,
        origTheta: theta,
        origR: r
      });
    }
  } else if (sceneIdx === 4) {
    // Scene 5: Particle Bouquet (Center Bloom + Satellites)
    const centers = [
      { x: 0, y: 0, scale: 0.75, id: 0 },
      { x: -R_BASE * 0.55, y: -R_BASE * 0.35, scale: 0.5, id: 1 },
      { x: R_BASE * 0.55, y: -R_BASE * 0.3, scale: 0.52, id: 2 },
      { x: 0, y: R_BASE * 0.5, scale: 0.48, id: 3 }
    ];
    for (let i = 0; i < TOTAL_PARTICLES; i++) {
      const c = centers[i % centers.length];
      const theta = rand(0, Math.PI * 2);
      const r = Math.sqrt(Math.random()) * (R_BASE * c.scale) * (0.7 + 0.3 * Math.sin(theta * 5));
      points.push({
        x: c.x + Math.cos(theta) * r,
        y: c.y + Math.sin(theta) * r,
        z: rand(-30, 30),
        size: rand(0.7, 2.2),
        baseAlpha: rand(0.4, 0.85),
        centerId: c.id,
        origCenterX: c.x,
        origCenterY: c.y,
        localR: r,
        localTheta: theta
      });
    }
  } else {
    // Scene 6: Ethereal Particle Bloom (Peony with Perspective Matrix)
    const CROWN_COLS = ['#ffffff','#fff3ee','#ffe3d6','#ffc9b0','#ffab8f','#f7896e','#e8735c'];
    const LOWER_COLS = ['#4a1620','#5c1e28','#7a2c30','#3d1c3a','#2a1018','#63232a'];
    
    let idx = 0;
    const peonyCount = Math.floor(TOTAL_PARTICLES * 0.45);
    for (let i = 0; i < peonyCount; i++, idx++) {
      const ny = rand(-1.2, 0.05);
      const baseR = Math.sqrt(Math.max(0, 1 - Math.pow((ny + 0.45) / 1.15, 2)));
      const theta = rand(0, Math.PI * 2);
      const ruffle = 1
        + 0.14 * Math.sin(theta * 6 + ny * 8)
        + 0.09 * Math.sin(theta * 11 - ny * 5)
        + 0.06 * Math.sin(theta * 17 + ny * 13);
      const r = Math.max(0, baseR * ruffle) * rand(0.85, 1.12) * (R_BASE * 0.95);
      points.push({
        x: Math.cos(theta) * r,
        y: ny * (R_BASE * 0.82),
        z: Math.sin(theta) * r * 0.75,
        size: rand(1.3, 3.2),
        baseAlpha: rand(0.45, 0.85),
        color: CROWN_COLS[Math.floor(rand(0, CROWN_COLS.length))],
        species: 'peony'
      });
    }

    const chryCount = Math.floor(TOTAL_PARTICLES * 0.18);
    const strands = 60;
    const ptsPerStrand = Math.floor(chryCount / strands);
    for (let s = 0; s < strands; s++) {
      const theta = rand(0, Math.PI * 2);
      const tiltNy = rand(-1.25, -0.4);
      const len = rand(0.5, 1.0) * (R_BASE * 0.9);
      for (let p = 0; p < ptsPerStrand; p++, idx++) {
        const t = p / ptsPerStrand;
        const r = t * len * rand(0.9, 1.15);
        const ny = tiltNy - t * rand(0.05, 0.25);
        const jitterA = theta + rand(-0.05, 0.05);
        points.push({
          x: Math.cos(jitterA) * r,
          y: ny * (R_BASE * 0.8),
          z: Math.sin(jitterA) * r * 0.8,
          size: rand(0.8, 1.9),
          baseAlpha: rand(0.35, 0.7),
          color: CROWN_COLS[Math.floor(rand(0, CROWN_COLS.length))],
          species: 'chry'
        });
      }
    }

    const cloudCount = Math.floor(TOTAL_PARTICLES * 0.14);
    for (let i = 0; i < cloudCount; i++, idx++) {
      const theta = rand(0, Math.PI * 2);
      const ny0 = rand(-1.1, -0.15);
      const baseR = Math.sqrt(Math.max(0, 1 - Math.pow((ny0 + 0.45) / 1.15, 2))) * rand(0.85, 1.05) * (R_BASE * 0.95);
      const cx0 = Math.cos(theta) * baseR;
      const cz0 = Math.sin(theta) * baseR;
      const jitter = rand(0, 25);
      const ja = rand(0, Math.PI * 2);
      points.push({
        x: cx0 + Math.cos(ja) * jitter,
        y: (ny0 + rand(-0.07, 0.07)) * (R_BASE * 0.8),
        z: cz0 + Math.sin(ja) * jitter,
        size: rand(1.2, 2.8),
        baseAlpha: rand(0.4, 0.8),
        color: Math.random() < 0.4 ? '#fffaf2' : CROWN_COLS[Math.floor(rand(0, CROWN_COLS.length))],
        species: 'cloud'
      });
    }

    const babyCount = Math.floor(TOTAL_PARTICLES * 0.11);
    for (let i = 0; i < babyCount; i++, idx++) {
      const theta = rand(0, Math.PI * 2);
      const ny = rand(-1.35, 0.3);
      const baseR = Math.sqrt(Math.max(0, 1 - Math.pow((ny + 0.45) / 1.2, 2))) * (R_BASE * 1.15);
      const r = baseR * rand(1.05, 1.45);
      points.push({
        x: Math.cos(theta) * r,
        y: ny * (R_BASE * 0.8),
        z: Math.sin(theta) * r,
        size: rand(0.5, 1.2),
        baseAlpha: rand(0.3, 0.65),
        color: '#fffaf5',
        species: 'baby'
      });
    }

    while (idx < TOTAL_PARTICLES) {
      const ny = rand(0.1, 1.5);
      const stemT = (ny - 0.1) / 1.4;
      const wobble = Math.sin(stemT * 6) * 12;
      const radiusFactor = Math.max(8, (0.24 - stemT * 0.18) * R_BASE * rand(0.35, 1.15) + wobble);
      const theta = rand(0, Math.PI * 2);
      points.push({
        x: Math.cos(theta) * radiusFactor,
        y: ny * (R_BASE * 0.78),
        z: Math.sin(theta) * radiusFactor * 0.7,
        size: rand(0.8, 2.0),
        baseAlpha: rand(0.45, 0.85),
        color: LOWER_COLS[Math.floor(rand(0, LOWER_COLS.length))],
        species: 'stem'
      });
      idx++;
    }
  }

  return points;
}

// ==================== PARTICLE CLASS WITH DIVERSE BEHAVIORS ====================
class Particle {
  constructor(i) {
    this.id = i;
    this.x = cx + rand(-80, 80);
    this.y = cy + rand(-80, 80);
    this.z = rand(-30, 30);

    this.vx = rand(-1, 1);
    this.vy = rand(-1, 1);
    this.vz = rand(-1, 1);

    this.targetX = 0;
    this.targetY = 0;
    this.targetZ = 0;
    this.ptData = {};

    this.currentRgb = [255, 255, 255];
    this.targetRgb = [255, 255, 255];
    this.size = rand(1, 2.5);
    this.targetSize = this.size;
    this.baseAlpha = 0.8;
    this.twinklePhase = rand(0, Math.PI * 2);
    this.twinkleSpeed = rand(0.4, 1.2);

    this.wanderPhase = rand(0, Math.PI * 2);
    this.flowDelay = 0;
    this.flowDuration = 1800;
    this.flightStartX = 0;
    this.flightStartY = 0;
    this.flightStartZ = 0;
    this.hasStartedFlight = false;
    this.curveOffset = { x: 0, y: 0 };
  }

  setTarget(pt, hexColor) {
    this.targetX = pt.x;
    this.targetY = pt.y;
    this.targetZ = pt.z;
    this.targetSize = pt.size;
    this.baseAlpha = pt.baseAlpha;
    this.targetRgb = hexToRgb(hexColor);
    this.ptData = pt;
  }

  // DIVERSE DISPERSAL DYNAMICS PER SCENE
  burst(power = 1.0, sceneIdx = 0) {
    const profile = SCENE_PROFILES[sceneIdx];
    this.hasStartedFlight = false;
    this.flowDelay = rand(150, profile.flowDuration * 0.65);
    this.flowDuration = rand(profile.flowDuration * 0.45, profile.flowDuration * 0.75);

    const curveAngle = rand(0, Math.PI * 2);
    const curveDist = rand(60, 240);
    this.curveOffset = {
      x: Math.cos(curveAngle) * curveDist,
      y: Math.sin(curveAngle) * curveDist
    };

    if (profile.wanderType === 'smoke_billow') {
      // Scene 0: Volcanic Smoke Plume rising upward with thermal expansion
      const angle = Math.atan2(this.y - cy, this.x - cx) + rand(-0.4, 0.4);
      const lateralSpeed = rand(1.5, 4.8) * power;
      this.vx = Math.cos(angle) * lateralSpeed + rand(-1.5, 1.5);
      this.vy = -rand(3.5, 8.5) * power; // powerful buoyant thermal updraft
      this.vz = rand(-3, 3);
    } 
    else if (profile.wanderType === 'cloud_mist') {
      // Scene 1: Soft Cloud Mist Puff floating on gentle horizontal cross-breeze
      const driftAngle = rand(-0.25, 0.25);
      const speed = rand(1.8, 4.2) * power;
      this.vx = (Math.random() < 0.7 ? 1 : -1) * Math.cos(driftAngle) * speed + rand(-1, 1);
      this.vy = rand(-1.2, 1.2) * power;
      this.vz = rand(-2, 2);
    }
    else if (profile.wanderType === 'centrifugal_spiral') {
      // Scene 2: High-speed centrifugal spiral fling
      const radialAngle = Math.atan2(this.y - cy, this.x - cx);
      const spinAngle = radialAngle + (Math.PI / 2) * (this.id % 2 === 0 ? 1 : -1) * 0.65;
      const speed = rand(5.5, 11.5) * power;
      this.vx = Math.cos(spinAngle) * speed;
      this.vy = Math.sin(spinAngle) * speed;
      this.vz = rand(-4, 4);
    }
    else if (profile.wanderType === 'leaf_flutter') {
      // Scene 3: Fluttering Falling Leaf shower
      this.vx = rand(-3.0, 3.0) * power;
      this.vy = rand(1.5, 4.5) * power; // drifting downward
      this.vz = rand(-3, 3);
    }
    else if (profile.wanderType === 'multi_fireworks') {
      // Scene 4: 4 Multi-Cluster fireworks from each bouquet center!
      const origCenterX = cx + (this.ptData.origCenterX || 0);
      const origCenterY = cy + (this.ptData.origCenterY || 0);
      const fAngle = Math.atan2(this.y - origCenterY, this.x - origCenterX) + rand(-0.3, 0.3);
      const speed = rand(3.5, 8.5) * power;
      this.vx = Math.cos(fAngle) * speed + rand(-1, 1);
      this.vy = Math.sin(fAngle) * speed + rand(-1, 1);
      this.vz = rand(-3, 3);
    }
    else if (profile.wanderType === 'floating_wishes') {
      // Scene 6: Words dissolve into floating wishes ascending into space
      const speed = rand(1.8, 5.0) * power;
      this.vx = rand(-2.2, 2.2);
      this.vy = -rand(2.2, 5.8) * power; // gently ascends into the night sky
      this.vz = rand(-2.5, 2.5);
    }
    else {
      // Scene 5: Dimensional Hypercube Lattice Expansion along 3D diagonal vectors
      const cornerX = Math.sign(this.targetX || (Math.random() - 0.5));
      const cornerY = Math.sign(this.targetY || (Math.random() - 0.5));
      const cornerZ = Math.sign(this.targetZ || (Math.random() - 0.5));
      const speed = rand(3.2, 7.8) * power;
      this.vx = cornerX * speed + rand(-1.5, 1.5);
      this.vy = cornerY * speed + rand(-1.5, 1.5);
      this.vz = cornerZ * speed + rand(-2, 2);
    }
  }

  // DIVERSE FLIGHT & BLOOM UPDATES PER SCENE
  update(now, currentPhase, rotAngle, pitchAngle, flowElapsed, sceneIdx) {
    const profile = SCENE_PROFILES[sceneIdx];

    // Smooth Color and Size morph
    for (let c = 0; c < 3; c++) {
      this.currentRgb[c] += (this.targetRgb[c] - this.currentRgb[c]) * 0.04;
    }
    this.size += (this.targetSize - this.size) * 0.04;

    // SCENE-SPECIFIC 3D BLOOM DYNAMICS
    let effRot = rotAngle;
    let effPitch = pitchAngle;
    let localScale = 1;
    let localOffsetX = 0, localOffsetY = 0;

    if (profile.behavior === 'counter_rotating_tiers') {
      // Scene 3: Counter-rotating tiers!
      const tier = this.ptData.tier || 0;
      effRot = (tier % 2 === 0) ? rotAngle * 1.25 : -rotAngle * 0.95;
      // Chromatic Hue wave
      const hueShift = (now * 0.02 + tier * 40) % 360;
      this.currentRgb[0] = (this.currentRgb[0] * 0.96 + (180 + Math.sin(hueShift * 0.017) * 75) * 0.04);
    } 
    else if (profile.behavior === 'satellite_dance') {
      // Scene 4: Orbiting Satellites dancing around the center
      const cId = this.ptData.centerId || 0;
      if (cId > 0) {
        const orbitAngle = now * 0.0006 + cId * (Math.PI * 2 / 3);
        const bob = Math.sin(now * 0.002 + cId) * 12;
        localOffsetX = Math.cos(orbitAngle) * 35;
        localOffsetY = Math.sin(orbitAngle) * 20 + bob;
      }
    }
    else if (profile.behavior === 'jellyfish_tumble') {
      // Scene 1: Jellyfish 3D tumble roll
      effPitch += Math.sin(now * 0.0009 + (this.ptData.ny || 0)) * 0.18;
      localScale = 1 + Math.sin(now * 0.0012 + (this.ptData.ny || 0) * 2) * 0.06;
    }
    else if (profile.behavior === 'pulsar_shockwave') {
      // Scene 0: Expanding Pulsar shockwave ripple
      const wave = (now * 0.002) % 3.0; // shockwave travels outward
      const dist = this.ptData.rDist || 0.5;
      if (Math.abs(dist - wave) < 0.22) {
        localScale = 1 + (0.22 - Math.abs(dist - wave)) * 0.35;
      }
    }
    else if (profile.behavior === 'gyroscopic_spin') {
      // Scene 2: Sinusoidal Petal Undulation
      const pIdx = this.ptData.petalIdx || 0;
      const wave = Math.sin(now * 0.006 + pIdx) * 16;
      localOffsetY += wave;
    }
    else if (profile.behavior === 'stardust_typography') {
      // Scene 6: Stardust Typography - Subtle heartbeat pulse, stars softly twinkling
      effRot = Math.sin(now * 0.0003) * 0.012;
      effPitch = Math.cos(now * 0.0002) * 0.012;
      localScale = 1 + Math.sin(now * 0.0014 + this.twinklePhase) * 0.02;
    }

    // Coordinate transformation
    const breathe = localScale * (1 + Math.sin(now * profile.breatheFreq + this.twinklePhase) * profile.breatheAmp);
    const cosR = Math.cos(effRot), sinR = Math.sin(effRot);
    const cosP = Math.cos(effPitch), sinP = Math.sin(effPitch);

    let tx = (this.targetX * breathe) * cosR - (this.targetZ * breathe) * sinR + localOffsetX;
    let tz = (this.targetX * breathe) * sinR + (this.targetZ * breathe) * cosR;
    let ty = (this.targetY * breathe) * cosP - tz * sinP + localOffsetY;
    tz = (this.targetY * breathe) * sinP + tz * cosP;

    const worldTargetX = cx + tx;
    const worldTargetY = cy + ty;
    const worldTargetZ = tz;

    if (currentPhase === 'wander') {
      // SCENE-SPECIFIC FREE WANDERING PHYSICS
      if (profile.wanderType === 'smoke_billow') {
        // Upward smoke plume with rising buoyancy
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.vy -= 0.035; // thermal lift
        this.vx += Math.sin(this.y * 0.008 + now * 0.0018 + this.id * 0.01) * 0.28;
      }
      else if (profile.wanderType === 'cloud_mist') {
        // Horizontal cloud mist drift
        this.vx *= 0.985;
        this.vy *= 0.985;
        this.vx += 0.04; // cross breeze
        this.vy += Math.sin(now * 0.0012 + this.wanderPhase) * 0.12;
      }
      else if (profile.wanderType === 'centrifugal_spiral') {
        // Spiral vortex drift
        this.vx *= 0.97;
        this.vy *= 0.97;
        const dAngle = Math.atan2(this.y - cy, this.x - cx) + Math.PI / 2;
        this.vx += Math.cos(dAngle) * 0.25;
        this.vy += Math.sin(dAngle) * 0.25;
      }
      else if (profile.wanderType === 'leaf_flutter') {
        // Aerodynamic falling leaf flutter
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.vx += Math.sin(now * 0.007 + this.id) * 0.45; // fluttering sway
        this.vy += 0.025; // gravity fall
      }
      else if (profile.wanderType === 'floating_wishes') {
        // Floating wishes ascending gently into the night sky
        this.vx *= 0.985;
        this.vy *= 0.985;
        this.vy -= 0.026; // gentle rising buoyancy
        this.vx += Math.sin(this.y * 0.006 + now * 0.0012 + this.wanderPhase) * 0.22;
      }
      else {
        // Ambient 3D stardust float
        this.vx *= 0.975;
        this.vy *= 0.975;
        this.vz *= 0.975;
        this.vx += Math.sin(this.y * 0.005 + now * 0.001 + this.wanderPhase) * 0.18;
        this.vy += Math.cos(this.x * 0.005 + now * 0.001 + this.wanderPhase) * 0.18;
      }

      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;

      // Soft screen boundaries
      if (this.x < 30) this.vx += 0.5;
      if (this.x > W - 30) this.vx -= 0.5;
      if (this.y < 30) this.vy += 0.5;
      if (this.y > H - 30) this.vy -= 0.5;
    }
    else if (currentPhase === 'flow') {
      // STAGGERED STREAM FLOW INTO FORM
      if (flowElapsed < this.flowDelay) {
        this.vx *= 0.975;
        this.vy *= 0.975;
        this.vx += Math.sin(this.y * 0.005 + now * 0.001 + this.wanderPhase) * 0.15;
        this.vy += Math.cos(this.x * 0.005 + now * 0.001 + this.wanderPhase) * 0.15;
        this.x += this.vx;
        this.y += this.vy;
      } else {
        if (!this.hasStartedFlight) {
          this.hasStartedFlight = true;
          this.flightStartX = this.x;
          this.flightStartY = this.y;
          this.flightStartZ = this.z;
        }

        const flightTime = flowElapsed - this.flowDelay;
        const u = Math.min(1, flightTime / this.flowDuration);
        const s = u * u * (3 - 2 * u); // smoothstep

        const midX = (this.flightStartX + worldTargetX) * 0.5 + this.curveOffset.x * (1 - s);
        const midY = (this.flightStartY + worldTargetY) * 0.5 + this.curveOffset.y * (1 - s);
        const midZ = (this.flightStartZ + worldTargetZ) * 0.5;

        const oneMinusS = 1 - s;
        const targetPosX = oneMinusS * oneMinusS * this.flightStartX + 2 * oneMinusS * s * midX + s * s * worldTargetX;
        const targetPosY = oneMinusS * oneMinusS * this.flightStartY + 2 * oneMinusS * s * midY + s * s * worldTargetY;
        const targetPosZ = oneMinusS * oneMinusS * this.flightStartZ + 2 * oneMinusS * s * midZ + s * s * worldTargetZ;

        this.x += (targetPosX - this.x) * 0.22;
        this.y += (targetPosY - this.y) * 0.22;
        this.z += (targetPosZ - this.z) * 0.22;
      }
    }
    else {
      // Living bloom lock
      this.x += (worldTargetX - this.x) * 0.16;
      this.y += (worldTargetY - this.y) * 0.16;
      this.z += (worldTargetZ - this.z) * 0.16;
    }
  }

  draw(ctx, now) {
    const depthScale = 1 / (1 + (this.z / 650));
    const drawX = this.x;
    const drawY = this.y;
    const drawSize = Math.max(0.4, this.size * depthScale);

    const tw = 0.65 + 0.35 * Math.sin(now * 0.003 * this.twinkleSpeed + this.twinklePhase);
    const alpha = Math.max(0, Math.min(1, this.baseAlpha * tw));

    const [r, g, b] = this.currentRgb;
    ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(drawX, drawY, drawSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Instantiate particles
const particles = [];
for (let i = 0; i < TOTAL_PARTICLES; i++) {
  particles.push(new Particle(i));
}

function applySceneTarget(sceneIdx) {
  const points = generateSceneGeometry(sceneIdx);
  const palette = SCENE_PALETTES[sceneIdx];
  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const pt = points[i] || points[0];
    const colorHex = pt.color || palette[Math.floor(rand(0, palette.length))];
    particles[i].setTarget(pt, colorHex);
  }
}
applySceneTarget(0);

// ==================== HUD & NAVIGATION ====================
const sceneIdxEl = document.getElementById('sceneIdx');
const sceneNameEl = document.getElementById('sceneName');
const sceneTaglineEl = document.getElementById('sceneTagline');
const progressBarEl = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const burstBtn = document.getElementById('burstBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

function updateHUD(idx, statusText) {
  const profile = SCENE_PROFILES[idx];
  document.title = `${profile.title} — Living Bloom`;
  if (sceneIdxEl) sceneIdxEl.textContent = `0${idx + 1} / 0${SCENE_PROFILES.length}`;
  if (sceneNameEl) sceneNameEl.textContent = profile.title;
  if (sceneTaglineEl) sceneTaglineEl.textContent = statusText || profile.tagline;
}
updateHUD(0);

function triggerDispersalAndFlow(targetIdx = null) {
  if (phase === 'wander') return;
  const currentProfile = SCENE_PROFILES[currentSceneIndex];
  phase = 'wander';
  phaseStartTime = performance.now();
  updateHUD(currentSceneIndex, `✨ Dispersing via ${currentProfile.wanderType.replace('_', ' ').toUpperCase()}...`);

  // Disperse according to current scene's behavior
  for (const p of particles) {
    p.burst(1.0, currentSceneIndex);
  }

  setTimeout(() => {
    phase = 'flow';
    phaseStartTime = performance.now();
    currentSceneIndex = targetIdx !== null ? targetIdx : (currentSceneIndex + 1) % SCENE_PROFILES.length;
    const nextProfile = SCENE_PROFILES[currentSceneIndex];
    applySceneTarget(currentSceneIndex);
    updateHUD(currentSceneIndex, `🌊 Streaming into ${nextProfile.title}...`);

    setTimeout(() => {
      phase = 'bloom';
      cycleStartTime = performance.now();
      updateHUD(currentSceneIndex);
    }, nextProfile.flowDuration);
  }, currentProfile.wanderDuration);
}

// Scene 6 Cube Overlay
function drawCubeOverlay(now) {
  if (currentSceneIndex !== 5 || phase === 'wander') return;
  const size = Math.min(W, H) * 0.48;
  const rot = now * 0.00015;

  const verts3d = [
    [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
    [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
  ];
  const cosR = Math.cos(rot), sinR = Math.sin(rot);
  const cosT = Math.cos(rot * 0.6), sinT = Math.sin(rot * 0.6);

  const proj = verts3d.map(([x, y, z]) => {
    let X = x * cosR - z * sinR;
    let Z = x * sinR + z * cosR;
    let Y = y * cosT - Z * sinT;
    Z = y * sinT + Z * cosT;
    const persp = 1 / (2.5 - Z * 0.4);
    return [cx + X * size * persp, cy + Y * size * persp];
  });

  const edges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];

  ctx.strokeStyle = 'rgba(255, 224, 138, 0.12)';
  ctx.lineWidth = 1;
  for (const [a, b] of edges) {
    ctx.beginPath();
    ctx.moveTo(proj[a][0], proj[a][1]);
    ctx.lineTo(proj[b][0], proj[b][1]);
    ctx.stroke();
  }
}

// ==================== MAIN ANIMATION LOOP ====================
let rotAngle = 0;
let pitchAngle = 0;

function loop(now) {
  const currentProfile = SCENE_PROFILES[currentSceneIndex];
  const elapsedInCycle = now - cycleStartTime;
  const flowElapsed = phase === 'flow' ? (now - phaseStartTime) : 0;

  if (phase === 'bloom') {
    const progress = Math.min(100, (elapsedInCycle / currentProfile.bloomDuration) * 100);
    progressBarEl.style.width = progress + '%';

    if (elapsedInCycle >= currentProfile.bloomDuration) {
      triggerDispersalAndFlow();
    }
  } else {
    progressBarEl.style.width = '100%';
  }

  // Scene-specific rotation increments
  rotAngle += currentProfile.spinSpeed;
  pitchAngle = Math.sin(now * currentProfile.pitchFreq) * currentProfile.pitchAmp;

  // Scene-specific background trail alpha (crisp streaks vs soft smoke)
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = `rgba(6, 10, 15, ${currentProfile.trailAlpha})`;
  ctx.fillRect(0, 0, W, H);

  drawCubeOverlay(now);

  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    const p = particles[i];
    p.update(now, phase, rotAngle, pitchAngle, flowElapsed, currentSceneIndex);
    p.draw(ctx, now);
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ==================== INTERACTION ====================
window.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.theater-hud, .auto-progress-container')) return;
  for (const p of particles) {
    const d = Math.hypot(p.x - e.clientX, p.y - e.clientY);
    if (d < 260) {
      p.burst(1.2, currentSceneIndex);
    }
  }
});

burstBtn.addEventListener('click', () => triggerDispersalAndFlow());
nextBtn.addEventListener('click', () => triggerDispersalAndFlow((currentSceneIndex + 1) % SCENE_PROFILES.length));
prevBtn.addEventListener('click', () => triggerDispersalAndFlow((currentSceneIndex - 1 + SCENE_PROFILES.length) % SCENE_PROFILES.length));

fullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
    triggerDispersalAndFlow();
  } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
    triggerDispersalAndFlow((currentSceneIndex - 1 + SCENE_PROFILES.length) % SCENE_PROFILES.length);
  } else if (e.key === 'f' || e.key === 'F') {
    fullscreenBtn.click();
  }
});
