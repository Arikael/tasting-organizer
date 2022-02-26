<template>
  <q-input class="q-my-sm" filled :model-value="score" @update:model-value="updateScore" :label="label"></q-input>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {BaseWineDto} from '@/api/types'
import {QInput} from 'quasar';
import {store} from "@/store";

export default defineComponent({
  name: 'WineScore',
  components: {QInput},
  props: {
    wine: BaseWineDto
  },
  setup(props) {
    return {
      store,
      wineName: props.wine?.name ?? ''
    }
  },
  computed: {
    label(): string {
      if (this.store.state.tasting.revealAfter !== 'always') {
        return `${this.$t('wine')} ${(this.wine?.name ?? '')}`
      }

      return this.wine?.name ?? ''
    },
    score(): number {
      let score = 0
      if (this.wine) {
        score = this.store.getters.getScore(this.wine?.id)?.score ?? 0
      }

      return score
    }
  },
  methods: {
    updateScore(value: string) {
      const score = parseInt(value, 10)
      const wineId = this.wine?.id ?? ''

      if (!isNaN(score) && wineId) {
        this.store.setters.setScore(wineId, score)
      }
    }
  }
})
</script>

<style scoped>

</style>