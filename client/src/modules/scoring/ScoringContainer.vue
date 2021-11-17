<template>
  <h2>{{ baseData.title }}</h2>
  <div v-if="index === 0">
    <div v-if="hasIntro">
      {{baseData.intro}}
    </div>
    <q-input outlined v-model="scoringData.username" :label="$t('name')" :dense="true"></q-input>
  </div>
  <div v-if="isFlightStep">
    <scoring-flight v-model="scoringData.flights[index - 1]" v-bind:key="index - 1"></scoring-flight>
  </div>
  <div class="flight-navigation">
    <q-btn color="primary" v-if="canMoveBack" @click="moveBack()" :label="$t('back')" />
    <q-btn color="primary" v-if="canMoveForward" @click="moveForward()" :label="$t('next')" />
    <q-btn color="primary" v-if="isLastStep" :label="$t('submit')" />
  </div>
  {{scoringData }}
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import ScoringFlight from "@/modules/scoring/ScoringFlight.vue";
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
    const tastingData = initializeCurrentTasting(props.tastingId)
    
    return {
      baseData: tastingData.baseData,
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
        return this.index > 0 && this.index <= this.scoringData.flights.length;
    },
    isLastStep(): boolean {
        return this.index >= this.scoringData.flights.length;
    },
    hasIntro(): boolean {
        return this.baseData.intro.length > 0
    },
    hasOutro(): boolean {
        return this.baseData.outro.length > 0

    },
    canMoveForward(): boolean {
        return this.index < this.scoringData.flights.length

    },
    canMoveBack(): boolean {
        return this.index > 0
    }
  },
  methods: {
    moveForward() {
      if(this.canMoveForward) {
        this.index += 1
      }
    },
    moveBack() {
      if(this.canMoveBack) {
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