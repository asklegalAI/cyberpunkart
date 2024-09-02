import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skull, Flower, Zap } from 'lucide-react'

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [energy, setEnergy] = useState(100)
  const [offerings, setOfferings] = useState(0)
  const [dialogText, setDialogText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // Cyberpunk city
    const cityGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cityMaterial = new THREE.MeshPhongMaterial({ color: 0x00ffff })
    const buildings: THREE.Mesh[] = []

    for (let i = 0; i < 500; i++) {
      const building = new THREE.Mesh(cityGeometry, cityMaterial)
      building.position.set(
        (Math.random() - 0.5) * 200,
        Math.random() * 50,
        (Math.random() - 0.5) * 200
      )
      building.scale.set(
        Math.random() * 10 + 1,
        Math.random() * 100 + 10,
        Math.random() * 10 + 1
      )
      buildings.push(building)
      scene.add(building)
    }

    // Neon lights
    const lightGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff })
    const lights: THREE.Mesh[] = []

    for (let i = 0; i < 200; i++) {
      const light = new THREE.Mesh(lightGeometry, lightMaterial)
      light.position.set(
        (Math.random() - 0.5) * 200,
        Math.random() * 100,
        (Math.random() - 0.5) * 200
      )
      lights.push(light)
      scene.add(light)
    }

    // Ofrenda (altar)
    const ofrendaGeometry = new THREE.BoxGeometry(10, 5, 3)
    const ofrendaMaterial = new THREE.MeshPhongMaterial({ color: 0xffaa00 })
    const ofrenda = new THREE.Mesh(ofrendaGeometry, ofrendaMaterial)
    ofrenda.position.set(0, 2.5, -20)
    scene.add(ofrenda)

    // Sugar skulls
    const skullGeometry = new THREE.SphereGeometry(1, 32, 32)
    const skullMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff })
    const skulls: THREE.Mesh[] = []

    for (let i = 0; i < 20; i++) {
      const skull = new THREE.Mesh(skullGeometry, skullMaterial)
      skull.position.set(
        (Math.random() - 0.5) * 40,
        Math.random() * 10 + 5,
        (Math.random() - 0.5) * 40
      )
      skulls.push(skull)
      scene.add(skull)
    }

    // Marigold particles
    const marigoldGeometry = new THREE.BufferGeometry()
    const marigoldMaterial = new THREE.PointsMaterial({
      color: 0xffa500,
      size: 0.1,
      blending: THREE.AdditiveBlending,
      transparent: true
    })

    const marigoldParticles = new Float32Array(3000)
    for (let i = 0; i < marigoldParticles.length; i += 3) {
      marigoldParticles[i] = (Math.random() - 0.5) * 100
      marigoldParticles[i + 1] = Math.random() * 100
      marigoldParticles[i + 2] = (Math.random() - 0.5) * 100
    }

    marigoldGeometry.setAttribute('position', new THREE.BufferAttribute(marigoldParticles, 3))
    const marigoldSystem = new THREE.Points(marigoldGeometry, marigoldMaterial)
    scene.add(marigoldSystem)

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.add(ambientLight)

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    camera.position.z = 50

    const animate = () => {
      requestAnimationFrame(animate)

      // Animate buildings
      buildings.forEach(building => {
        building.rotation.y += 0.001
      })

      // Animate lights
      lights.forEach(light => {
        light.position.y = Math.sin(Date.now() * 0.001 + light.position.x) * 5 + 50
      })

      // Animate ofrenda
      ofrenda.rotation.y += 0.005

      // Animate sugar skulls
      skulls.forEach(skull => {
        skull.rotation.y += 0.01
        skull.position.y = Math.sin(Date.now() * 0.002 + skull.position.x) * 2 + 7
      })

      // Animate marigold particles
      const positions = marigoldSystem.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1
        if (positions[i + 1] < 0) {
          positions[i + 1] = 100
        }
      }
      marigoldSystem.geometry.attributes.position.needsUpdate = true

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const interact = () => {
    setDialogText("You've connected with the spirit world.")
    setEnergy(prev => Math.max(0, prev - 10))
  }

  const collect = () => {
    setDialogText("You've collected an offering.")
    setOfferings(prev => prev + 1)
    setEnergy(prev => Math.min(100, prev + 5))
  }

  const dance = () => {
    setDialogText("You dance to honor the dead.")
    setEnergy(prev => Math.max(0, prev - 5))
    setOfferings(prev => prev + 2)
  }

  return (
    <div className="relative w-full h-screen bg-black text-primary-foreground overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
          <span className="text-2xl font-bold animate-pulse">Loading Cyberpunk Día de los Muertos...</span>
        </div>
      )}
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute top-4 left-4 p-4 bg-black/70 border-2 border-primary rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <span className="font-bold">Energy:</span>
        </div>
        <Progress value={energy} className="w-40" />
        <div className="flex items-center space-x-2 mt-2">
          <Skull className="w-6 h-6 text-primary" />
          <span className="font-bold">Offerings: {offerings}</span>
        </div>
      </div>
      {dialogText && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-4/5 max-w-md p-4 bg-black/80 border-2 border-secondary rounded-lg text-center">
          {dialogText}
        </div>
      )}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <Button onClick={interact} className="w-32">
          Interact
        </Button>
        <Button onClick={collect} className="w-32">
          Collect
        </Button>
        <Button onClick={dance} className="w-32">
          Dance
        </Button>
      </div>
    </div>
  )
}
