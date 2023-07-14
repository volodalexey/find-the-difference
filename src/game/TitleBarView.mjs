import { Container, Text } from "../lib/pixi.mjs";

export class TitleBarView extends Container {
  titleBarText;

  static titleOptions = {
    fontFamily: 'Filmotype Major',
    fontSize: 40,
    fill: 0xdeb887,
    letterSpacing: 5
  };

  constructor() {
    super()

    this.setup()
  }

  setup() {
    const titleBarText = new Text('', {
      ...TitleBarView.titleOptions
    })
    titleBarText.anchor.set(0.5, 0);
    this.addChild(titleBarText)
    this.titleBarText = titleBarText;
  }
}