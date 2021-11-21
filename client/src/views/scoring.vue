<template>
  <scoring-container :tasting-id="tastingId"></scoring-container>
</template>

<script lang="ts">
import {defineComponent } from "vue";
import ScoringContainer from "@/modules/scoring/ScoringContainer.vue";
import {useRoute} from "vue-router";

export default defineComponent({
  name: "scoring",
  components: {ScoringContainer},
  setup(props) {
    const route = useRoute()
    let tastingId = ''
    let id = route.params?.id ?? ''
    tastingId = Array.isArray(id) ? id[0] : id

    return {
      tastingId
    }
  },
})
</script>

<style scoped>

</style>