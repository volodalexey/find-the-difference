import { Resize } from "./Resize.mjs";
import { SplitLayer } from "./SplitLayer.mjs";
import { SplitScreenView } from "./SplitScreenView.mjs";

export class SplitScreen {
  #view;
  #layerA;
  #layerB;
  #layout;
  onSuccessResult;
  onErrorResult;

  static options = {
    gap: 30
  }

  constructor({ onSuccessResult, onErrorResult }) {
    this.onSuccessResult = onSuccessResult;
    this.onErrorResult = onErrorResult;
    this.setup()
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new SplitScreenView();

    this.#layerA = new SplitLayer({ onSiblingResult: this.handleSiblingResult, onErrorResult: this.handleErrorResult });
    this.#view.layerA.addChild(this.#layerA.view);
    this.#layerB = new SplitLayer({ onSiblingResult: this.handleSiblingResult, onErrorResult: this.handleErrorResult });
    this.#view.layerB.addChild(this.#layerB.view);
  }

  handleResize({ viewWidth, viewHeight }) {
    let availableWidth = viewWidth;
    let availableHeight = viewHeight;
    this.#layerA.handleResize({ viewWidth, viewHeight });
    this.#layerB.handleResize({ viewWidth, viewHeight });

    switch (this.#layout) {
      case 'horizontal': {
        let availableLayerHeight = (viewHeight - SplitScreen.options.gap) / 2;
        this.#layerA.handleResize({ viewWidth, viewHeight: availableLayerHeight });
        this.#layerB.handleResize({ viewWidth, viewHeight: availableLayerHeight });
        this.#view.layerA.position.y = 0;
        this.#view.layerB.position.y = this.#view.layerA.height + SplitScreen.options.gap;
        this.#view.layerA.position.x = this.#view.layerB.position.x = 0;
        let totalWidth = this.#view.layerA.width;
        let totalHeight = this.#view.layerA.height + this.#view.layerB.height + SplitScreen.options.gap;
        Resize.handleResize({
          view: this.#view, availableWidth, availableHeight, totalWidth, totalHeight
        }, { logName: 'SplitScreen hor', lockX: true, lockY: true });
        break;
      }
      case 'vertical': {
        let availableLayerWidth = (viewWidth - SplitScreen.options.gap) / 2;
        this.#layerA.handleResize({ viewWidth: availableLayerWidth, viewHeight });
        this.#layerB.handleResize({ viewWidth: availableLayerWidth, viewHeight });
        this.#view.layerA.position.y = this.#view.layerB.position.y = 0;
        this.#view.layerA.position.x = 0;
        this.#view.layerB.position.x = this.#view.layerA.width + SplitScreen.options.gap;
        let totalWidth = this.#view.layerA.width + this.#view.layerB.width + SplitScreen.options.gap;
        let totalHeight = this.#view.layerA.height;
        Resize.handleResize({
          view: this.#view, availableWidth, availableHeight, totalWidth, totalHeight
        }, { logName: 'SplitScreen ver', lockX: true, lockY: true });
        break;
      }
    }
  }

  setLevelData({ mainTexture, mainSlot, layerATextures, layerBTextures, slots }) {
    if (mainSlot.width >= mainSlot.height) {
      this.#layout = 'horizontal';
    } else {
      this.#layout = 'vertical';
    }
    this.#layerA.setLayerData({ mainTexture, mainSlot, layerTextures: layerATextures, slotsData: slots });
    this.#layerB.setLayerData({ mainTexture, mainSlot, layerTextures: layerBTextures, slotsData: slots });
  }

  handleUpdate() {
    this.#layerA.handleUpdate();
    this.#layerB.handleUpdate();
  }

  handleSiblingResult = (slotData) => {
    this.#layerA.processSuccessResult(slotData);
    this.#layerB.processSuccessResult(slotData);
    this.onSuccessResult();
  }

  handleErrorResult = () => {
    this.onErrorResult();
  }

  toggleDisabled(toggle) {
    this.#layerA.toggleDisabled(toggle);
    this.#layerB.toggleDisabled(toggle);
  }
}