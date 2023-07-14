import { Container } from "../lib/pixi.mjs"
import { Game } from '../game/Game.mjs'
import { SceneManager } from './SceneManager.mjs'
import { GameSceneView } from "./GameSceneView.mjs";

export class GameScene extends Container {
  name = 'game';
  game;
  #view;

  constructor(options) {
    super()

    this.#view = new GameSceneView();
    this.setup(options)
  }

  get view() {
    return this.#view;
  }

  setup({ onLoadLevel }) {
    this.game = new Game({
      pixiApp: SceneManager.app,
      view: this.#view,
      onLoadLevel
    })
  }

  handleResize(options) {
    this.game.handleResize(options)
  }

  handleUpdate(deltaMS) {
    this.game.handleUpdate(deltaMS)
  }

  mountedHandler() { }
}
