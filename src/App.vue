<template>
  <div>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>{{ $t('tastingTitle') }}</q-toolbar-title>
          <q-btn flat round dense icon="language">
            <q-menu auto-close>
              <q-list>
                <q-item clickable>
                  <q-item-section v-on:click="changeLanguage('de')">DE</q-item-section></q-item>
                <q-item clickable>
                  <q-item-section v-on:click="changeLanguage('en')">EN</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="q-pa-sm">
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
  },

  methods: {
    changeLanguage(key: string) {
      this.$i18n.locale = key.toLowerCase()
    }
  }
});
</script>
