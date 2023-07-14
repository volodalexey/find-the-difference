import { logLayout } from "../utils/logger.mjs"

export class Resize {
  static handleResize({ view, availableWidth, availableHeight, totalWidth, totalHeight }, options = { logName: '', lockX: false, lockY: false, lockWidth: false, lockHeight: false }) {
    let occupiedWidth, occupiedHeight;
    if (availableWidth >= totalWidth && availableHeight >= totalHeight) {
      occupiedWidth = totalWidth;
      occupiedHeight = totalHeight;
      logLayout(`${options.logName} Spacing aw=${availableWidth} ow=${occupiedWidth} ah=${availableHeight} oh=${occupiedHeight}`);
    } else {
      let scale = 1
      if (totalHeight >= totalWidth) {
        scale = availableHeight / totalHeight
        if (scale * totalWidth > availableWidth) {
          scale = availableWidth / totalWidth
        }
        logLayout(`${options.logName} By height (sc=${scale})`)
      } else {
        scale = availableWidth / totalWidth
        logLayout(`${options.logName} By width (sc=${scale})`)
        if (scale * totalHeight > availableHeight) {
          scale = availableHeight / totalHeight
        }
      }
      occupiedWidth = Math.floor(totalWidth * scale);
      occupiedHeight = Math.floor(totalHeight * scale);
      logLayout(`${options.logName} Scaling aw=${availableWidth} (ow=${occupiedWidth}) ah=${availableHeight} (oh=${occupiedHeight})`);
    }
    let x = availableWidth > occupiedWidth ? (availableWidth - occupiedWidth) / 2 : 0
    let y = availableHeight > occupiedHeight ? (availableHeight - occupiedHeight) / 2 : 0
    if (!options.lockX) {
      view.x = x;
      logLayout(`${options.logName} set x=${x}`);
    }
    if (!options.lockWidth) {
      view.width = occupiedWidth;
      logLayout(`${options.logName} set width=${occupiedWidth}`);
    }
    if (!options.lockY) {
      view.y = y;
      logLayout(`${options.logName} set y=${y}`);
    }
    if (!options.lockHeight) {
      view.height = occupiedHeight;
      logLayout(`${options.logName} set height=${occupiedHeight}`);
    }
  }
}