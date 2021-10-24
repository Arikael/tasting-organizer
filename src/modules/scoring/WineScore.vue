<template>
  <div>
    <q-input outlined v-model="score" :label="label" :dense="true"></q-input>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "WineScore",
  props: {
    modelValue: Number,
    label: String
  },
  emits: ['update:modelValue'],
  computed: {
    score: {
      get() {
        return this.modelValue
      },
      set(val: string) {
        const score = parseInt(val)
        this.$emit('update:modelValue', score)
      }
    }
  }
})
</script>

<style scoped>

</style>