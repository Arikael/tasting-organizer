<template>
  <scoring-container :tasting-id="tastingId"></scoring-container>
</template>

<script lang="ts">
import {defineComponent } from "vue";
import ScoringContainer from "@/modules/scoring/ScoringContainer.vue";
import {useScoringUtils} from "@/modules/scoring/useScoringUtils";

export default defineComponent({
  name: "scoring",
  components: {ScoringContainer},
  setup() {
    const utils = useScoringUtils()
    const tastingId =utils.loadTastingId()

    return {
      tastingId
    }
  }
})
</script>

<style scoped>

</style>