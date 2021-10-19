<template>
  <scoring-container tasting-id="tastingId"></scoring-container>
</template>

<script lang="ts">
import ScoringContainer from "../modules/scoring/ScoringContainer";
import {defineComponent} from "vue";
import {initializeCurrentTasting} from "@/modules/scoring/ScoringService";

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