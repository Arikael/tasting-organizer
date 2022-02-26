<template>
  <div class="content-box">
    <div class="flight-header content-box_header">
      FlightReveal
    </div>
    <ul>
      <li v-for="(wine) in currentRevealedWines" v-bind:key="wine">
        {{wine}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import {store} from "@/store";

export default defineComponent({
  name: "FlightReveal",
  setup(props) {
    return {
      currentRevealedWines: store.getters.currentRevealedWines
    }
  }
})
</script>

<style scoped>

</style>