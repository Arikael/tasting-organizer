<template>
  <div class="content-box content-box--padding tasting-header">
    <h2 class="text-subtitle1 content-box__title">{{ state.tasting.title }}</h2>
    <span class="text-caption"><q-icon name="today" class="q-mr-xs"></q-icon>{{ tastingDate }}</span>
    <div class="text-caption q-pt-md" v-if="hasIntro">
      {{ state.tasting.intro }}
    </div>
    <scoring-scale-description></scoring-scale-description>
  </div>
  <div class="content-box content-box--padding" v-if="state.ui.currentStep.type === 'intro'">
    <q-input class="q-my-sm" color="accent" :model-value="state.scoreData.userName" @change="setUser"
             :label="$t('yourUsername')"></q-input>
  </div>
</template>

<script lang="ts">
import {store} from "@/store";
import {QIcon, QInput} from "quasar";
import {computed} from "vue";
import ScoringScaleDescription from "@/modules/scoring/ScoringScaleDescription.vue";

export default {
  name: "ScoringIntro",
  components: {ScoringScaleDescription, QInput, QIcon},
  setup() {
    return {
      state: store.state,
      setUser: store.setters.setUser,
      hasIntro: computed(() => store.state.tasting.intro.length > 0),
      tastingDate: computed(() => store.state.tasting.date.toDateString())
    }
  }
}
</script>