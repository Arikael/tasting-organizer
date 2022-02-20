<template>
  {{store.state.ui.currentStepState}}
  {{store.state.ui.currentStep}}

  <h2>{{ store.tasting.title }}</h2>
  <div v-if="store.state.ui.currentStep === 'intro'">
    <div v-if="hasIntro">
      {{ store.tasting.intro }}
    </div>
    <q-input outlined :model-value="store.scoreData.userName" @change="updateUser" :label="$t('name')" :dense="true"></q-input>
  </div>
  <div v-if="isFlightStep">
    <scoring-flight v-if="!isFlightRevealStep"></scoring-flight>
    <flight-reveal v-if="isFlightRevealStep"></flight-reveal>
  </div>
  <div class="flight-navigation">
    <q-btn color="primary" v-if="canMoveBack" @click="moveBack()" :label="$t('back')"/>
    <q-btn color="primary" v-if="canMoveForward" @click="moveForward()" :label="$t('next')"/>
    <q-btn color="primary" v-if="isLastStep" :label="$t('submit')"/>
  </div>
  {{ store.state }}
</template>

<script lang="ts">
import {computed, defineComponent, inject, onMounted, ref} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
import {Store} from "@/store/store";
import FlightReveal from "@/modules/scoring/FlightReveal.vue";
import {isFlightStepState} from "@/store/UiSteps";
import {QBtn, QInput} from "quasar"

export default defineComponent({
  name: "ScoringContainer",
  components: {FlightReveal, ScoringFlight, QBtn, QInput},
  props: {
    tastingId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = inject<Store>('store') ?? new Store()

    onMounted(async() => {
      if (store) {
        await store.loadTastingForScoring(props.tastingId)
      }
    })

    return {
      store: store,
      userName1: computed(() => store.state.test.i),
      isFlightRevealStep: computed((): boolean => {
        console.log(store.state.ui.currentStepState)

        if(store.state.ui.currentStepState !== undefined && isFlightStepState(store.state.ui.currentStepState)) {
          return store.state.ui.currentStepState.isOnFlightReveal
        }

        return false
      })
    }
  },
  data() {
    return {
      index: 0,
    }
  },
  computed: {
    isFlightStep(): boolean {
      return this.store.state.ui.currentStep === 'flight'
    },
    isLastStep(): boolean {
      return this.index >= this.store.tasting.flights.length;
    },
    hasIntro(): boolean {
      return this.store.tasting.intro.length > 0
    },
    hasOutro(): boolean {
      return this.store.tasting.outro.length > 0
    },
    canMoveForward(): boolean {
      return this.index < this.store.tasting.flights.length
    },
    canMoveBack(): boolean {
      return this.index > 0
    }
  },
  methods: {
    updateUser(value: string) {
      this.store.setUser(value)
    },
    async moveForward() {
      await this.store.moveUi('next')
    },
    async moveBack() {
      await this.store.moveUi('prev')
    },
    submit() {
      return;
    }
  }
})
</script>

<style scoped>

</style>