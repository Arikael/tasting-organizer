<template>
  <TastingResults :tasting-id="tastingId"></TastingResults>
</template>

<script lang="ts">
import TastingResults from "@/modules/scoring/TastingResults.vue";
import {useScoringUtils} from "@/modules/scoring/useScoringUtils";

export default {
  name: "results",
  components: {TastingResults},
  setup() {
    const utils = useScoringUtils()
    const tastingId =utils.loadTastingId()

    return {
      tastingId
    }
  }
}
</script>

<style scoped>

</style>