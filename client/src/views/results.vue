<template>
  <TastingResults :tasting-id="tastingId"></TastingResults>
</template>

<script lang="ts">
import TastingResults from "@/modules/scoring/TastingResults.vue";
import {useUtils} from "@/lib/useUtils";

export default {
  name: "results",
  components: {TastingResults},
  setup() {
    const utils = useUtils()
    const tastingId =utils.loadTastingIdFromBrowser()

    return {
      tastingId
    }
  }
}
</script>

<style scoped>

</style>