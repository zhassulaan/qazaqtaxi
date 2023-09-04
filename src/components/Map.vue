<template>
    <div class="map" id="map">
        <div class="marker">
            <v-img
                src="@/assets/icons/flag.png"
                id="marker-icon"
                v-show="panelStore.mode === 'stand-by'"
            ></v-img>
        </div>
        <Loader />
    </div>
</template>

<script setup>
import { watch } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useDirectionsStore } from "@/store/directions";
import { useMapStore } from "@/store/map";
import { usePanelStore } from "@/store/userPanel";
import { load } from "@2gis/mapgl";
import { Directions } from "@2gis/mapgl-directions";
import Loader from "@/components/Loader.vue";

const directionStore = useDirectionsStore();
const mapStore = useMapStore();
const panelStore = usePanelStore();

const { drawDirection, clearDirection, positionMap } = storeToRefs(directionStore);

const { rerenderMap, centerMap } = storeToRefs(mapStore);

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
let isCity = true;
function getCity(coordinates){
    axios
        .get(
            "https://catalog.api.2gis.com/3.0/items/geocode?lat=" +
                coordinates[1] +
                "&lon=" +
                coordinates[0] +
                "&fields=items.adm_div,items.address&&radius=50&key=" +
                geo_code_key
        )
        .then((response) => {
            window.localStorage.setItem('city',response.data?.result.items[0].adm_div[1].name);
              
        });
}
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
            directionStore.timeEstimate = (
                response.data?.result[0].total_duration / 60
            ).toFixed(0);
            if (directionStore.timeEstimate === 0) {
                directionStore.timeEstimate = 1;
            }
            directionStore.distanceEstimate = (
                response.data?.result[0].total_distance / 1000
            ).toFixed(0);
        });
}

function coordinatesToName(coordinates) {
    axios
        .get(
            "https://catalog.api.2gis.com/3.0/items/geocode?lat=" +
                coordinates[1] +
                "&lon=" +
                coordinates[0] +
                "&fields=items.adm_div,items.address&&radius=50&key=" +
                geo_code_key
        )
        .then((response) => {
            for (const item of response.data?.result.items) {
                console.log(item);
                if (item.address_name != null) {
                    pointA.name = item.name;
                    pointA.coordinates = coordinates;
                    pointA.building_id = item.id;
                    break;
                }
            }
            mapStore.point = { ...pointA };
        });
}

load().then((mapglAPI) => {
    function currentGeo() {
        navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
    }
    let center_point;
    let zoom;
    watch(centerMap, () => {});
    zoom = 15;
    if (mapStore.centerMap) {
        center_point = mapStore.centerMapPoint.coordinates;
    } else {
        center_point = [76.9351982, 43.2516761];
    }

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
            directionStore.pointA.coordinates,
            directionStore.pointB.coordinates
        );
    });

    watch(clearDirection, () => {
        directionDelete();
    });

    watch(positionMap, () => {
        console.log('map position');
        map.setCenter(directionStore.pointA.coordinates);
        map.setZoom(18);
    });

    function directionCreate(pointA, pointB, zoom) {
        directions.carRoute({
            points: [pointA, pointB],
        });
        if (zoom) {
            map.setCenter(pointA);
            map.setZoom(13.5);
        }

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

    map.on("moveend", centerMarker);
    // let selectedIds = [];
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

    async function centerMarker() {
        if (
            !(
                Object.keys(mapStore.pointA).length &&
                Object.keys(mapStore.pointB).length
            )
        ) {
            await delay(250);
            let first_center = map.getCenter();
            await delay(650);
            let second_center = map.getCenter();
            console.log(first_center, second_center);
            if (
                first_center[0] === second_center[0] &&
                first_center[1] === second_center[1]
            ) {
                console.log("ok");
                coordinatesToName(first_center);
                if(isCity){
                    getCity(first_center);
                    isCity = false;
                }
            }
        }
    }
    currentGeo();

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
    //function for direction
    //pointA -> driver || source point

    function orderNavigationDirection(pointA, pointB) {
        directionDelete();
        directionCreate(pointA, pointB, 15);
        if (marker) {
            marker.destroy();
        }
        marker = new mapglAPI.Marker(map, {
            coordinates: pointA,
            icon: "https://docs.2gis.com/img/mapgl/marker.svg",
        });

        getDistance(pointA, pointB);
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
    top: 44%;
    left: 43%;
    width: 14vw;
    height: 6vh;
    z-index: 1000;
}
</style>
