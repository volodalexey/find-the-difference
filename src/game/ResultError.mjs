import { Graphics } from "../lib/pixi.mjs";

export class ResultError extends Graphics {
  markedForDeletion = false;
  #crossLineA;
  #crossLineB;
  static options = {
    fill: 0xff0000,
    borderRadius: 10,
    borderWidth: 8,
    initWidth: 80,
    initHeight: 80,
    initScale: 3,
  }

  constructor() {
    super();

    this.setup();
    this.draw();
  }

  setup() {
    this.#crossLineA = new Graphics();
    this.addChild(this.#crossLineA);

    this.#crossLineB = new Graphics();
    this.addChild(this.#crossLineB);
  }

  draw() {
    const { initWidth, initHeight, fill, borderWidth, borderRadius, initScale } = ResultError.options;
    this.beginFill(fill);
    this.drawRoundedRect(0, 0, initWidth, initHeight, borderRadius);
    this.endFill();
    this.beginHole()
    let innerWidth = initWidth - borderWidth * 2;
    let innerHeight = initHeight - borderWidth * 2;
    this.drawRoundedRect(
      borderWidth,
      borderWidth,
      innerWidth,
      innerHeight,
      borderRadius);
    this.endHole();

    let lineWidth = Math.hypot(innerHeight, innerWidth) / 2;

    this.#crossLineA.position.set(initWidth / 2, initHeight / 2);
    this.#crossLineA.beginFill(fill);
    this.#crossLineA.drawRect(0, 0, lineWidth, borderWidth);
    this.#crossLineA.endFill();
    this.#crossLineA.pivot.set(lineWidth / 2, ResultError.options.borderWidth / 2)
    this.#crossLineA.rotation = Math.atan2(innerHeight, innerWidth);

    this.#crossLineB.position.set(initWidth / 2, initHeight / 2);
    this.#crossLineB.beginFill(ResultError.options.fill);
    this.#crossLineB.drawRect(0, 0, lineWidth, ResultError.options.borderWidth);
    this.#crossLineB.endFill();
    this.#crossLineB.pivot.set(lineWidth / 2, ResultError.options.borderWidth / 2)
    this.#crossLineB.rotation = -this.#crossLineA.rotation;

    this.pivot.set(this.width / 2, this.height / 2);
    this.scale.set(initScale);
  }

  handleUpdate() {
    if (this.markedForDeletion) {
      return
    }
    if (this.scale.x > 1.01) {
      this.scale.x = this.scale.y = this.scale.x * 0.95
    } else {
      this.scale.x = 1
    }
    if (this.scale.x === 1) {
      if (this.alpha > 0.1) {
        this.alpha *= 0.99
      } else {
        this.alpha = 0
      }
    }
    if (this.alpha === 0) {
      this.markedForDeletion = true
    }
  }
}