import { TitleBarView } from "./TitleBarView.mjs";

export class TitleBar {
  #view;

  constructor(options) {
    this.setup(options)
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new TitleBarView();
  }

  setTitle(level) {
    this.#view.titleBarText.text = `Уровень ${level}`;
  }
}