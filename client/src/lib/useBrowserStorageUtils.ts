import {useRoute} from "vue-router";
import {state} from "@/store/state";

export function useBrowserStorageUtils() {
    const readTastingDataFromBrowser = () => {
        const localData = window.localStorage.getItem('tasting-organizer')

        return localData ? JSON.parse(localData) : {};
    }

    return {
        loadTastingIdFromBrowser: () => {
            const route = useRoute()
            const id = route.params?.id ?? '';

            return Array.isArray(id) ? id[0] : id
        },
        readTastingDataFromBrowser,
        readUserIdFromBrowser: (tastingId: string) => {
            const localObject = readTastingDataFromBrowser()

            if (localObject[tastingId]) {
                return localObject[tastingId];
            }

            return '';
        },
        createLocalTastingData: () => {
            const localData = readTastingDataFromBrowser()
            localData[state.tasting.publicId] = state.scoreData.userId

            window.localStorage.setItem('tasting-organizer', JSON.stringify(localData))
        }
    }
}