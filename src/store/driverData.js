import { ref } from "vue";
import { defineStore } from "pinia";

export const useDriverDataStore = defineStore(
    "driverData",
    () => {
        const info = ref({});
        const point = ref({});

        function updatePoint() {
            navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
        }

        function successGeo(pos) {
            point.value.longitude = pos.coords.longitude;
            point.value.latitude = pos.coords.latitude;
        }

        function errorGeo() {
            console.log("errorGeo");
        }

        return {
            info,
            point,
            updatePoint,
        };
    }, {
        persist: true,
    }
);
