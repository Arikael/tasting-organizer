<template>
  <template v-if="state.scoreData.isFinished">
    <div class="content-box content-box--padding">
      {{ $t('scoreAlreadySubmitted') }}
    </div>
  </template>
  <template v-else>
    <div class="content-box content-box--padding tasting-header">
      <h2 class="text-subtitle1 tasting-title">{{ state.tasting.title }}</h2>
      <span class="text-caption"><q-icon name="today" class="q-mr-xs"></q-icon>{{ getTastingDate }}</span>
      <div class="text-caption q-pt-md" v-if="hasIntro">
        {{ state.tasting.intro }}
      </div>
    </div>
    <div class="content-box content-box--padding" v-if="state.ui.currentStep.type === 'intro'">
      <q-input class="q-my-sm" :model-value="state.scoreData.userName" @change="setUser"
               :label="$t('yourUsername')"></q-input>
    </div>
    <div>
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
import {QBtn, QIcon, QInput} from "quasar"
import {store} from '@/store'
import ScoringEnd from "@/modules/scoring/ScoringEnd.vue";

export default defineComponent({
  name: "ScoringContainer",
  components: {ScoringEnd, FlightReveal, ScoringFlight, QBtn, QInput, QIcon},
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
      setUser: store.setters.setUser,
      isOnFlightRevealStep: store.getters.isOnFlightRevealStep,
      canMoveForward: store.getters.canMoveForward,
      canMoveBack: store.getters.canMoveBack,
      isOnLastStep: store.getters.isOnLastStep,
      finishScoring: store.setters.finishScoring
    }
  },
  computed: {
    getTastingDate(): string {
      return store.state.tasting.date.toDateString()
    },
    hasIntro(): boolean {
      return store.state.tasting.intro.length > 0
    },
  },
  methods: {
    async moveForward() {
      await store.actions.moveUi('next')
    },
    async moveBack() {
      await store.actions.moveUi('prev')
    },
    submit() {
      return;
    }
  }
})
</script>

<style scoped lang="scss">
@import "../../styles/quasar.variables";

.tasting-title {
  margin: 0;
  line-height: 1;
}

.flight-navigation {
  padding: 0 map-get($space-md, 'x');
}
</style>