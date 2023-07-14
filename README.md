# Find the difference (PixiJS) Game

- Use none minified version of PixiJS (ES module `mjs`)
- `SceneManager` mounts and unmounts current-active `*Scene`
- `LoaderSceneView` in resize:
  - `loaderTitle` - position adjusted
  - `loaderBar` - scaled + position adjusted
- `GameScene` => `UI` in resize:
  - `titleBar` - position adjusted
  - `splitScreen` - scaled + position adjusted
  - `statusBar` - position adjusted
- Communication between child/parent view is handled with `on()`|`emit()`
- Communication between child/parent model is handled with `callback()`
- For testing purpose keys `1`-`5` will load current level
- For testing purpose key `Space` will complete current level
