<script lang="ts">
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
  async function resize(width: number, height: number, options: Options = defaultOptions) {
    const finalWidth = width
    const finalHeight = height
    const duration = options.duration || defaultOptions.duration
    const easingFn = options.easingFn || defaultOptions.easingFn
    const win = window.getCurrent()

    const isFullScreen = await win.isFullscreen()
    if (isFullScreen) {
      return
    }

    const startSize = await win.innerSize()
    const widthDelta = finalWidth - startSize.width
    const heightDelta = finalHeight - startSize.height
    const startTime = Date.now()

    async function step() {
      let progress = (Date.now() - startTime) / duration
      if (progress >= 1) {
        win.setSize(new PhysicalSize(finalWidth, finalHeight))
        return true
      } else {
        let completion = easingFn(progress)
        let stepWidth = Math.round(startSize.width + widthDelta * completion)
        let stepHeight = Math.round(startSize.height + heightDelta * completion)
        await win.setSize(new PhysicalSize(stepWidth, stepHeight))
        return false
      }
    }
    let stepInProgress = false
    let done = false
    async function frame() {
      if (done) {
        return
      } else if (stepInProgress) {
        requestAnimationFrame(frame)
      } else {
        stepInProgress = true
        requestAnimationFrame(frame)
        done = await step()
        stepInProgress = false
      }
    }
    frame()
  }
</script>

<h1>Svelte Smooth Resize</h1>
<button on:click={() => resize(800, 600)}>Smaller</button>
<button on:click={() => resize(1000, 800)}>Bigger</button>

<style lang="sass">
  :global(body)
    margin-top: 100px
    font-family: Arial, Helvetica, sans-serif
    font-size: 18px
    background-color: #111318
    color: #f2f2f2
    text-align: center
  h1
    color: #00d9ff
</style>
