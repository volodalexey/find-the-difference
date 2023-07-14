import { Container, Text } from "../lib/pixi.mjs";

export class StatusBarView extends Container {
  differencesCountLabelText;
  differencesCountValueText;
  errorsCountLabelText;
  errorsCountValueText;

  static options = {
    gap: 10
  }

  static differencesFoundOptions = {
    fontFamily: 'Filmotype Major',
    fontSize: 20,
    fillLabel: 0xcccccc,
    fillValue: 0x00ff00,
    letterSpacing: 1
  };

  static errorsCountOptions = {
    fontFamily: 'Filmotype Major',
    fontSize: 20,
    fillLabel: 0xcccccc,
    fillValue: 0xff0000,
    letterSpacing: 1
  };

  constructor() {
    super()

    this.setup()
  }

  setup() {
    const differencesCountValueText = new Text('', {
      ...StatusBarView.differencesFoundOptions,
      fill: StatusBarView.differencesFoundOptions.fillValue,
    })
    this.addChild(differencesCountValueText);
    this.differencesCountValueText = differencesCountValueText;

    const differencesCountLabelText = new Text('Отличий найдено:', {
      ...StatusBarView.differencesFoundOptions,
      fill: StatusBarView.differencesFoundOptions.fillLabel,
    })
    this.addChild(differencesCountLabelText);
    this.differencesCountLabelText = differencesCountLabelText;

    const errorsCountValueText = new Text('', {
      ...StatusBarView.errorsCountOptions,
      fill: StatusBarView.errorsCountOptions.fillValue,
    })
    this.addChild(errorsCountValueText);
    errorsCountValueText.position.y = differencesCountValueText.height + StatusBarView.options.gap;
    this.errorsCountValueText = errorsCountValueText;

    const errorsCountLabelText = new Text('Ошибок:', {
      ...StatusBarView.errorsCountOptions,
      fill: StatusBarView.errorsCountOptions.fillLabel,
    })
    this.addChild(errorsCountLabelText);
    errorsCountLabelText.position.y = differencesCountValueText.height + StatusBarView.options.gap;
    this.errorsCountLabelText = errorsCountLabelText;
  }

  handleResize({ viewWidth }) {
    this.differencesCountValueText.position.x = viewWidth - this.differencesCountValueText.width;
    this.differencesCountLabelText.position.x = this.differencesCountValueText.position.x - this.differencesCountLabelText.width - StatusBarView.options.gap;
    this.errorsCountValueText.position.x = viewWidth - this.errorsCountValueText.width;
    this.errorsCountLabelText.position.x = this.errorsCountValueText.position.x - this.errorsCountLabelText.width - StatusBarView.options.gap;
  }
}