<script lang="ts">
  import { resize } from 'tauri-smooth-resize/src/index'
</script>

<h1>Tauri Smooth Resize</h1>
<button on:click={() => resize(400, 300)}>Smaller</button>
<button on:click={() => resize(500, 400)}>Bigger</button>

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
