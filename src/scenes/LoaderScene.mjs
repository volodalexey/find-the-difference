
import { LoaderSceneView } from './LoaderSceneView.mjs';
import { Assets } from '../lib/pixi.mjs'
import { logLoader } from '../utils/logger.mjs'
import { Resources } from '../utils/Resources.mjs';

export class LoaderScene {

  name = 'loader';

  view;
  constructor() {
    this.view = new LoaderSceneView();

    Array.from(Array(5)).forEach((_, idx) => Assets.add(Resources.intoLevelId(idx + 1), Resources.intoLevelUrl(idx + 1)));
  }

  async loadLevel(levelId) {
    this.view.downloadStarted()
    await Assets.load('./assets/Filmotype_Major.woff2')
    logLoader(`started loading level ${levelId}`)
    let levelData = await Assets.load(Resources.intoLevelId(levelId));
    logLoader(`loaded level data ${levelData}`);
    let levelAssetIds = this.parseLevelData(levelId, levelData);
    logLoader(`parsed level data ${levelAssetIds}`);

    Assets.addBundle(String(levelId), levelAssetIds);

    logLoader(`started load bundle ${levelId}`);
    await Assets.loadBundle(String(levelId), this.handleProgress);
    logLoader(`completed load level ${levelId}`);
  }


  parseLevelData(levelId, levelData) {
    let levelAssetIds = [];
    levelData.slots.forEach(slot => {
      if (typeof slot.name === 'string') {
        levelAssetIds.push({ name: Resources.intoLevelAssetId(levelId, slot.name), srcs: Resources.intoLevelAssetUrl(levelId, slot.name) })
      }
    });
    return levelAssetIds
  }

  handleResize(options) {
    this.view.handleResize(options)
  }

  handleProgress = (progressRatio) => {
    this.view.downloadProgress(progressRatio)
  }

  handleMounted() { }

  handleUpdate() { }
}
