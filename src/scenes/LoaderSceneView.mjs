import { logLayout } from '../utils/logger.mjs'
import { Container, Graphics, Text } from '../lib/pixi.mjs'
import { Resize } from '../game/Resize.mjs';

export class LoaderSceneView extends Container {
  #loaderTitle;
  #loaderBar;
  #loaderBarFill;
  #loaderBarBorder;
  static barOptions = {
    initWidth: 10,
    width: 350,
    height: 40,
    fillColor: 0x183dd0,
    borderRadius: 5,
    borderThick: 5,
    borderColor: 0x000000
  };

  static titleOptions = {
    fontFamily: 'Filmotype Major',
    fontSize: 30,
    fill: [0xdd0000, 0xdeb887],
    stroke: 0xffffff,
    strokeThickness: 1,
    letterSpacing: 5
  };

  constructor() {
    super()

    this.setup()
    this.draw()
  }

  setup() {
    const loaderTitle = new Text('Загрузка...', {
      ...LoaderSceneView.titleOptions
    })
    // loaderTitle.anchor.set(0.5, 0);
    this.addChild(loaderTitle)
    // loaderTitle.position.x = LoaderSceneView.barOptions.width / 2;
    this.#loaderTitle = loaderTitle

    const loaderBar = new Container();
    this.addChild(loaderBar);
    loaderBar.position.y = LoaderSceneView.titleOptions.fontSize * 1.2;
    this.#loaderBar = loaderBar

    const loaderBarBorder = new Graphics()
    loaderBar.addChild(loaderBarBorder)
    this.#loaderBarBorder = loaderBarBorder

    const loaderBarFill = new Graphics()
    loaderBar.addChild(loaderBarFill)
    this.#loaderBarFill = loaderBarFill
  }

  draw() {
    const { barOptions } = LoaderSceneView
    const loaderBarFill = this.#loaderBarFill
    const loaderBarBorder = this.#loaderBarBorder
    loaderBarBorder.beginFill(barOptions.borderColor)
    loaderBarBorder.drawRoundedRect(0, 0, barOptions.width, barOptions.height, barOptions.borderRadius)
    loaderBarBorder.endFill()

    loaderBarFill.beginFill(barOptions.fillColor)
    loaderBarFill.position.set(barOptions.borderThick, barOptions.borderThick)
    loaderBarFill.drawRoundedRect(
      0,
      0,
      barOptions.width - barOptions.borderThick * 2,
      barOptions.height - barOptions.borderThick * 2,
      barOptions.borderRadius)
    loaderBarFill.endFill()
  }

  downloadStarted = () => {
    this.#loaderBarFill.width = LoaderSceneView.barOptions.initWidth;
  }

  downloadProgress = (progressRatio) => {
    this.#loaderBarFill.width = (LoaderSceneView.barOptions.width - LoaderSceneView.barOptions.borderThick * 2) * progressRatio
  }

  handleResize({ viewWidth, viewHeight }) {
    const availableWidth = viewWidth
    const availableHeight = viewHeight
    const totalWidth = LoaderSceneView.barOptions.width;
    const totalHeight = this.#loaderTitle.height + LoaderSceneView.barOptions.height;
    Resize.handleResize({
      view: this.#loaderBar, availableWidth, availableHeight, totalWidth, totalHeight
    }, { lockX: true, lockY: true });
    Resize.handleResize({
      view: this.#loaderTitle, availableWidth: this.#loaderBar.width, availableHeight, totalWidth: this.#loaderTitle.width, totalHeight
    }, { lockWidth: true, lockHeight: true, lockY: true });
    Resize.handleResize({
      view: this, availableWidth, availableHeight, totalWidth, totalHeight
    }, { lockWidth: true, lockHeight: true });
  }
}