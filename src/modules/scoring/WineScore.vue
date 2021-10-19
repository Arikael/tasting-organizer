<template>
  <div>
    {{ wine.name }}
  </div>
  <div>

  </div>
</template>

<script lang="ts">
import {WineWithScore} from "./BaseWine";
import {defineComponent} from "vue";

export default defineComponent({
  name: "WineScore",
  props: {
    wine: WineWithScore
  }
})
</script>

<style scoped>

</style>