<template>
  <h2 class="text-h6 main-title">{{ $t('Flight') }} {{ flightIndex + 1 }} - {{$t('reveal')}}</h2>
  <div class="content-box">
    <ul>
      <li v-for="(wine) in currentRevealedWines" v-bind:key="wine">
        {{wine}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {store} from "@/store";

export default defineComponent({
  name: "FlightReveal",
  setup() {

    return {
      flightIndex: store.getters.currentFlightIndex,
      currentRevealedWines: store.getters.currentRevealedWines
    }
  }
})
</script>

<style scoped>

</style>