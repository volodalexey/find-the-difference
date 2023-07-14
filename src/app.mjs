import { SceneManager } from './scenes/SceneManager.mjs'
import { LoaderScene } from './scenes/LoaderScene.mjs'
import { GameScene } from './scenes/GameScene.mjs'

async function run() {
  const loader = document.querySelector('.loader')
  if (loader != null) {
    loader.parentElement?.removeChild(loader)
  }
  await SceneManager.initialize()
  const loaderScene = new LoaderScene({
    viewWidth: SceneManager.width,
    viewHeight: SceneManager.height
  });
  const gameScene = new GameScene({
    app: SceneManager.app,
    viewWidth: SceneManager.width,
    viewHeight: SceneManager.height,
    onLoadLevel: (level) => {
      loadLevelAndRun(level);
    }
  });
  async function loadLevelAndRun(level) {
    await SceneManager.changeScene({ name: 'loader', newScene: loaderScene });
    await loaderScene.loadLevel(level);
    await SceneManager.changeScene({ name: 'game', newScene: gameScene });
    gameScene.game.setLevel(level);
  }
  let lsLevel = Number.parseInt(localStorage.getItem('levelId'));
  await loadLevelAndRun(Number.isFinite(lsLevel) ? lsLevel : 1);

  document.addEventListener('keydown', (e) => {
    let level = 0;
    switch (e.code) {
      case 'Digit1': level = 1; break;
      case 'Digit2': level = 2; break;
      case 'Digit3': level = 3; break;
      case 'Digit4': level = 4; break;
      case 'Digit5': level = 5; break;
    }
    if (level > 0) {
      loadLevelAndRun(level).catch(printError);
    }
  });
}

function printError(err) {
  console.error(err)
  const errorMessageDiv = document.querySelector('.error-message')
  if (errorMessageDiv != null) {
    errorMessageDiv.classList.remove('hidden')
    errorMessageDiv.innerText = ((Boolean(err)) && (Boolean(err.message))) ? err.message : err
  }
  const errorStackDiv = document.querySelector('.error-stack')
  if (errorStackDiv != null) {
    errorStackDiv.classList.remove('hidden')
    errorStackDiv.innerText = ((Boolean(err)) && (Boolean(err.stack))) ? err.stack : ''
  }
  const canvas = document.querySelector('canvas')
  if (canvas != null) {
    canvas.parentElement?.removeChild(canvas)
  }
}

run().catch(printError)
