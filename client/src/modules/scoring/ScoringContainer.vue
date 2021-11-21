<template>
  <h2>{{ store.tasting.title }}</h2>
  <div v-if="index === 0">
    <div v-if="hasIntro">
      {{ store.tasting.intro }}
    </div>
    <q-input outlined v-model="scoringData.username" :label="$t('name')" :dense="true"></q-input>
  </div>
  <div v-if="isFlightStep">
    <scoring-flight v-model="store.tasting.flights[index - 1]" v-bind:key="index - 1"></scoring-flight>
  </div>
  <div class="flight-navigation">
    <q-btn color="primary" v-if="canMoveBack" @click="moveBack()" :label="$t('back')"/>
    <q-btn color="primary" v-if="canMoveForward" @click="moveForward()" :label="$t('next')"/>
    <q-btn color="primary" v-if="isLastStep" :label="$t('submit')"/>
  </div>
  {{ store.tasting }}
</template>

<script lang="ts">
import {defineComponent, inject, onMounted, ref} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
import {Store} from "@/api/store";
import {initializeCurrentTasting} from "@/modules/scoring/ScoringService";

export default defineComponent({
  name: "ScoringContainer",
  components: {ScoringFlight},
  props: {
    tastingId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const store = inject<Store>('store') ?? new Store()

    onMounted(function () {
      if (store) {
        store.loadTastingForScoring(props.tastingId)
      }
    })

    const tastingData = initializeCurrentTasting(props.tastingId)

    return {
      store,
      scoringData: ref(tastingData.scoreData),
    }
  },
  data() {
    return {
      index: 0,
      step: 'base'
    }
  },
  computed: {
    isFlightStep(): boolean {
      return this.index > 0 && this.index <= this.store.tasting.flights.length;
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
    moveForward() {
      if (this.canMoveForward) {
        this.index += 1
      }
    },
    moveBack() {
      if (this.canMoveBack) {
        this.index -= 1
      }
    },
    submit() {
      return;
    }
  }
})
</script>

<style scoped>

</style>