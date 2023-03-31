import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Helpers
 */
const toggleAttribute = (material, attribute, value) => v => {
    material[attribute] = v ? value : null
    material.needsUpdate = true
}

/**
 * Debug
 */
const GUI = new dat.GUI({ title: 'Tweak' })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

/** 
 * Material
*/

const materialDefaults = {
    roughness: 0.65,
    roughnessMap: null,
    metalness: 0.45,
    metalnessMap: null,
    map: null,
    aoMapIntensity: 1,
    aoMap: null,
    displacementMap: null,
    displacementScale: 0.05,
    normalMap: null,
    transparent: true,
    alphaMap: null
}

const mapToggles = {
    color: false,
    roughness: false,
    metalness: false,
    displacement: false,
    ambientOcclusion: false,
    alpha: false,
    normal: false
}

const material = new THREE.MeshStandardMaterial(materialDefaults)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))

scene.add(plane)


/**
 * GUI Controls
 */
const slidersGui = GUI.addFolder('Sliders')
const togglesGui = GUI.addFolder('Toggles')

slidersGui.add(material, 'metalness').min(0).max(1).step(0.0001)
    .name('Metalness')
slidersGui.add(material, 'roughness').min(0).max(1).step(0.0001)
    .name('Roughness')
slidersGui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001)
    .name('Ambient Occlusion Intensity')
slidersGui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
    .name('Displacement Scale')
slidersGui.add(material.normalScale, 'x').min(-1).max(1).step(0.0001).name('normalScaleX')
    .name('Normal Scale X')
slidersGui.add(material.normalScale, 'y').min(-1).max(1).step(0.0001).name('normalScaleY')
    .name('Normal Scale Y')

togglesGui.add(mapToggles, 'color')
    .name('Color')
    .onChange(toggleAttribute(material, 'map', doorColorTexture))
togglesGui.add(mapToggles, 'roughness')
    .name('Roughness')
    .onChange(toggleAttribute(material, 'roughnessMap', doorRoughnessTexture))
togglesGui.add(mapToggles, 'metalness')
    .name('Metalness')
    .onChange(toggleAttribute(material, 'metalnessMap', doorMetalnessTexture))
togglesGui.add(mapToggles, 'displacement')
    .name('Displacement')
    .onChange(toggleAttribute(material, 'displacementMap', doorHeightTexture))
togglesGui.add(mapToggles, 'ambientOcclusion')
    .name('Ambient Occlusion').
    onChange(toggleAttribute(material, 'aoMap', doorAmbientOcclusionTexture))
togglesGui.add(mapToggles, 'alpha')
    .name('Alpha')
    .onChange(toggleAttribute(material, 'alphaMap', doorAlphaTexture))
togglesGui.add(mapToggles, 'normal')
    .name('Normal')
    .onChange(toggleAttribute(material, 'normalMap', doorNormalTexture))

/**
 * Event Handlers
 */
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = 4
pointLight.lookAt(plane.position)
scene.add(pointLight)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
