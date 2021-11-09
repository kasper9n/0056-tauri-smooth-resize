<script lang="ts">
  import { resize } from 'tauri-smooth-resize/src/index'
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
