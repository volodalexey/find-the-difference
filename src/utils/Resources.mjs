export class Resources {
  static baseUrl = 'https://hgstudio.ru/jstesttask/levels';
  // static baseUrl = './assets';

  static intoLevelId(levelId) {
    return `level-${levelId}`
  }

  static intoLevelUrl(levelId) {
    return `${this.baseUrl}/${levelId}/level.json`
  }

  static intoLevelAssetId(levelId, assetId) {
    return `${Resources.intoLevelId(levelId)}-${assetId}`
  }

  static intoLevelAssetUrl(levelId, assetName) {
    return `${Resources.baseUrl}/${levelId}/images/${assetName}.jpg`
  }
}