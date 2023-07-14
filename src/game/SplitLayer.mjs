import { ResultError } from "./ResultError.mjs";
import { ResultSuccess } from "./ResultSuccess.mjs";
import { SplitLayerView } from "./SplitLayerView.mjs";

export class SplitLayer {
  #view;
  #slotsData;
  onSiblingResult;
  onErrorResult;
  #disabled = false;

  constructor({ onSiblingResult, onErrorResult }) {
    this.onSiblingResult = onSiblingResult;
    this.onErrorResult = onErrorResult;
    this.setup()
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new SplitLayerView();
    this.#view.on('pointer-tap', this.handlePointerTap);
  }

  setLayerData({ mainTexture, mainSlot, layerTextures, slotsData }) {
    this.#slotsData = slotsData;
    this.#view.mainSprite.texture = mainTexture;
    this.#view.mainSprite.width = mainSlot.width;
    this.#view.mainSprite.height = mainSlot.height;
    this.#view.mainSprite.x = mainSlot.x;
    this.#view.mainSprite.y = mainSlot.y;
    this.#view.clear();
    layerTextures.forEach(texture => {
      let sprite = this.#view.appendSlotTexture(texture);
      let slotData = slotsData.find(slotData => texture.textureCacheIds.includes(slotData.levelAssetId));
      sprite.width = slotData.width;
      sprite.height = slotData.height;
      sprite.x = slotData.x;
      sprite.y = slotData.y;
    });

    this.#view.drawMask();
  }

  handleResize(options) {
    this.#view.handleResize(options);
  }

  handlePointerTap = (e) => {
    if (this.#disabled) {
      return;
    }
    let slotData = this.#slotsData.find(slotData => {
      return e.x >= slotData.x && e.x <= (slotData.x + slotData.width) &&
        e.y >= slotData.y && e.y <= (slotData.y + slotData.height);
    });
    if (slotData) {
      if (!slotData.matched) {
        slotData.matched = true;
        this.onSiblingResult(slotData);
      }
    } else {
      this.#view.appendResult(new ResultError(), e);
      this.onErrorResult();
    }
  }

  handleUpdate() {
    this.#view.handleUpdate();
  }

  processSuccessResult(slotData) {
    this.#view.appendResult(
      new ResultSuccess({ width: slotData.width, height: slotData.height }),
      { x: slotData.x + slotData.width / 2, y: slotData.y + slotData.height / 2 }
    );
  }

  toggleDisabled(toggle) {
    this.#disabled = toggle;
  }
}