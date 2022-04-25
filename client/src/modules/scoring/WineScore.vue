<template>

  <div :class="{'wine-score': true, 'wine-score--error': !scoreStatus.ok }">
    <div
        :class="{'wine-score__title text-grey-9': true, 'bg-grey-3': scoreStatus.ok, 'wine-score__title--error': !scoreStatus.ok}">
      {{ label }}
    </div>
    <div class="wine-score__content">
      <div class="wine-score__control">
        <div class="fit row">
          <q-input v-model.number="score" type="number" max="100" min="75" color="accent"
                   class="wine-score__input" outlined dense style="width:80px"
                   mask="###"
                   :error-message="$t('ScoringNotInRangeError', {min: currentScale.min, max: currentScale.max})">
          </q-input>
          <div class="col-grow wine-score__scale-desc self-center">
            <span class="text-grey-8 text-caption">{{ displayScaleDescription }}</span>
            <span class="text-negative text-caption" v-if="!scoreStatus.ok"> {{
                $t('ScoringNotInRangeError', {
                  min: currentScale.min,
                  max: currentScale.max
                })
              }}</span>
          </div>
        </div>
        <q-slider color="accent" v-model="score"
                  markers
                  marker-labels-class="wine-score__markers"
                  :marker-labels="markerLabels"
                  :min="currentScale.min"
                  :max="currentScale.max"
                  label>
        </q-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from 'vue';
import {BaseWineDto, ScoringScaleItem} from '@/api/types'
import {QSlider} from 'quasar';
import {store} from "@/store";
import {useI18n} from "vue-i18n";
import {useScoringForWine} from "@/modules/scoring/useScoringForWine";

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
          return x.min <= scoringForWine.score.value && scoringForWine.score.value <= x.max
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
  border: 1px solid $grey-5;
  margin-bottom: map-get($space-lg, 'y');
  border-radius: 6px;
}

.wine-score__title {
  border-bottom: 1px solid $grey-5;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: map-get($space-sm, 'y') map-get($space-md, 'x');
}

.wine-score__scale-desc {
  text-align: right;
}

.wine-score__input {
  padding-bottom: 0;
}

.wine-score__content {
  padding: 0 map-get($space-md, 'x');
  padding-top: map-get($space-md, 'y');
}

.wine-score--error {
  border: 1px solid $negative;
  outline: 1px solid $negative;
  transition: 0.36s cubic-bezier(0.4, 0, 0.2, 1);
}

.wine-score__title--error {
  border-bottom: 2px solid $negative;
  background: $red-2;
}

.wine-score__label {
  //padding-bottom: map-get($space-sm, 'y');
}
</style>