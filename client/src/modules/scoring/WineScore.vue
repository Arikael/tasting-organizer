<template>
  <div>
    <q-input outlined :model-value="score" @update:model-value="updateScore" :label="wine?.name" :dense="true"></q-input>
  </div>
</template>

<script lang="ts">
import {defineComponent, inject} from "vue";
import {BaseWine} from "@/modules/scoring/Entities";
import {Store} from "@/api/store";

export default defineComponent({
  name: "WineScore",
  props: {
    wine: BaseWine
  },
  setup(props) {
    const store = inject<Store>('store') ?? new Store()

    return {
      store,
      wineName: props.wine?.name ?? ''
    }
  },
  computed: {
    score(): number {
      let score = 0
      if(this.wine) {
        score = this.store.getScore(this.wine?.id)?.score ?? 0
      }

      return score
    }
  },
  methods: {
    updateScore(value: string) {
      const score = parseInt(value, 10)
      const wineId = this.wine?.id ?? ''

      if(!isNaN(score) && wineId) {
        this.store.setScore(wineId , score)
      }
    }
  }
})
</script>

<style scoped>

</style>