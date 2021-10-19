<template>
  <div>
    <scoring-flight v-model="currentFlight"></scoring-flight>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
import {initializeCurrentTasting} from "@/modules/scoring/ScoringService";

export default defineComponent({
  name: "ScoringContainer",
  components: {ScoringFlight},
  props: {
    tastingId: String,
  },
  setup(props: any) {
    const tasting = initializeCurrentTasting(props.tastingId)

    return
  }
})
</script>

<style scoped>

</style>