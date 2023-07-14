import { Assets } from '../lib/pixi.mjs'
import { SceneManager } from '../scenes/SceneManager.mjs'
import { Resources } from '../utils/Resources.mjs'
import { Particle } from './Particle.mjs'
import { Resize } from './Resize.mjs'
import { UI } from "./UI.mjs"

export class Game {
  #pixiApp
  #view
  #ui
  #isEndGame = false
  #currentDifferencesCount = 0;
  #totalDifferencesCount = 0;
  #errorsCount = 0;
  #parsedLevelData = {
    slots: [],
  }
  #currentLevel;
  #maxLevel = 5;
  onLoadLevel;

  constructor({ pixiApp, view, onLoadLevel }) {
    this.onLoadLevel = onLoadLevel;
    this.#pixiApp = pixiApp;
    this.#view = view;
    this.#ui = new UI({
      onSuccessResult: this.handleSuccessResult,
      onErrorResult: this.handleErrorResult,
      onNextLevel: this.handleNextLevel
    });
    this.#view.addChild(this.#ui.view);

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.#currentDifferencesCount = this.#totalDifferencesCount;
        this.#ui.setDifferencesCount(this.#currentDifferencesCount, this.#totalDifferencesCount);
        this.#isEndGame = true;
        this.#ui.toggleSuccessModal(true);
      }
    });

    Particle.prepareTexture({ pixiApp: this.#pixiApp });
  }

  handleResize(options) {
    this.#ui.handleResize(options);
  }

  handleUpdate() {
    this.#checkGameStatus();
    this.#ui.handleUpdate();
  }

  #checkGameStatus() {
    if (this.#isEndGame) {
      return
    }
  }

  parseLevelData(levelId) {
    let initData = Assets.get(Resources.intoLevelId(levelId));
    let mainSlot = initData.slots.find(slot => slot.layer === 'standart');
    let mainTexture = Assets.get(Resources.intoLevelAssetId(levelId, mainSlot.name));
    let layerATextures = [];
    let layerBTextures = [];
    let slots = [];
    initData.slots.forEach(slot => {
      let levelAssetId = Resources.intoLevelAssetId(levelId, slot.name);
      switch (slot.layer) {
        case 'LayerA':
          layerATextures.push(Assets.get(levelAssetId));
          slots.push(Object.assign({ levelAssetId }, slot));
          break;
        case 'LayerB':
          layerBTextures.push(Assets.get(levelAssetId));
          slots.push(Object.assign({ levelAssetId }, slot));
          break;
      }
    });
    return {
      mainTexture,
      mainSlot,
      layerATextures,
      layerBTextures,
      slots,
    }
  }

  setLevel(levelId) {
    this.#currentLevel = levelId;
    this.#currentDifferencesCount = 0;
    this.#errorsCount = 0;
    this.#ui.setTitle(levelId);
    this.#ui.setDifferencesCount(this.#currentDifferencesCount, this.#totalDifferencesCount);
    this.#ui.setErrorsCount(this.#errorsCount);
    this.#parsedLevelData = this.parseLevelData(levelId);
    this.#totalDifferencesCount = this.#parsedLevelData.slots.length;
    this.#ui.toggleSuccessModal(false);
    this.#ui.setLevelData(this.#parsedLevelData);
    this.#ui.setDifferencesCount(this.#currentDifferencesCount, this.#totalDifferencesCount);

    SceneManager.resizeHandler();
  }

  handleSuccessResult = () => {
    this.#currentDifferencesCount += 1;
    this.#ui.setDifferencesCount(this.#currentDifferencesCount, this.#totalDifferencesCount);
    if (this.#currentDifferencesCount === this.#totalDifferencesCount) {
      this.#isEndGame = true;
      this.#ui.toggleSuccessModal(true);
    }
  }

  handleErrorResult = () => {
    this.#errorsCount += 1;
    this.#ui.setErrorsCount(this.#errorsCount);
  }

  handleNextLevel = () => {
    this.#currentLevel += 1;
    if (this.#currentLevel > this.#maxLevel) {
      this.#currentLevel = 1
    }
    this.onLoadLevel(this.#currentLevel);
  }
}
