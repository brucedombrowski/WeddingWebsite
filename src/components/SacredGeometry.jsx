function SacredGeometry({ opacity = 0.15 }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity }}>
      {/* Central Flower of Life */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sacred-rotate">
        <FlowerOfLife size={600} color="#5c6d49" />
      </div>

      {/* Platonic Solids - floating around */}
      <div className="absolute top-[15%] left-[10%] sacred-rotate" style={{ animationDuration: '30s' }}>
        <Tetrahedron size={80} color="#722034" />
      </div>
      <div className="absolute top-[20%] right-[15%] sacred-rotate" style={{ animationDuration: '40s', animationDirection: 'reverse' }}>
        <Octahedron size={100} color="#a82448" />
      </div>
      <div className="absolute bottom-[25%] left-[12%] sacred-rotate" style={{ animationDuration: '35s' }}>
        <Icosahedron size={90} color="#5c6d49" />
      </div>
      <div className="absolute bottom-[15%] right-[10%] sacred-rotate" style={{ animationDuration: '45s', animationDirection: 'reverse' }}>
        <Dodecahedron size={110} color="#768a5e" />
      </div>
      <div className="absolute top-[40%] left-[5%] sacred-rotate" style={{ animationDuration: '50s' }}>
        <Cube size={70} color="#c9305a" />
      </div>
      <div className="absolute top-[35%] right-[8%] sacred-rotate" style={{ animationDuration: '55s', animationDirection: 'reverse' }}>
        <Tetrahedron size={60} color="#4a573c" />
      </div>

      {/* Metatron's Cube in corners */}
      <div className="absolute top-20 left-20 sacred-pulse">
        <MetatronsCube size={150} color="#722034" />
      </div>
      <div className="absolute top-20 right-20 sacred-pulse" style={{ animationDelay: '1s' }}>
        <MetatronsCube size={150} color="#722034" />
      </div>
      <div className="absolute bottom-20 left-20 sacred-pulse" style={{ animationDelay: '2s' }}>
        <MetatronsCube size={150} color="#722034" />
      </div>
      <div className="absolute bottom-20 right-20 sacred-pulse" style={{ animationDelay: '3s' }}>
        <MetatronsCube size={150} color="#722034" />
      </div>

      {/* Seed of Life patterns */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2">
        <SeedOfLife size={200} color="#a82448" />
      </div>
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2">
        <SeedOfLife size={200} color="#a82448" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2">
        <SeedOfLife size={200} color="#a82448" />
      </div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2">
        <SeedOfLife size={200} color="#a82448" />
      </div>

      {/* Golden Spiral */}
      <div className="absolute bottom-0 right-0 opacity-50">
        <GoldenSpiral size={400} color="#5c6d49" />
      </div>
      <div className="absolute top-0 left-0 opacity-50" style={{ transform: 'rotate(180deg)' }}>
        <GoldenSpiral size={400} color="#5c6d49" />
      </div>

      {/* Vesica Piscis - symbol of unity */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <VesicaPiscis size={300} color="#722034" />
      </div>
    </div>
  )
}

// Flower of Life - interlocking circles
function FlowerOfLife({ size = 400, color = '#5c6d49' }) {
  const r = size / 8 // radius of each circle
  const circles = []

  // Center circle
  circles.push({ cx: 0, cy: 0 })

  // First ring - 6 circles
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180
    circles.push({
      cx: r * Math.cos(angle),
      cy: r * Math.sin(angle),
    })
  }

  // Second ring - 12 circles
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180
    circles.push({
      cx: 2 * r * Math.cos(angle),
      cy: 2 * r * Math.sin(angle),
    })
    const angle2 = ((i * 60 + 30) * Math.PI) / 180
    circles.push({
      cx: Math.sqrt(3) * r * Math.cos(angle2),
      cy: Math.sqrt(3) * r * Math.sin(angle2),
    })
  }

  // Third ring
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180
    circles.push({
      cx: 3 * r * Math.cos(angle),
      cy: 3 * r * Math.sin(angle),
    })
    const angle2 = ((i * 60 + 30) * Math.PI) / 180
    const dist = Math.sqrt(7) * r
    circles.push({
      cx: dist * Math.cos(angle2),
      cy: dist * Math.sin(angle2),
    })
  }

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      <defs>
        <clipPath id="flowerClip">
          <circle cx="0" cy="0" r={size * 0.45} />
        </clipPath>
      </defs>
      <g clipPath="url(#flowerClip)">
        {circles.map((circle, i) => (
          <circle
            key={i}
            cx={circle.cx}
            cy={circle.cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.6"
          />
        ))}
      </g>
      {/* Outer boundary */}
      <circle cx="0" cy="0" r={size * 0.45} fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
    </svg>
  )
}

// Seed of Life - 7 overlapping circles
function SeedOfLife({ size = 200, color = '#a82448' }) {
  const r = size / 4
  const circles = [{ cx: 0, cy: 0 }]

  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 * Math.PI) / 180
    circles.push({
      cx: r * Math.cos(angle),
      cy: r * Math.sin(angle),
    })
  }

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {circles.map((circle, i) => (
        <circle
          key={i}
          cx={circle.cx}
          cy={circle.cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.5"
        />
      ))}
    </svg>
  )
}

// Metatron's Cube
function MetatronsCube({ size = 150, color = '#722034' }) {
  const r = size / 4
  const points = []

  // Center
  points.push({ x: 0, y: 0 })

  // Inner hexagon
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * Math.PI / 180
    points.push({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    })
  }

  // Outer hexagon
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * Math.PI / 180
    points.push({
      x: 2 * r * Math.cos(angle),
      y: 2 * r * Math.sin(angle),
    })
  }

  // Generate all connecting lines
  const lines = []
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      lines.push({ from: points[i], to: points[j] })
    }
  }

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {/* Lines */}
      {lines.map((line, i) => (
        <line
          key={i}
          x1={line.from.x}
          y1={line.from.y}
          x2={line.to.x}
          y2={line.to.y}
          stroke={color}
          strokeWidth="0.5"
          opacity="0.4"
        />
      ))}
      {/* Circles at each point */}
      {points.map((point, i) => (
        <circle
          key={`circle-${i}`}
          cx={point.x}
          cy={point.y}
          r={r * 0.4}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />
      ))}
    </svg>
  )
}

// Golden Spiral (Fibonacci)
function GoldenSpiral({ size = 300, color = '#5c6d49' }) {
  const phi = 1.618033988749895
  let scale = size / 20

  // Generate spiral path using quarter arcs
  let path = 'M 0,0 '
  let x = 0, y = 0
  let w = scale, h = scale

  const squares = 10
  for (let i = 0; i < squares; i++) {
    const corner = i % 4
    switch (corner) {
      case 0: // bottom-right arc
        path += `A ${w},${h} 0 0 1 ${x + w},${y + h} `
        x += w
        break
      case 1: // bottom-left arc
        path += `A ${w},${h} 0 0 1 ${x - w},${y + h} `
        y += h
        break
      case 2: // top-left arc
        path += `A ${w},${h} 0 0 1 ${x - w},${y - h} `
        x -= w
        break
      case 3: // top-right arc
        path += `A ${w},${h} 0 0 1 ${x + w},${y - h} `
        y -= h
        break
    }
    w *= phi
    h *= phi
  }

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.6"
      />
      {/* Golden rectangle guides */}
      <rect
        x={-size * 0.4}
        y={-size * 0.4}
        width={size * 0.8}
        height={size * 0.8 / phi}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  )
}

// Vesica Piscis - symbol of sacred union
function VesicaPiscis({ size = 200, color = '#722034' }) {
  const r = size / 3
  const offset = r / 2

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {/* Two overlapping circles */}
      <circle cx={-offset} cy="0" r={r} fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      <circle cx={offset} cy="0" r={r} fill="none" stroke={color} strokeWidth="2" opacity="0.4" />
      {/* The vesica (almond shape in the middle) highlighted */}
      <path
        d={`M 0,${-r * Math.sqrt(3) / 2}
            A ${r},${r} 0 0 1 0,${r * Math.sqrt(3) / 2}
            A ${r},${r} 0 0 1 0,${-r * Math.sqrt(3) / 2}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  )
}

// Platonic Solids

// Tetrahedron (4 faces)
function Tetrahedron({ size = 80, color = '#722034' }) {
  const h = size * 0.8
  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      <polygon
        points={`0,${-h/2} ${-size/2.5},${h/3} ${size/2.5},${h/3}`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <line x1="0" y1={-h/2} x2="0" y2={h/2} stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1={-size/2.5} y1={h/3} x2="0" y2={h/2} stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1={size/2.5} y1={h/3} x2="0" y2={h/2} stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// Cube (6 faces)
function Cube({ size = 70, color = '#5c6d49' }) {
  const s = size * 0.35
  const offset = size * 0.15
  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {/* Front face */}
      <rect x={-s} y={-s} width={s*2} height={s*2} fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      {/* Back face */}
      <rect x={-s+offset} y={-s-offset} width={s*2} height={s*2} fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Connecting lines */}
      <line x1={-s} y1={-s} x2={-s+offset} y2={-s-offset} stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1={s} y1={-s} x2={s+offset} y2={-s-offset} stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1={s} y1={s} x2={s+offset} y2={s-offset} stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1={-s} y1={s} x2={-s+offset} y2={s-offset} stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// Octahedron (8 faces)
function Octahedron({ size = 100, color = '#a82448' }) {
  const s = size * 0.35
  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {/* Diamond shape */}
      <polygon
        points={`0,${-s*1.2} ${s},0 0,${s*1.2} ${-s},0`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Cross lines */}
      <line x1={-s} y1="0" x2={s} y2="0" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="0" y1={-s*1.2} x2="0" y2={s*1.2} stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

// Icosahedron (20 faces) - simplified
function Icosahedron({ size = 90, color = '#5c6d49' }) {
  const r = size * 0.4
  const points = []
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * Math.PI / 180
    points.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) })
  }

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {/* Outer pentagon */}
      <polygon
        points={points.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Inner star lines */}
      {points.map((p, i) => (
        <line
          key={i}
          x1={p.x}
          y1={p.y}
          x2={points[(i + 2) % 5].x}
          y2={points[(i + 2) % 5].y}
          stroke={color}
          strokeWidth="1"
          opacity="0.4"
        />
      ))}
      {/* Center point connections */}
      {points.map((p, i) => (
        <line key={`c${i}`} x1="0" y1="0" x2={p.x * 0.5} y2={p.y * 0.5} stroke={color} strokeWidth="0.5" opacity="0.3" />
      ))}
    </svg>
  )
}

// Dodecahedron (12 faces) - simplified as nested pentagons
function Dodecahedron({ size = 110, color = '#768a5e' }) {
  const r1 = size * 0.4
  const r2 = size * 0.25

  const pentagon = (r) => {
    const pts = []
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180
      pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) })
    }
    return pts
  }

  const outer = pentagon(r1)
  const inner = pentagon(r2)

  return (
    <svg width={size} height={size} viewBox={`${-size/2} ${-size/2} ${size} ${size}`}>
      {/* Outer pentagon */}
      <polygon
        points={outer.map(p => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Inner pentagon rotated */}
      <polygon
        points={inner.map((p, i) => {
          const angle = (i * 72 - 90 + 36) * Math.PI / 180
          return `${r2 * Math.cos(angle)},${r2 * Math.sin(angle)}`
        }).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Connecting lines */}
      {outer.map((p, i) => (
        <line
          key={i}
          x1={p.x}
          y1={p.y}
          x2={inner[(i + 2) % 5].x * 0.8}
          y2={inner[(i + 2) % 5].y * 0.8}
          stroke={color}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
    </svg>
  )
}

export default SacredGeometry
