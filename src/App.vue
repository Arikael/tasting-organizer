<template>
  <div  >
    <q-layout view="lHh Lpr lFf">
      <q-header elevated class="q-pa-sm">
        <q-toolbar-title>{{ $t('tastingTitle') }}</q-toolbar-title>
      </q-header>
      <q-page-container>
        <q-page padding>
          <Results/>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
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
