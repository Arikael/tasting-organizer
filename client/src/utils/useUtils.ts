import {useRoute} from "vue-router";

export function useUtils() {

    return {
        loadTastingIdFromBrowser: () => {
            const route = useRoute()
            const id = route.params?.id ?? '';
            const tastingId = Array.isArray(id) ? id[0] : id

            return tastingId
        },
        readUserIdFromBrowser: (tastingId: string) => {
            const localData = window.localStorage.getItem('tasting-organizer')

            if (localData) {
                const localObject = JSON.parse(localData)

                if(localObject[tastingId]) {
                    return localObject[tastingId];
                }
            }

            return '';
        }
    }
}