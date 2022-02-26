<template>
  <div class="content-box">
    <div class="flight-header content-box_header">
      {{ flight.name }}
    </div>
    <div class="flight-wines">
      <wine-score :wine="wine"
                  v-for="(wine) in flight.wines" v-bind:key="wine.id"></wine-score>
    </div>
  </div>
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
      flight: store.getters.currentFlight
    }
  },
  computed: {

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