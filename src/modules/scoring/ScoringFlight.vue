<template>
  <div>
    {{ flight.name }}
  </div>
  <div class="flight-wines">
    <wine-score :wine="wine" v-for="wine in flight.wines" v-bind:key="wine.id"></wine-score>
  </div>
</template>

<script lang="ts">
import {BaseFlight} from "./BaseWine";
import {defineComponent} from "vue";
import WineScore from "@/modules/scoring/WineScore.vue";

export default defineComponent({
  name: "ScoringFlight",
  components: {WineScore},
  props: {
    flight: BaseFlight
  }
})
</script>

<style scoped>

</style>