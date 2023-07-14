import { Container } from "../lib/pixi.mjs";

export class SplitScreenView extends Container {
  layerA;
  layerB;

  constructor() {
    super();

    this.setup();
  }

  setup() {
    this.layerA = new Container();
    this.addChild(this.layerA);
    this.layerB = new Container();
    this.addChild(this.layerB);
  }
}