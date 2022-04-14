<template>
  <div class="text-left">
    {{ $t('AllScores') }}:
    <template v-for="(score, index) in allScores">
      {{ score.score }}
      <template v-if="index < allScores.length - 1">,</template>
    </template>
    <br/>
    <div>
      {{ $t('MyScore') }}: {{ myScore }}
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import {ScoreWithUserDto} from "../../api/types"
import {store} from "@/store";

export default defineComponent({
  name: "TastingResultDetailRow",
  props: {
    scores: {
      type: Array as PropType<ScoreWithUserDto[]>,
      default: () => []
    }
  },
  setup(props) {
    return {
      allScores: computed(() => {
        return [...props.scores].sort((x, y) => y.score - x.score)
      }),
      myScore: computed(() => {
        const score = props.scores.find(x => x.userId === store.getters.currentUser.value)

        if (score) {
          return score.score
        }

        return 0
      })
    }
  }
})
</script>

<style scoped>

</style>