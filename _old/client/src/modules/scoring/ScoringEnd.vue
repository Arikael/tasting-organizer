<template>
  <div class="content-box content-box--padding">
    <h2 class="text-subtitle1 q-mt-none">{{ endTitle }}</h2>
    <p v-if="store.state.tasting.outro">
      {{ store.state.tasting.outro }}
    </p>
    <p>
      <router-link :to="linkToResults">{{ $t('gotoResults') }}</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {store} from "@/store";
import {useI18n} from "vue-i18n";

export default defineComponent({
  name: 'ScoringEnd',
  setup() {
    const i18n = useI18n({useScope: 'global'})

    return {
      endTitle: i18n.t(store.state.ui.scoringIsFinishedOnLoading ? 'scoreAlreadySubmitted' : 'scoringThanks'),
      store: store,
      linkToResults: '/results/' + store.state.tasting.publicId
    }
  }
})
</script>

<style scoped>

</style>