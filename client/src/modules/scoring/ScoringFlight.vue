<template>
  <div>
    Name {{ flight.name }}
  </div>
  <div class="flight-wines">
    <wine-score :wine="wine"
                v-for="(wine) in flight.wines" v-bind:key="wine.id"></wine-score>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import WineScore from "@/modules/scoring/WineScore.vue";
import {BaseWineDto, FlightDto} from '@/api/types'
import {Store} from "@/store/store";
import {isFlightStepState} from "@/store/UiSteps";

export default defineComponent({
  name: "ScoringFlight",
  components: {WineScore},
  setup() {
    const store = inject<Store>('store') ?? new Store()

    return {
      store
    }
  },
  computed: {
    flight(): FlightDto<BaseWineDto> {
      if (this.store.state.ui.currentStep == 'flight' && this.store.state.ui.currentStepState
          && isFlightStepState(this.store.state.ui.currentStepState)) {
        return this.store.state.tasting.flights[this.store.state.ui.currentStepState.flightIndex]
      }

      return new FlightDto<BaseWineDto>()
    }
  }
})
</script>

<style scoped>

</style>