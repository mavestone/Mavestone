
import { useEffect, useRef } from "react"
import * as THREE from "three"

interface ShaderAnimationProps {
    className?: string;
}

export function ShaderAnimation({ className }: ShaderAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    camera: THREE.Camera
    scene: THREE.Scene
    renderer: THREE.WebGLRenderer
    uniforms: any
    animationId: number
    frameCount: number
  } | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `

    // Fragment shader
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 uMouse;
      uniform float uIntro;

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time*0.05;
        float lineWidth = 0.002;

        vec3 color = vec3(0.0);
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            color[j] += lineWidth*float(i*i) / abs(fract(t - 0.01*float(j)+float(i)*0.01)*5.0 - length(uv) + mod(uv.x+uv.y, 0.2));
          }
        }
        
        // Mouse interaction logic
        // Calculate distance from mouse to current pixel
        float dist = distance(gl_FragCoord.xy, uMouse);
        
        // Create a glow mask: 1.0 at mouse, fading to 0.0 at 400px radius
        float mouseGlow = 1.0 - smoothstep(0.0, 400.0, dist);
        mouseGlow = clamp(mouseGlow, 0.0, 1.0);
        
        // Combine intro opacity and mouse glow
        // We want the pattern to be visible if uIntro is high OR if mouseGlow is high
        float visibility = max(uIntro, mouseGlow);
        
        // Apply visibility to color
        gl_FragColor = vec4(color * visibility, 1.0);
      }
    `

    // Initialize Three.js scene
    const camera = new THREE.Camera()
    camera.position.z = 1

    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniforms = {
      time: { type: "f", value: 1.0 },
      resolution: { type: "v2", value: new THREE.Vector2() },
      uMouse: { type: "v2", value: new THREE.Vector2(-1000, -1000) }, // Start off-screen
      uIntro: { type: "f", value: 1.0 }, // Start fully visible
    }

    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)

    container.appendChild(renderer.domElement)

    // Handle window resize
    const onWindowResize = () => {
      if (!container) return;
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      uniforms.resolution.value.x = width * window.devicePixelRatio
      uniforms.resolution.value.y = height * window.devicePixelRatio
    }

    // Handle mouse move
    const onMouseMove = (e: MouseEvent) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        // Calculate relative to the container, but since it's full screen/fixed usually in Hero, 
        // we map window coordinates to the canvas
        // Y needs to be inverted for WebGL (0 is bottom)
        const x = (e.clientX - rect.left) * window.devicePixelRatio;
        const y = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio;
        
        uniforms.uMouse.value.set(x, y);
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)
    window.addEventListener("mousemove", onMouseMove, false)

    // Animation Config
    const LOOP_DURATION_FRAMES = 350; // Approx 5-6 seconds
    const FADE_OUT_FRAMES = 60; // 1 second fade out

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      
      if (sceneRef.current) {
          sceneRef.current.frameCount++;
          const fc = sceneRef.current.frameCount;

          if (fc < LOOP_DURATION_FRAMES) {
              // Playing loop
              uniforms.time.value += 0.05;
              uniforms.uIntro.value = 1.0;
          } else if (fc < LOOP_DURATION_FRAMES + FADE_OUT_FRAMES) {
              // Fading out
              // Freeze time (optional, or keep moving slowly. Freezing requested "then stop")
              // uniforms.time.value += 0.005; // Very slow drift? No, user said "stop"
              
              // Fade uIntro from 1.0 to 0.0
              const fadeProgress = (fc - LOOP_DURATION_FRAMES) / FADE_OUT_FRAMES;
              uniforms.uIntro.value = 1.0 - fadeProgress;
          } else {
              // Stopped and dark
              uniforms.uIntro.value = 0.0;
              // Time frozen
          }
      }

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references for cleanup
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
      frameCount: 0
    }

    // Start animation
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize)
      window.removeEventListener("mousemove", onMouseMove)

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)

        if (container && sceneRef.current.renderer.domElement) {
          container.removeChild(sceneRef.current.renderer.domElement)
        }

        sceneRef.current.renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        background: "#000",
        overflow: "hidden",
      }}
    />
  )
}
