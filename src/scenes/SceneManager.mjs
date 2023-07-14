import { Application } from "../lib/pixi.mjs"
import { logApp } from '../utils/logger.mjs'

export class SceneManager {
  static app;
  static currentScene;
  static resizeTimeoutId;
  static resizeTimeout = 300;
  static scenes = new Map();

  static get width() {
    return window.innerWidth
  }

  static get height() {
    return window.innerHeight
  }

  static async initialize() {
    const app = new Application({
      autoDensity: true,
      resolution: window.devicePixelRatio ?? 1,
      width: SceneManager.width,
      height: SceneManager.height,
      resizeTo: window
    })
    document.body.appendChild(app.view)
    if (logApp.enabled) {
      logApp('window.__PIXI_APP__ initialized!');
      globalThis.__PIXI_APP__ = app;
    }

    SceneManager.app = app

    SceneManager.setupEventLesteners()
  }

  static setupEventLesteners() {
    window.addEventListener('resize', SceneManager.resizeDeBounce)
    SceneManager.app.ticker.add(SceneManager.updateHandler)
  }

  static async changeScene({ name, newScene, initialResize = true }) {
    if (newScene != null) {
      if (!SceneManager.scenes.has(name)) {
        SceneManager.scenes.set(name, newScene)
      }
    } else {
      newScene = SceneManager.scenes.get(name)
    }
    if (newScene == null) {
      throw new Error('Unable to detect new scene')
    }
    if (SceneManager.currentScene != null) {
      SceneManager.app.stage.removeChild(SceneManager.currentScene.view)
      if (typeof SceneManager.currentScene.unmountedHandler === 'function') {
        SceneManager.currentScene.unmountedHandler()
      }
    }

    SceneManager.currentScene = newScene
    SceneManager.app.stage.addChild(SceneManager.currentScene.view)

    if (initialResize) {
      SceneManager.resizeHandler()
    }

    if (typeof newScene.mountedHandler === 'function') {
      newScene.mountedHandler()
    }
  }

  static resizeDeBounce() {
    SceneManager.cancelScheduledResizeHandler()
    SceneManager.scheduleResizeHandler()
  }

  static cancelScheduledResizeHandler() {
    clearTimeout(SceneManager.resizeTimeoutId)
  }

  static scheduleResizeHandler() {
    SceneManager.resizeTimeoutId = setTimeout(() => {
      SceneManager.cancelScheduledResizeHandler()
      SceneManager.resizeHandler()
    }, SceneManager.resizeTimeout)
  }

  static resizeHandler() {
    SceneManager.currentScene?.handleResize({
      viewWidth: SceneManager.width,
      viewHeight: SceneManager.height
    })
  }

  static updateHandler() {
    SceneManager.currentScene?.handleUpdate(SceneManager.app.ticker.deltaMS)
  }
}
