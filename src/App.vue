<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page padding>
        <Results/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import Results from './components/Results.vue'

export default defineComponent({
  name: 'LayoutDefault',

  components: {
    Results
  }
});
</script>
