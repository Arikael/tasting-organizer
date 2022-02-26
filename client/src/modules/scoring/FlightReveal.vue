<template>
  <div class="content-box">
    <div class="flight-header content-box_header">
      FlightReveal
    </div>
    <ul>
      <li v-for="(wine) in wines" v-bind:key="wine">
        {{wine}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import {Store} from "@/store/store";
import {isFlightStepState} from "@/store/UiSteps";

export default defineComponent({
  name: "FlightReveal",
  setup(props) {
    const store = inject<Store>('store') ?? new Store()

    return {
      store: store,
    }
  },
  computed: {
    wines(): string[] {
      if (this.store.state.ui.currentStepState !== undefined && isFlightStepState(this.store.state.ui.currentStepState)) {
        return this.store.state.ui.currentStepState.revealedWines
      }

      return []
    }
  }
})
</script>

<style scoped>

</style>