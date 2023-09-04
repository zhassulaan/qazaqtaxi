import { ref } from "vue";
import { defineStore } from "pinia";

export const useSearchStore = defineStore(
    "search",
    () => {
        const showPanel = ref(false);
        const timeoutRef = ref(null);
        const searchWord = ref("");
        const focusInput = ref("");
        const readPointer = ref(false);

        return { showPanel, timeoutRef, searchWord, focusInput, readPointer };
    }, {
        persist: true,
    }
);
