<template>
  <q-input class="q-mt-sm q-mb-md" type="number" filled v-model="score"
           :error="!scoreStatus.ok"
           debounce="200"
           :hint="displayScaleDescription"
           :error-message="$t('ScoringNotInRangeError', {min: currentScale.min, max: currentScale.max})"
           :label="label"></q-input>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, WritableComputedRef} from 'vue';
import {BaseWineDto, ScoringScaleItem, UserScoresDto} from '@/api/types'
import {QInput} from 'quasar';
import {store} from "@/store";
import {useI18n} from "vue-i18n";
import {FormFieldState} from "@/common/types";

export default defineComponent({
  name: 'WineScore',
  components: {QInput},
  props: {
    wine: BaseWineDto,
    default: () => new BaseWineDto()
  },
  setup(props) {
    const i18n = useI18n({useScope: 'global'})
    const scoreStatus = ref<FormFieldState<number>>(new FormFieldState<number>(0))

    const setLocalScoreFromState = (wineId: string, defaultValue = 0) => {
      if (wineId) {
        scoreStatus.value.value = store.getters.getScore(wineId)?.score ?? defaultValue
      }
    }

    onMounted(() => {
      setLocalScoreFromState(props.wine?.id ?? '')
    })

    const setScore = (value: number) => {
      const score = parseInt(value.toString(10), 10)
      const wineId = props.wine?.id ?? ''

      if (!isNaN(score) && wineId) {
        scoreStatus.value.value = score
        store.setters.setScore(wineId, score).then((x: boolean | UserScoresDto) => {
          if (x === false) {
            scoreStatus.value.ok = false
          } else {
            scoreStatus.value.ok = true

            setLocalScoreFromState(wineId, score)
          }
        })
      } else {
        scoreStatus.value.ok = false
      }
    }

    const score: WritableComputedRef<number> = computed({
          get(): number {
            return scoreStatus.value.value
          },
          set(value: number): void {
            setScore(value)
          }
        }
    )

    return {
      store,
      currentScale: store.getters.currentScoreScale,
      scoreStatus: computed(() => scoreStatus.value),
      wineName: props.wine?.name ?? '',
      score,
      label: computed((): string => {
        if (store.state.tasting.revealAfter !== 'always') {
          return `${i18n.t('Wine')} ${(props.wine?.name ?? '')}`
        }

        return props.wine?.name ?? ''
      }),
      displayScaleDescription: computed(() => {
        const scaleItem = store.getters.currentScoreScale.value.items.find((x: ScoringScaleItem) => {
          return x.min <= scoreStatus.value.value && scoreStatus.value.value <= x.max
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