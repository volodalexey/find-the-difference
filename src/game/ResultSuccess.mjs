import { Graphics } from "../lib/pixi.mjs";

export class ResultSuccess extends Graphics {
  markedAsCompleted = false;

  static options = {
    fill: 0x00ff00,
    borderRadius: 10,
    borderWidth: 10,
    initScale: 3,
  }

  constructor(options) {
    super();

    this.draw(options);
  }

  draw({ width, height }) {
    const { fill, borderWidth, borderRadius, initScale } = ResultSuccess.options;
    this.beginFill(fill);
    this.drawRoundedRect(0, 0, width, height, borderRadius);
    this.endFill();
    this.beginHole()
    let innerWidth = width - borderWidth * 2;
    let innerHeight = height - borderWidth * 2;
    this.drawRoundedRect(
      borderWidth,
      borderWidth,
      innerWidth,
      innerHeight,
      borderRadius);
    this.endHole();

    this.pivot.set(this.width / 2, this.height / 2);
    this.scale.set(initScale);
  }

  handleUpdate() {
    if (this.markedAsCompleted) {
      return
    }
    let circle = Math.PI * 2;
    if (this.scale.x > 1.01) {
      this.scale.x = this.scale.y = this.scale.x * 0.95
    } else {
      this.scale.x = 1
      this.rotation = this.rotation % circle;
    }
    if (this.scale.x !== 1) {
      this.rotation += 0.1
    } else {
      if (this.rotation < circle / 2 - 0.01) {
        this.rotation += (circle / 2 - this.rotation) * 0.05;
      } else {
        this.rotation = 0
      }
    }
    if (this.scale.x === 1 && this.rotation === 0) {
      this.markedAsCompleted = true
    }
  }
}