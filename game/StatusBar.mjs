import { StatusBarView } from "./StatusBarView.mjs";

export class StatusBar {
  #view;
  #lastWidth;

  constructor(options) {
    this.setup(options)
  }

  get view() {
    return this.#view;
  }

  setup() {
    this.#view = new StatusBarView();
  }

  setDifferencesCount(current, total) {
    this.#view.differencesCountValueText.text = `${current}/${total}`;
    this.handleResize({ viewWidth: this.#lastWidth });
  }

  setErrorsCount(count) {
    this.#view.errorsCountValueText.text = `${count}`;
    this.handleResize({ viewWidth: this.#lastWidth });
  }

  handleResize({ viewWidth }) {
    this.#view.handleResize({ viewWidth });
    this.#lastWidth = viewWidth;
  }
}