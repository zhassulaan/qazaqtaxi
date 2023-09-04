<template>
    <div class="map" id="map">
        <Loader />
    </div>
</template>

<script setup>
import { watch } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useMapStore } from "@/store/map";
import { load } from "@2gis/mapgl";
import { Directions } from "@2gis/mapgl-directions";
import Loader from "@/components/Loader.vue";

const mapStore = useMapStore();
const { drawDirection, rerenderMap, clearDirection, centerMap } = storeToRefs(mapStore);
const prop = defineProps(["test"]);

const map_key = "896f3963-4c91-4ce7-9a61-6f91f3ff7ebd";
const geo_code_key = "rukuvo0173";
const directions_key = "896f3963-4c91-4ce7-9a61-6f91f3ff7ebd";

const myGeoIcon = `
    <div class="buttonRoot" id="find-me">
        <button class="button">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 32 32"
            >
                <path
                    fill="black"
                    d="M17.89 26.27l-2.7-9.46-9.46-2.7 18.92-6.76zm-5.62-12.38l4.54 1.3 1.3 4.54 3.24-9.08z"
                />
            </svg>
        </button>
    </div>
    <style>
    svg{
        background-color: white;
        border-radius: 5px
    }
    </style>
`;
let circle;

let pointA = {
    name: "",
    coordinates: [0, 0],
    building_id: "",
};

function getDistance(pointA, pointB) {
    axios
        .post(
            "https://routing.api.2gis.com/carrouting/6.0.0/global?key=" +
                directions_key,
            {
                type: "jam",
                points: [
                    {
                        type: "walking",
                        x: pointA[0],
                        y: pointA[1],
                    },
                    {
                        type: "walking",
                        x: pointB[0],
                        y: pointB[1],
                    },
                ],
            }
        )
        .then((response) => {
            console.log("ok");
            console.log(response.data?.result[0].total_duration);
            console.log(response.data?.result[0].total_distance);
        });
}

load().then((mapglAPI) => {
    let center_point = [76.9351982, 43.2516761];
    let zoom = 12;

    const map = new mapglAPI.Map("map", {
        center: center_point,
        zoom: zoom,
        key: map_key,
        zoomControl: false,
    });

    const directions = new Directions(map, {
        directionsApiKey: directions_key,
    });

    // directionCreate([76.9352121, 43.251678000000005], [76.91161023194536, 43.24073084114854])

    watch(drawDirection, () => {
        directionCreate(
            mapStore.pointA.coordinates,
            mapStore.pointB.coordinates
        );
    });
    watch(clearDirection, () => {
        directionDelete();
    });

    function directionCreate(pointA, pointB) {
        directions.carRoute({
            points: [pointA, pointB],
        });
        map.setCenter(pointB);
        map.setZoom(13.5);
        getDistance(pointA, pointB);
    }

    function directionDelete() {
        directions.clear();
    }

    watch(rerenderMap, () => {
        rerenderMapFunc();
    });

    async function rerenderMapFunc() {
        await delay(50);
        map.invalidateSize();
    }

    const control = new mapglAPI.Control(map, myGeoIcon, {
        position: "centerRight",
    });
    control
        .getContainer()
        .querySelector("#find-me")
        .addEventListener("click", currentGeoButton);

    function currentGeoButton() {
        navigator.geolocation.getCurrentPosition(successGeoButton, errorGeo);
    }
    function delay(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function currentGeo() {
        navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
    }
    function successGeo(pos) {
        let center = [pos.coords.longitude, pos.coords.latitude];
        if (circle) {
            circle.destroy();
        }

        circle = new mapglAPI.CircleMarker(map, {
            coordinates: center,
            radius: 14,
            color: "#0088ff",
            strokeWidth: 4,
            strokeColor: "#ffffff",
            stroke2Width: 6,
            stroke2Color: "#0088ff55",
        });

        if (!mapStore.centerMap && !mapStore.drawDirection) {
            console.log("sex");
            map.setCenter(center);
            map.setZoom(16);
        }
    }
    function successGeoButton(pos) {
        let center = [pos.coords.longitude, pos.coords.latitude];
        if (circle) {
            circle.destroy();
        }

        circle = new mapglAPI.CircleMarker(map, {
            coordinates: center,
            radius: 14,
            color: "#0088ff",
            strokeWidth: 4,
            strokeColor: "#ffffff",
            stroke2Width: 6,
            stroke2Color: "#0088ff55",
        });
        map.setCenter(center);
        map.setZoom(16);
    }
    function errorGeo() {
        console.log("error");
    }
    currentGeo();
    //function for direction
    //pointA -> driver || source point
    function orderNavigationDirection(pointA, pointB) {
        setInterval(() => {
            directionDelete();
            directionCreate(pointA, pointB);
            if (marker) {
                marker.destroy();
            }
            marker = new mapglAPI.Marker(map, {
                coordinates: pointA,
                icon: "https://docs.2gis.com/img/mapgl/marker.svg",
            });

            getDistance(pointA, pointB);
        }, 6000);
    }
});
</script>

<style lang="scss" scoped>
.map {
    position: relative;
    width: 100vw;
    // height: 100vw;
    background: #aaa;
}

.marker {
    position: absolute;
    top: 42%;
    left: 42.5%;
    width: 15vw;
    height: 8vh;
    z-index: 1000;
}
</style>
