<template>
  <q-badge v-if="isLowestScore || isHighestScore" :color="cssScoreBadgeColor">
    {{ value }}
  </q-badge>
  <template v-else>
    {{ value }}
  </template>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {store} from "@/store";
import {QBadge} from "quasar";

export default defineComponent({
  name: "TastingResultCell",
  components: {QBadge},
  props: {
    value: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ""
    }
  },
  setup(props) {
    const state = store.state
    const getPropertyName = computed((): string => {
      const propertyName = props.name.charAt(0).toUpperCase() + props.name.slice(1)

      if (!Object.prototype.hasOwnProperty.call(state.tastingResults.highAndLowScores, 'high' + propertyName) ||
          !Object.prototype.hasOwnProperty.call(state.tastingResults.highAndLowScores, 'low' + propertyName)) {
        return ''
      }
      return propertyName
    })

    const isHighestScore = computed((): boolean => {
      return isScoreMatch('high' + getPropertyName.value)
    })

    const isLowestScore = computed((): boolean => {
      return isScoreMatch('low' + getPropertyName.value)
    })

    const isScoreMatch = (propertyName: string): boolean => {
      if (!propertyName) {
        return false
      }

      return props.value === Math.round(state.tastingResults.highAndLowScores[propertyName])
    }

    return {
      propertyName: getPropertyName,
      isHighestScore,
      isLowestScore,
      cssScoreBadgeColor: computed((): string => {
        if (isHighestScore.value) {
          return 'green'
        } else if (isLowestScore.value) {
          return 'orange'
        }

        return ''
      })
    }
  }
})
</script>

<style scoped>

</style>