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
                  <q-item-section v-on:click="changeLanguage('en-US')">EN</q-item-section>
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
import {defineComponent, getCurrentInstance, ref, watch} from 'vue';
import Results from './components/Results.vue'
import {useQuasar} from "quasar";

export default defineComponent({
  name: 'LayoutDefault',

  components: {
    Results
  },

  setup () {
    const $q = useQuasar()
    const lang = ref($q.lang.isoName)
    const i18n = getCurrentInstance().appContext.config.globalProperties.$i18n

    watch(lang, val => {
      i18n.locale = val.toLowerCase().split('-')[0]
      console.log('test')
      // dynamic import, so loading on demand only
      import(
          /* webpackInclude: /(de|en-US)\.js$/ */
      'quasar/lang/' + val
          ).then(lang => {
        $q.lang.set(lang.default)
      })
    })

    return {
      lang
    }
  },
  mounted() {
    this.lang = navigator.language
  },
  methods: {
    changeLanguage(key: string) {
      this.lang = key
    }
  }
});
</script>
