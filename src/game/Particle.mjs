import { Graphics, Sprite } from "../lib/pixi.mjs"

export class Particle extends Sprite {
  static texture

  static prepareTexture({ pixiApp }) {
    const star = new Graphics()
    star.beginFill(0xffffff)
    star.drawPolygon([55, 10,
      57, 15,
      63, 15,
      58, 19,
      60, 25,
      55, 22,
      50, 25,
      51, 19,
      47, 15,
      53, 15
    ])
    star.endFill()
    star.alpha = 0.2
    star.width = 2
    star.cacheAsBitmap = true;
    Particle.texture = pixiApp.renderer.generateTexture(star)
  }

  static options = {
    gravity: 0.08,
    renderRadius: 100
  }

  markedForDeletion = false;

  velocity = {
    vx: 0,
    vy: 0
  };

  constructor() {
    super(Particle.texture)
    this.width = this.height = Math.random() * 10 + 10
    this.velocity.vx = Math.random() * 10 - 5
    this.velocity.vy = Math.random() * 2 + 1

    this.tint = (Math.random() * 0xFFFFFF << 0)
  }

  handleUpdate() {
    if (this.markedForDeletion) {
      return
    }
    this.velocity.vy -= Particle.options.gravity
    this.x -= this.velocity.vx
    this.y -= this.velocity.vy
    this.alpha *= 0.99
    if (this.alpha < 0.1) {
      this.markedForDeletion = true
    }
  }
}