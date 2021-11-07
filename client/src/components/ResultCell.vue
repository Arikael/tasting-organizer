<template>
  <q-badge v-if="isScoreMatch" :color="cssScoreBadgeColor">
    {{value}}
  </q-badge>
  <template v-else>
    {{value}}
  </template>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent( {
  name: "ResultCell",
  props: {
    highScore: Number,
    lowScore: Number,
    value: null
  },
  computed: {
    isScoreMatch(): boolean {
      return this.value !== null && !Number.isNaN(this.value)
          && (this.value === this.highScore || this.value == this.lowScore);
    },
    cssScoreBadgeColor(): string {
      if(Number.isNaN(this.value)) {
        return ''
      }

      if(this.value === this.highScore) {
        return 'green'
      }
      else if(this.value === this.lowScore) {
        return 'orange'
      }

      return ''
    }
  }
})
</script>

<style scoped>

</style>