<template>
  <scoring-container :tasting-id="tastingId"></scoring-container>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import ScoringContainer from "@/modules/scoring/ScoringContainer.vue"

export default defineComponent({
  name: "scoring",
  components: {ScoringContainer},
  setup(props) {

    return {
      tastingId: "sdf"
    }
  }
})
</script>

<style scoped>

</style>