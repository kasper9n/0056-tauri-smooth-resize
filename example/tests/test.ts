import { invoke } from '@tauri-apps/api'
import { getCurrent, LogicalSize } from '@tauri-apps/api/window'
import { assert } from 'chai'
import { resize, logicalInnerSize } from 'tauri-smooth-resize/src/resize'

export function handle_error(msg: string) {
  invoke('handle_error', { msg })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runCmd<T = any>(cmd: string, options: { [key: string]: any } = {}) {
  return (await invoke(cmd, options).catch((msg) => {
    handle_error(msg)
    throw msg
  })) as T
}

export async function isTestEnv() {
  return await runCmd('is_test_env')
}

export async function runTests() {
  try {
    await run()
  } catch (e) {
    handle_error(String(e))
  }
}

async function run() {
  const win = await getCurrent()
  await win.setSize(new LogicalSize(450, 250))

  const resizePromise = resize(400, 200)
  let size = await logicalInnerSize(win)
  assert(size.width !== 400, 'Resize should not be finished yet')
  assert(size.height !== 200, 'Resize should not be finished yet')

  await resizePromise
  size = await logicalInnerSize(win)
  assert(size.width === 400, 'Incorrect dimensions after resize')
  assert(size.height === 200, 'Incorrect dimensions after resize')

  console.log('All tests ran successfully')
  await runCmd('finish', { msg: 'All tests ran successfully' })
}
