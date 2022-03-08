<template>
  <template v-if="state.scoreData.isFinished">
    <div class="content-box content-box--padding">
      {{ $t('scoreAlreadySubmitted') }}
    </div>
  </template>
  <template v-else>
    <div>
      <scoring-intro v-if="state.ui.currentStep.type === 'intro'"></scoring-intro>
      <scoring-flight v-if="state.ui.currentStep.type === 'flight'"></scoring-flight>
      <flight-reveal v-if="state.ui.currentStep.type === 'reveal'"></flight-reveal>
      <scoring-end v-if="state.ui.currentStep.type === 'end'"></scoring-end>
    </div>
    <div class="flight-navigation">
      <q-btn color="primary" v-if="canMoveBack" @click="moveBack()" :label="$t('back')"/>
      <q-btn color="primary" v-if="canMoveForward" @click="moveForward()" :label="$t('next')"/>
      <q-btn color="primary" v-if="isOnLastStep" @click="finishScoring()" :label="$t('submit')"/>
    </div>
  </template>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
import FlightReveal from "@/modules/scoring/FlightReveal.vue";
import {QBtn} from "quasar"
import {store} from '@/store'
import ScoringEnd from "@/modules/scoring/ScoringEnd.vue";
import ScoringIntro from "@/modules/scoring/ScoringIntro.vue";

export default defineComponent({
  name: "ScoringContainer",
  components: {ScoringIntro, ScoringEnd, FlightReveal, ScoringFlight, QBtn},
  props: {
    tastingId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    onMounted(async () => {
      await store.actions.loadTastingForScoring(props.tastingId)
    })

    return {
      state: store.state,
      isOnFlightRevealStep: store.getters.isOnFlightRevealStep,
      canMoveForward: store.getters.canMoveForward,
      canMoveBack: store.getters.canMoveBack,
      isOnLastStep: store.getters.isOnLastStep,
      finishScoring: store.setters.finishScoring,
      moveForward: () => store.actions.moveUi('next'),
      moveBack: () => store.actions.moveUi('prev')
    }
  }
})
</script>

<style scoped lang="scss">
@import "../../styles/quasar.variables";

.flight-navigation {
  padding: 0 map-get($space-md, 'x');
}
</style>