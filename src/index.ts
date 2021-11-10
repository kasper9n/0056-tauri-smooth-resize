import { LogicalSize, PhysicalSize, WebviewWindow, getCurrent } from '@tauri-apps/api/window'

function cubicInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 0.5 * Math.pow(2 * t - 2, 3) + 1
}

async function logicalInnerSize(win: WebviewWindow): Promise<LogicalSize> {
  // .toLogical() isn't available from win.innerSize() even though the
  // specified return type is PhysicalSize
  const innerSize = await win.innerSize()
  const physicalSize = new PhysicalSize(innerSize.width, innerSize.height)
  return physicalSize.toLogical(await win.scaleFactor())
}

/**
 * Calls the callback every animation frame, unless the last callback has not
 * yet returned.
 *
 * The function returns when the interval is cancelled.
 */
async function animationInterval(callback: (cancel: () => void) => Promise<void>) {
  let inProgress = false
  let done = false
  function cancel() {
    done = true
  }
  const interval = new Promise((resolve) => {
    async function tick() {
      if (done) {
        resolve(null)
      } else if (inProgress) {
        requestAnimationFrame(tick)
      } else {
        inProgress = true
        requestAnimationFrame(tick)
        await callback(cancel)
        inProgress = false
      }
    }
    tick()
  })
  await interval
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

  await animationInterval(async (cancel) => {
    const progress = (Date.now() - startTime) / duration
    if (progress >= 1) {
      await win.setSize(new LogicalSize(finalWidth, finalHeight))
      cancel()
    } else {
      const completion = easingFn(progress)
      const stepWidth = Math.round(startSize.width + widthDelta * completion)
      const stepHeight = Math.round(startSize.height + heightDelta * completion)
      await win.setSize(new LogicalSize(stepWidth, stepHeight))
    }
  })
}
