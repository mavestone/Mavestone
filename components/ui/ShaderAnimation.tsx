
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
    framesSinceTrigger: number
    currentIntro: number
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

    // Fragment shader - Removed spotlight/mouse logic
    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359

      precision highp float;
      uniform vec2 resolution;
      uniform float time;
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
        
        // Visibility is determined solely by uIntro (timeline based)
        gl_FragColor = vec4(color * uIntro, 1.0);
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
      uIntro: { type: "f", value: 1.0 }, // Start visible
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

    // Handle mouse interaction
    const onMouseMove = () => {
        if (sceneRef.current) {
            // Reset the counter to keep animation playing/restart it
            sceneRef.current.framesSinceTrigger = 0;
        }
    }

    // Initial resize
    onWindowResize()
    window.addEventListener("resize", onWindowResize, false)
    window.addEventListener("mousemove", onMouseMove, false)

    // Animation Config
    const LOOP_DURATION_FRAMES = 350; // ~6 seconds active time
    const FADE_OUT_FRAMES = 60; // ~1 second fade out

    // Animation loop
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      
      if (sceneRef.current) {
          sceneRef.current.framesSinceTrigger++;
          const frames = sceneRef.current.framesSinceTrigger;
          
          let targetIntro = 0;

          if (frames < LOOP_DURATION_FRAMES) {
              // Active Phase
              targetIntro = 1.0;
              uniforms.time.value += 0.05;
          } else if (frames < LOOP_DURATION_FRAMES + FADE_OUT_FRAMES) {
              // Fade Out Phase
              const fadeProgress = (frames - LOOP_DURATION_FRAMES) / FADE_OUT_FRAMES;
              targetIntro = 1.0 - fadeProgress;
              uniforms.time.value += 0.05;
          } else {
              // Stopped Phase
              targetIntro = 0.0;
              // Stop updating time to "pause" the pattern
          }

          // Smoothly interpolate currentOpacity towards target
          // This prevents abrupt jumps if mouse moves during fade out
          const current = sceneRef.current.currentIntro;
          const next = current + (targetIntro - current) * 0.1;
          
          sceneRef.current.currentIntro = next;
          uniforms.uIntro.value = next;
      }

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }

    // Store scene references for cleanup and loop access
    sceneRef.current = {
      camera,
      scene,
      renderer,
      uniforms,
      animationId: 0,
      framesSinceTrigger: 0,
      currentIntro: 1.0
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
