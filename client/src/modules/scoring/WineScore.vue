<template>
  <q-input class="q-my-sm" type="number" filled v-model="score"
           :error="!scoreStatus.ok"
           debounce="500"
           :error-message="$t('ScoringNotInRangeError', {min: currentScale.min, max: currentScale.max})"
           :label="label"></q-input>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, WritableComputedRef} from 'vue';
import {BaseWineDto, UserScoresDto} from '@/api/types'
import {QInput} from 'quasar';
import {store} from "@/store";
import {useI18n} from "vue-i18n";
import {ActionResult, FormFieldState} from "@/common/types";

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
    
    const setCurrentScore = (wineId: string, defaultValue = 0) => {
      if (wineId) {
        scoreStatus.value.value = store.getters.getScore(wineId)?.score ?? defaultValue
      }
    }
    
    onMounted(() => {
      setCurrentScore(props.wine?.id ?? '')
    })

    const score: WritableComputedRef<number> = computed({
          get(): number {
            return scoreStatus.value.value
          },
          set(value: number): void {
            const score = parseInt(value.toString(10), 10)
            const wineId = props.wine?.id ?? ''
            scoreStatus.value.value = score

            if (!isNaN(score) && wineId) {
              store.setters.setScore(wineId, score).then((x: boolean | UserScoresDto) => {
                if (x === false) {
                  scoreStatus.value.ok = false
                } else {
                  scoreStatus.value.ok = true

                  setCurrentScore(wineId, score)
                }
              })
            } else {
              scoreStatus.value.ok = false
            }
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
      })
    }
  }
})
</script>

<style scoped>

</style>