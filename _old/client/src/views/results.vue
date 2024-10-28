<template>
  <TastingResults :tasting-id="tastingId"></TastingResults>
</template>

<script lang="ts">
import TastingResults from "@/modules/scoring/TastingResults.vue";
import {useBrowserStorageUtils} from "@/lib/useBrowserStorageUtils";

export default {
  name: "results",
  components: {TastingResults},
  setup() {
    const utils = useBrowserStorageUtils()
    const tastingId =utils.loadTastingIdFromBrowser()

    return {
      tastingId
    }
  }
}
</script>

<style scoped>

</style>