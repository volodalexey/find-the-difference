import { Container, Graphics, Sprite } from "../lib/pixi.mjs";
import { Resize } from "./Resize.mjs";

export class SplitLayerView extends Container {
  mainSprite;
  mainSpriteMask;
  patchSprites;
  resuts;

  static options = {
    borderRadius: 20,
  }

  constructor() {
    super()

    this.setup();
  }

  setup() {
    this.mainSprite = new Sprite();
    this.addChild(this.mainSprite);
    this.mainSpriteMask = new Graphics();
    this.addChild(this.mainSpriteMask);

    this.patchSprites = new Container();
    this.addChild(this.patchSprites);

    this.mainSprite.eventMode = 'static';
    this.mainSprite.addEventListener('pointertap', (e) => { this.emit('pointer-tap', this.toLocal(e)); });

    this.resuts = new Container();
    this.addChild(this.resuts);
  }

  drawMask() {
    this.mainSpriteMask.clear();
    this.mainSpriteMask.beginFill(0xffffff);
    this.mainSpriteMask.position.set(this.mainSprite.x, this.mainSprite.y);
    this.mainSpriteMask.drawRoundedRect(0, 0, this.mainSprite.width, this.mainSprite.height, SplitLayerView.options.borderRadius);
    this.mainSpriteMask.endFill();
    this.mainSprite.mask = this.mainSpriteMask;
    this.patchSprites.mask = this.mainSpriteMask;
  }

  clear() {
    while (this.patchSprites.children[0] != null) {
      this.patchSprites.children[0].removeFromParent()
    }
    while (this.resuts.children[0] != null) {
      this.resuts.children[0].removeFromParent()
    }
  }

  appendSlotTexture(texture) {
    let sprite = new Sprite(texture);
    this.patchSprites.addChild(sprite);
    return sprite;
  }

  handleResize({ viewWidth, viewHeight }) {
    const availableWidth = viewWidth
    const availableHeight = viewHeight
    const totalWidth = this.mainSprite.texture.width;
    const totalHeight = this.mainSprite.texture.height;
    Resize.handleResize({
      view: this, availableWidth, availableHeight, totalWidth, totalHeight
    }, { logName: 'SplitLayer', lockX: true, lockY: true });
  }

  appendResult(result, { x, y }) {
    this.resuts.addChild(result);
    result.position.set(x, y);
  }

  handleUpdate() {
    this.resuts.children.forEach((result) => {
      result.handleUpdate();
    });
    for (let i = 0; i < this.resuts.length; i++) {
      const result = this.resuts.children[i];
      if (result.markedForDeletion) {
        result.removeFromParent()
        i--
      }
    }
  }
}