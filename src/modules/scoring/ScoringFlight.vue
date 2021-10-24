<template>
  <div>
    Name {{ modelValue.name }}
  </div>
  <div class="flight-wines">
    <wine-score v-model="flightValues.wines[index].score" :label="flightValues.wines[index].name"
                v-for="(wine, index) in flightValues.wines" v-bind:key="wine.id"></wine-score>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import WineScore from "@/modules/scoring/WineScore.vue";
import {Flight, WineWithScore} from "@/modules/scoring/Entities";

export default defineComponent({
  name: "ScoringFlight",
  components: {WineScore},
  props: {
    modelValue: {
      type: Object as PropType<Flight<WineWithScore>>
    }
  },
  data() {
    return {
      flightValues: this.modelValue
    }
  }
})
</script>

<style scoped>

</style>