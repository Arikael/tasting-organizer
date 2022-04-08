<template>
  <q-input class="q-mt-sm q-mb-md" filled v-model="score"
           :error="!scoreStatus.ok"
           debounce="200"
           :hint="displayScaleDescription"
           mask="###"
           :error-message="$t('ScoringNotInRangeError', {min: currentScale.min, max: currentScale.max})"
           :label="label"></q-input>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
import {BaseWineDto, ScoringScaleItem} from '@/api/types'
import {QInput} from 'quasar';
import {store} from "@/store";
import {useI18n} from "vue-i18n";
import {useScoringForWine} from "@/modules/scoring/useScoringValidators";

export default defineComponent({
  name: 'WineScore',
  components: {QInput},
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

<style scoped>

</style>