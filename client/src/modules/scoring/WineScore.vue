<template>
  <div class="wine-score">
    <div class="wine-score__label">{{ label }}: <span class="wine-score__label-value">{{ score }}</span></div>
    <div class="wine-score__control">
      <q-slider color="accent" :model-value="score" @change="setScore"
                :error="!scoreStatus.ok"
                :hint="displayScaleDescription"
                markers
                marker-labels-class="wine-score__markers"
                :marker-labels="markerLabels"
                :min="currentScale.min"
                :max="currentScale.max"
                :error-message="$t('ScoringNotInRangeError', {min: currentScale.min, max: currentScale.max})"
                label>
      </q-slider>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
import {BaseWineDto, ScoringScaleItem} from '@/api/types'
import {QSlider} from 'quasar';
import {store} from "@/store";
import {useI18n} from "vue-i18n";
import {useScoringForWine} from "@/modules/scoring/useScoringValidators";

export default defineComponent({
  name: 'WineScore',
  components: {QSlider},
  props: {
    wine: BaseWineDto,
    default: () => new BaseWineDto()
  },
  setup(props) {
    const i18n = useI18n({useScope: 'global'})
    const scoringForWine = useScoringForWine(props.wine?.id ?? '')

    onMounted(() => {
      scoringForWine.setLocalScoreFromState(props.wine?.id ?? '')
    })

    return {
      markerLabels: store.getters.currentScoreScaleMarkerSteps,
      store,
      ...scoringForWine,
      wineName: props.wine?.name ?? '',
      label: computed((): string => {
        if (store.state.tasting.revealAfter !== 'always') {
          return `${i18n.t('Wine')} ${(props.wine?.name ?? '')}`
        }

        return props.wine?.name ?? ''
      }),
      displayScaleDescription: computed(() => {
        const scaleItem = store.getters.currentScoreScale.value.items.find((x: ScoringScaleItem) => {
          return x.min <= scoringForWine.scoreStatus.value.value && scoringForWine.scoreStatus.value.value <= x.max
        })

        if (scaleItem) {
          return `${scaleItem.min} - ${scaleItem.max} = ${scaleItem.description}`
        }

        return ''
      })
    }
  }
})
</script>

<style lang="scss">
@import "../../styles/quasar.variables";

.wine-score__markers {
  font-size: 12px;
}

.wine-score {
  background: white;
  border: 1px solid $grey-6;
  border-radius: 3px;
  margin-bottom: map-get($space-md, 'y');
  padding: 0 map-get($space-md, 'x');
  padding-top: map-get($space-md, 'y');
}

.wine-score__label {
  //padding-bottom: map-get($space-sm, 'y');
}
</style>