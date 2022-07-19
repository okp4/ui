/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Behavior, Engine, Mesh, Nullable, Observer } from '@babylonjs/core'
import {
  ArcRotateCamera,
  Color3,
  CubeTexture,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3
} from '@babylonjs/core'
import type { EngineCreatedCallback, RenderCallback } from 'ui/atoms/babylonEngine/BabylonEngine'
import marsTexture from './assets/mars_1k_color.jpg'
import skyboxTexture_px from './assets/skybox_px.jpg'
import skyboxTexture_py from './assets/skybox_py.jpg'
import skyboxTexture_pz from './assets/skybox_pz.jpg'
import skyboxTexture_nx from './assets/skybox_nx.jpg'
import skyboxTexture_ny from './assets/skybox_ny.jpg'
import skyboxTexture_nz from './assets/skybox_nz.jpg'

type State = {
  scene: Scene
}

class RotatingBehavior implements Behavior<Mesh> {
  readonly name: string = 'RotatingBehavior'

  readonly rpm: number = 4

  private target: Nullable<Mesh> = null
  private scene: Nullable<Scene> = null
  private observer: Nullable<Observer<Scene>> = null

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init(): void {}

  attach(target: Mesh): void {
    this.target = target
    this.scene = target.getScene()
    this.observer = this.scene.onBeforeRenderObservable.add(this.update)
    if (this.observer) {
      this.observer.scope = this
    }
  }

  detach(): void {
    if (this.observer) {
      this.observer.unregisterOnNextCall = true
    }
    this.target = null
    this.scene = null
    this.observer = null
  }

  private update(evtData: Scene): void {
    const dt = evtData.deltaTime || 0

    if (this.target) {
      this.target.rotation.y += (this.rpm / 60) * Math.PI * 2 * (dt / 1000)
    }
  }
}

export const onEngineCreated: EngineCreatedCallback<State> = (engine: Engine) => {
  // scene
  const scene = new Scene(engine)

  // camera
  const camera = new ArcRotateCamera('camera1', 0, Math.PI / 2, 8, Vector3.Zero(), scene)
  const canvas = scene.getEngine().getRenderingCanvas()

  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)

  // light
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)

  light.specular = new Color3(0, 0, 0)
  light.intensity = 0.8

  // material (for planet mars)
  const mars = MeshBuilder.CreateSphere('sphere', { diameter: 3, segments: 64 }, scene)

  mars.position.x = 0
  mars.position.y = 0

  const marsMaterial = new StandardMaterial('marsMaterial', scene)

  marsMaterial.diffuseTexture = new Texture(marsTexture, scene)
  mars.material = marsMaterial
  mars.addBehavior(new RotatingBehavior())

  // skybox
  const skybox = MeshBuilder.CreateBox('skyBox', { size: 1000 }, scene)
  const skyboxMaterial = new StandardMaterial('skyBox', scene)

  skyboxMaterial.backFaceCulling = false
  skyboxMaterial.reflectionTexture = new CubeTexture('', scene, null, false, [
    skyboxTexture_px,
    skyboxTexture_py,
    skyboxTexture_pz,
    skyboxTexture_nx,
    skyboxTexture_ny,
    skyboxTexture_nz
  ])
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
  skyboxMaterial.specularColor = new Color3(0, 0, 0)
  skybox.material = skyboxMaterial
  skybox.infiniteDistance = true

  return { scene: scene }
}

export const onRender: RenderCallback<State> = (state: State) => {
  const { scene }: State = state

  scene.render()

  return state
}
