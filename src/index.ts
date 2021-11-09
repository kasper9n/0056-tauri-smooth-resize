import { LogicalSize, PhysicalSize, WebviewWindow, getCurrent } from '@tauri-apps/api/window'

function cubicInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1
}

async function logicalInnerSize(win: WebviewWindow): Promise<LogicalSize> {
  const innerSize = await win.innerSize()
  let physicalSize = new PhysicalSize(innerSize.width, innerSize.height)
  return physicalSize.toLogical(await win.scaleFactor())
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
  const win = getCurrent()

  if (await win.isFullscreen()) {
    return
  }

  const startSize = await logicalInnerSize(win)
  const widthDelta = finalWidth - startSize.width
  const heightDelta = finalHeight - startSize.height
  const startTime = Date.now()
  console.log(startSize.width, startSize.height, startSize.type)

  async function step() {
    const progress = (Date.now() - startTime) / duration
    if (progress >= 1) {
      win.setSize(new LogicalSize(finalWidth, finalHeight))
      return true
    } else {
      const completion = easingFn(progress)
      const stepWidth = Math.round(startSize.width + widthDelta * completion)
      const stepHeight = Math.round(startSize.height + heightDelta * completion)
      await win.setSize(new LogicalSize(stepWidth, stepHeight))
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
