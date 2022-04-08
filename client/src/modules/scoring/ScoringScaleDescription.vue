<template>
  <div class="text-caption q-pt-md">
    {{ $t('ScoringScaleMinMaxDesc', {'min': currentScoreScale.min, 'max': currentScoreScale.max}) }}

    <ul class="q-pl-none no-list-style-type">
      <li v-for="scale in currentScoreScale.items" v-bind:key="scale.description">
        <span class="score-scale__min-max">{{scale.min}} - {{scale.max}}</span> {{scale.description}}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {store} from '@/store'
import {defineComponent} from 'vue'

export default defineComponent({
  name: "ScoringScaleDescription",
  setup() {
    return {
      currentScoreScale: store.getters.currentScoreScale
    }
  }
})
</script>

<style scoped lang="scss">
@import "../../styles/quasar.variables.scss";

  .score-scale__min-max {
    display: inline-block;
    width: map-get($space-md, 'y') * 4;
  }
</style>