<template>
  <div>
    Name {{ modelValue.name }}
  </div>
  <div class="flight-wines">
    <wine-score :wine="wine"
                v-for="(wine) in flightValues.wines" v-bind:key="wine.id"></wine-score>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import WineScore from "@/modules/scoring/WineScore.vue";
import {BaseWineDto, FlightDto} from '@/api/types'

export default defineComponent({
  name: "ScoringFlight",
  components: {WineScore},
  props: {
    modelValue: {
      type: Object as PropType<FlightDto<BaseWineDto>>
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