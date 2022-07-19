/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Behavior, Engine, Mesh, Nullable, Observer } from '@babylonjs/core'
import {
  ArcRotateCamera,
  Color3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Texture,
  Vector3
} from '@babylonjs/core'
import type { EngineCreatedCallback, RenderCallback } from 'ui/atoms/babylonEngine/BabylonEngine'
import marsTexture from './assets/mars_1k_color.jpg'

type State = {
  scene: Scene
}

export const onEngineCreated: EngineCreatedCallback<State> = (engine: Engine) => {
  // scene
  const scene = new Scene(engine)

  // camera
  const camera = new ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 3, 8, Vector3.Zero(), scene)
  const canvas = scene.getEngine().getRenderingCanvas()

  camera.setTarget(Vector3.Zero())
  camera.attachControl(canvas, true)

  // light
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene)
  light.specular = new Color3(0,0,0)
  light.intensity = .7

  // material (for planet mars)
  const mars = MeshBuilder.CreateSphere("sphere", { diameter: 3, segments: 64 }, scene);
  mars.position.x = 0;
  mars.position.y = 0;

  const marsMaterial = new StandardMaterial("marsMaterial", scene);
  marsMaterial.diffuseTexture = new Texture(marsTexture, scene);
  mars.material = marsMaterial;

  return {
    scene: scene
  }
}

export const onRender: RenderCallback<State> = (state: State) => {
  const { scene }:State = state

  scene.render()

  return state
}
