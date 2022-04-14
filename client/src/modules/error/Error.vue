<template>
  <div class="q-pt-lg">
    <div v-if="hasError" class="message-box text-center error-box">
      <q-icon size="lg" name="report_problem" color="warning"></q-icon>
      <br/>
      {{ $t(applicationError?.messageKey) }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {store} from "@/store";

export default defineComponent({
  name: "error",
  setup() {
    return {
      hasError: store.getters.hasError,
      applicationError: store.state.ui.applicationError
    }
  }
})
</script>

<style scoped lang="scss">
.text-center {
  text-align: center;
}
.error-box {
  margin: 0 auto;
  width: 75%;
}
</style>