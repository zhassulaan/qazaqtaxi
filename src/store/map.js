import { ref, watch } from "vue";
import { defineStore } from "pinia";
import { debounce } from "@/helpers/debounce";

export const useMapStore = defineStore("map", () => {
    const point = ref({});
    const pointA = ref({});
    const pointB = ref({});
    const pointAName = ref("");
    const pointBName = ref("");
    const rerenderMap = ref(false);
    const showLoader = ref(false);
    const centerMap = ref(false);
    const centerMapPoint = ref(null);

    function triggerCenterMap(point) {
        centerMapPoint.value = point;
        console.log(centerMapPoint.value);
        centerMap.value = !centerMap.value;
    }

    function triggerRerender() {
        rerenderMap.value = !rerenderMap.value;
    }

    const debouncedCenterMap = debounce(triggerCenterMap, 200);
    const debouncedRerender = debounce(triggerRerender, 200);

    watch(
        pointA,
        () => {
            pointAName.value = pointA.value.name;
        }, {
            immediate: true,
        }
    );

    watch(
        pointB,
        () => {
            pointBName.value = pointB.value.name;
        }, {
            immediate: true,
        }
    );

    return {
        point,
        pointA,
        pointB,
        pointAName,
        pointBName,
        rerenderMap,
        triggerRerender,
        showLoader,
        triggerCenterMap,
        centerMapPoint,
        centerMap,
        debouncedCenterMap,
        debouncedRerender,
    };
});
