<template>
  <h2>{{ baseData.title }}</h2>
  <div>
    <q-input outlined v-model="scoringData.username" :label="$t('name')" :dense="true"></q-input>
  </div>
  <div>
    <scoring-flight v-model="scoringData.flights[index]" v-bind:key="index"></scoring-flight>
  </div>
  <div class="flight-navigation">
    <q-btn color="primary" :label="$t('next')" />
  </div>
  {{flights }}
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
      scoringData: tastingData.scoreData,
    }
  },
  data() {
    return {
      index: 0,
    }
  },
  methods: {
    nextFlight() {
      if(this.index < this.scoringData.flights.length) {
        this.index += 1
      }
    },
    previousFlight() {
      if(this.index > 0) {
        this.index -= 1
      }
    }
  }
})
</script>

<style scoped>

</style>