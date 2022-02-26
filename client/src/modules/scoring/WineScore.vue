<template>
  <q-input class="q-my-sm" filled :model-value="score" @update:model-value="updateScore" :label="label"></q-input>
</template>

<script lang="ts">
import {defineComponent, inject} from 'vue';
import {Store} from '@/store/store';
import {BaseWineDto} from '@/api/types'
import {QInput} from 'quasar';

export default defineComponent({
  name: 'WineScore',
  components: {QInput},
  props: {
    wine: BaseWineDto
  },
  setup(props) {
    const store = inject<Store>('store') ?? new Store()

    return {
      store,
      wineName: props.wine?.name ?? ''
    }
  },
  computed: {
    label(): string {
      if (this.store.tasting.revealAfter !== 'always') {
        return `${this.$t('wine')} ${(this.wine?.name ?? '')}`
      }

      return this.wine?.name ?? ''
    },
    score(): number {
      let score = 0
      if (this.wine) {
        score = this.store.getScore(this.wine?.id)?.score ?? 0
      }

      return score
    }
  },
  methods: {
    updateScore(value: string) {
      const score = parseInt(value, 10)
      const wineId = this.wine?.id ?? ''

      if (!isNaN(score) && wineId) {
        this.store.setScore(wineId, score)
      }
    }
  }
})
</script>

<style scoped>

</style>