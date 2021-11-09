import { window } from '@tauri-apps/api'
import { PhysicalSize } from '@tauri-apps/api/window'

function cubicInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1
}

type Options = {
  duration?: number
  easingFn?: (time: number) => number
}
const defaultOptions = {
  duration: 400,
  easingFn: cubicInOut,
}
/**
 * Smoothly resize the current window.
 * Example:
 * ```js
 * import { resize } from 'tauri-smooth-resize'
 * await resize(800, 600, { duration: 100 })
 * ```
 */
export async function resize(width: number, height: number, options: Options = defaultOptions) {
  const finalWidth = width
  const finalHeight = height
  const duration = options.duration || defaultOptions.duration
  const easingFn = options.easingFn || defaultOptions.easingFn
  const win = window.getCurrent()

  if (await win.isFullscreen()) {
    return
  }

  const startSize = await win.innerSize()
  const widthDelta = finalWidth - startSize.width
  const heightDelta = finalHeight - startSize.height
  const startTime = Date.now()

  async function step() {
    const progress = (Date.now() - startTime) / duration
    if (progress >= 1) {
      win.setSize(new PhysicalSize(finalWidth, finalHeight))
      return true
    } else {
      const completion = easingFn(progress)
      const stepWidth = Math.round(startSize.width + widthDelta * completion)
      const stepHeight = Math.round(startSize.height + heightDelta * completion)
      await win.setSize(new PhysicalSize(stepWidth, stepHeight))
      return false
    }
  }
  let stepInProgress = false
  let done = false
  async function frame() {
    if (!done && stepInProgress) {
      requestAnimationFrame(frame)
    } else if (!done) {
      stepInProgress = true
      requestAnimationFrame(frame)
      done = await step()
      stepInProgress = false
    }
  }
  frame()
}
