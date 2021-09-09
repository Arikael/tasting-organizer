<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>{{ $t('tastingTitle') }}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="q-pa-md">
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
