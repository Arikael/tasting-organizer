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
                  <q-item-section v-on:click="changeLanguage('de')">DE</q-item-section>
                </q-item>
                <q-item clickable>
                  <q-item-section v-on:click="changeLanguage('en-US')">EN</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <q-page class="bg-blue-grey-1">
          <error v-if="hasError"></error>
          <router-view v-else></router-view>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, watch} from 'vue';
import {
  QBtn,
  QHeader,
  QItem, QItemSection,
  QLayout,
  QList,
  QMenu,
  QPage,
  QPageContainer,
  QToolbar,
  QToolbarTitle,
  useQuasar
} from "quasar";
import {store} from "@/store";
import Error from "@/modules/error/Error.vue";

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    Error,
    QLayout,
    QHeader,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QMenu,
    QItem,
    QList,
    QPageContainer,
    QPage,
    QItemSection
  },
  setup() {
    const $q = useQuasar()
    const i18n = getCurrentInstance()?.appContext?.config?.globalProperties?.$i18n

    onMounted(() => {
      store.setters.setLanguage(navigator.language)
    })

    watch(() => store.state.language, (val, oldVal) => {
      i18n.locale = val.split('-')[0]

      // dynamic import, so loading on demand only
      import(
          /* webpackInclude: /(de|en-US)\.js$/ */
      'quasar/lang/' + val
          ).then(lang => {
        $q.lang.set(lang.default)
      })
    })

    return {
      hasError: store.getters.hasError,
      changeLanguage(key: string) {
        store.setters.setLanguage(key)
      }
    }
  }
});
</script>
