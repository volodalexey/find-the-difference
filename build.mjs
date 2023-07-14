import { join } from 'node:path'
import { readdir, rm, cp } from 'node:fs/promises'
import { fileURLToPath, URL } from 'node:url'

async function buildStart() {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  // clean
  let filePaths = []
  try {
    filePaths = await readdir(join(__dirname, 'dist'))
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
  for (const filePath of filePaths) {
    if (filePath === '.git') {
      continue
    }
    const fullFilePath = join(__dirname, 'dist', filePath)
    await rm(fullFilePath, { recursive: true })
  }
  // copy
  await cp(join(__dirname, 'src'), join(__dirname, 'dist'), { recursive: true })
}

buildStart();