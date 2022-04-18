<template>
  <h2 class="text-h6 main-title">{{ $t('Flight') }} {{ flightIndex + 1 }}</h2>
  <wine-score :wine="wine" v-for="(wine) in flight.wines" v-bind:key="wine.id"></wine-score>
</template>


<script lang="ts">
import {defineComponent} from 'vue'
import WineScore from '@/modules/scoring/WineScore.vue'
import {store} from '@/store'

export default defineComponent({
  name: "ScoringFlight",
  components: {WineScore},
  setup() {
    return {
      flightIndex: store.getters.currentFlightIndex,
      flight: store.getters.currentFlight
    }
  }
})
</script>

<style scoped lang="scss">
@import "../../styles/quasar.variables";
@import "../../styles/mixins";

.flight-wines {
  @include default-content-padding;
}
</style>