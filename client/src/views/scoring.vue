<template>
  <scoring-container></scoring-container>
</template>

<script lang="ts">
import {defineComponent } from "vue";
import ScoringContainer from "@/modules/scoring/ScoringContainer.vue";

export default defineComponent({
  name: "scoring",
  components: {ScoringContainer}
})
</script>

<style scoped>

</style>