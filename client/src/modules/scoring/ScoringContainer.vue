<template>
  <div class="content-box content-box--padding tasting-header">
    <h2 class="text-subtitle1 tasting-title">{{ store.tasting.title }}</h2>
    <span class="text-caption"><q-icon name="today" class="q-mr-xs"></q-icon>{{ getTastingDate }}</span>
    <div class="text-caption q-pt-md" v-if="hasIntro">
      {{ store.tasting.intro }}
    </div>
  </div>
  <div class="content-box content-box--padding" v-if="store.state.ui.currentStep === 'intro'">
    <q-input class="q-my-sm" :model-value="store.scoreData.userName" @change="updateUser"
             :label="$t('yourUsername')"></q-input>
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
</template>

<script lang="ts">
import {computed, defineComponent, inject, onMounted, ref} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
import {Store} from "@/store/store";
import FlightReveal from "@/modules/scoring/FlightReveal.vue";
import {isFlightStepState} from "@/store/UiSteps";
import {QBtn, QIcon, QInput} from "quasar"

export default defineComponent({
  name: "ScoringContainer",
  components: {FlightReveal, ScoringFlight, QBtn, QInput, QIcon},
  props: {
    tastingId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = inject<Store>('store') ?? new Store()

    onMounted(async () => {
      if (store) {
        await store.loadTastingForScoring(props.tastingId)
      }
    })

    return {
      store: store,
      userName1: computed(() => store.state.test.i),
      isFlightRevealStep: computed((): boolean => {
        console.log(store.state.ui.currentStepState)

        if (store.state.ui.currentStepState !== undefined && isFlightStepState(store.state.ui.currentStepState)) {
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
    getTastingDate(): string {
      return this.store.state.tasting.date.toDateString()
    },
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