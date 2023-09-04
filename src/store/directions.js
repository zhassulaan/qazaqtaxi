import { ref } from "vue";
import { defineStore } from "pinia";
import User from "@/repositories/user";
import { useOrderStore } from "@/store/order";
import { debounce } from "@/helpers/debounce";

export const useDirectionsStore = defineStore(
    "directions",
    () => {
        const orderStore = useOrderStore();
        const pointA = ref({});
        const pointB = ref({});
        const drawDirection = ref(false);
        const clearDirection = ref(false);
        const timeEstimate = ref(1);
        const distanceEstimate = ref(1);
        const drawInterval = ref(null);
        const zoom = ref(false);
        const positionMap = ref(false);

        async function GET_DRIVER_POSITION() {
            try {
                const res = await User.getBookingDetails(orderStore.bookingId);
                pointA.value.coordinates = [
                    Number(res.data.data.driver.current_longitude),
                    Number(res.data.data.driver.current_latitude),
                ];
            } catch (error) {
                console.log(error);
            }
        }

        function successGeo(pos) {
            pointA.value.coordinates[0] = pos.coords.longitude;
            pointA.value.coordinates[1] = pos.coords.latitude;
            console.log("GEO", pos);
            console.log("pointA", pointA);
        }

        function errorGeo() {
            console.log("errorGeo");
        }

        function updatePoints(mode) {
            if (mode === "driver-position") {
                GET_DRIVER_POSITION();
                pointB.value.coordinates = orderStore.pointA.coordinates;
            } else if (mode === "my-position") {
                navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
                pointB.value.coordinates = orderStore.pointB.coordinates;
            } else {
                pointA.value.coordinates = orderStore.pointA.coordinates;
                pointB.value.coordinates = orderStore.pointB.coordinates;
            }
        }

        function startDrawInterval(mode) {
            drawInterval.value = setInterval(() => {
                updatePoints(mode);
                debouncedDrawDirection();
            }, 5000);
        }

        function stopDrawInterval() {
            clearInterval(drawInterval.value);
        }

        function triggerDrawDirection() {
            drawDirection.value = !drawDirection.value;
        }

        function triggerClearDirection() {
            clearDirection.value = !clearDirection.value;
        }

        function triggerPositionMap() {
            console.log('triggerPositionMap');
            positionMap.value = !positionMap.value;
        }

        const debouncedDrawDirection = debounce(triggerDrawDirection, 200);
        const debouncedClearDirection = debounce(triggerClearDirection, 200);

        return {
            pointA,
            pointB,
            drawDirection,
            clearDirection,
            timeEstimate,
            distanceEstimate,
            debouncedDrawDirection,
            debouncedClearDirection,
            startDrawInterval,
            stopDrawInterval,
            zoom,
            updatePoints,
            triggerPositionMap,
            positionMap,
        };
    }, {
        persist: true,
    }
);
