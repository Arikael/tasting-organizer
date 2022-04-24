<template>
  <div>
    <scoring-intro v-if="state.ui.currentStep.type === 'intro'"></scoring-intro>
    <scoring-flight v-if="state.ui.currentStep.type === 'flight'"></scoring-flight>
    <flight-reveal v-if="state.ui.currentStep.type === 'reveal'"></flight-reveal>
    <scoring-end v-if="state.ui.currentStep.type === 'end'"></scoring-end>
  </div>
  <div class="flight-navigation" v-if="!isOnEndStep">
    <q-btn color="secondary" class="q-mr-md" v-if="canMoveBack" :disabled="!currentStepModelValid" @click="moveBack()"
           :label="$t('back')"/>
    <q-btn color="primary" v-if="canMoveForward" @click="saveAndMoveForward()" :disable="!currentStepModelValid"
           :label="$t('next')"/>
    <q-btn color="primary" class="q-ml-md" v-if="isOnLastStepBeforeEndStep" :disabled="!isModelValid"
           @click="finishScoring()"
           :label="$t('submit')"/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
import FlightReveal from "@/modules/scoring/FlightReveal.vue";
import {QBtn} from "quasar"
import {store} from '@/store'
import ScoringEnd from "@/modules/scoring/ScoringEnd.vue";
import ScoringIntro from "@/modules/scoring/ScoringIntro.vue";

export default defineComponent({
  name: "ScoringContainer",
  components: {ScoringIntro, ScoringEnd, FlightReveal, ScoringFlight, QBtn},
  setup() {
    onMounted(async () => {
      await store.actions.loadTastingForScoring()
    })

    return {
      state: store.state,
      modelIsValid: computed(() => store.state.ui.modelIsValid),
      isOnFlightRevealStep: store.getters.isOnFlightRevealStep,
      canMoveForward: store.getters.canMoveForward,
      canMoveBack: store.getters.canMoveBack,
      isOnEndStep: store.getters.isOnEndStep,
      isOnLastStepBeforeEndStep: store.getters.isOnLastStepBeforeEndStep,
      currentStepModelValid: store.getters.currentStepModelValid,
      isModelValid: store.getters.isModelValid,
      finishScoring: store.actions.finishScoring,
      moveForward: () => store.actions.moveUi('next'),
      moveBack: () => store.actions.moveUi('prev'),
      saveAndMoveForward: () => store.actions.saveAndMoveForward()
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