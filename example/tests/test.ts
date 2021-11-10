import { invoke, process } from '@tauri-apps/api'
import { assert } from 'chai'
// import { resize } from 'tauri-smooth-resize/src/index'

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
  assert.isNumber(2, 'isnumber?')

  console.log('All tests ran successfully')
  await runCmd('finish', { msg: 'All tests ran successfully' })
}
