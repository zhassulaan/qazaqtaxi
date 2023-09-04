<template>
    <v-container class="search-results">
        <v-row>
            <v-text-field
                class="bg-white search-panel mt-5"
                variant="outlined"
                hide-details
                prepend-inner-icon="mdi-map-marker"
                v-model="searchWord"
                id="searchInput"
                @blur="handleCloseSearch()"
            ></v-text-field>
        </v-row>
        <v-row>
            <v-btn
                variant="text"
                prepend-icon="mdi-flag-triangle text-black"
                class="text-brand pb-0 font-weight-bold"
                @click="handleCloseSearch()"
            >
                {{ $t("choose_location") }}
            </v-btn>
        </v-row>
        <v-row>
            <v-col>
                <div class="results-container">
                    <div
                        v-for="item in (searchResults.length > 0 ? searchResults : history)"
                        :key="item.id"
                        @click="saveToHistory(item); GET_GEO(`Алматы, ${item.address_name}`);"
                        class="mb-3 result-item"
                    >
                        <div class="font-weight-medium">{{ item.name }}</div>
                        <div>{{ item.address_name }}</div>
                    </div>
                    <!-- <div
                        class="text-center"
                        v-show="searchWord !== '' && searchResults.length === 0"
                    >
                        {{ $t("not_found") }}
                    </div> -->
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import mapGis from "@/repositories/mapGis";
import router from "@/router";
import { useDirectionsStore } from "@/store/directions";
import { useMapStore } from "@/store/map";
import { useSearchStore } from "@/store/search";
import { debounce } from "@/helpers/debounce";

const directionStore = useDirectionsStore();
const searchStore = useSearchStore();
const mapStore = useMapStore();
const { searchWord } = storeToRefs(searchStore);
const { pointA, pointB, pointAName, pointBName } = storeToRefs(mapStore);
const searchResults = ref([]);
const history = ref(JSON.parse(localStorage.getItem("qt_search_history")) || []);

watch(searchWord, () => {
    if (searchStore.focusInput === "A") {
        pointAName.value = searchWord.value;
    } else if (searchStore.focusInput === "B") {
        pointBName.value = searchWord.value;
    }
    searchDebouncer();
});

onMounted(() => {
    searchStore.showPanel = true;
    searchStore.searchWord = "";
    document.querySelector("#searchInput").focus();
});

const searchDebouncer = debounce(() => {
    GET_SUGGESTIONS();
}, 600);

async function GET_SUGGESTIONS() {
    let myLocation = `${mapStore.point.coordinates[0]},${mapStore.point.coordinates[1]}`;
    try {
        const res = await mapGis.getSuggests(searchWord.value, myLocation);
        searchResults.value = res.data.result.items;
    } catch (error) {
        searchResults.value = [];
        console.log(error);
    }
}

function handleCloseSearch() {
    setTimeout(() => {
        searchStore.showPanel = false;
        searchStore.readPointer = true;
        if (searchStore.focusInput === "A") {
            document.getElementById("firstInput").focus();
            pointA.value = {};
        } else {
            document.getElementById("secondInput").focus();
            pointB.value = {};
        }
        router.push({ name: "Map" });
        mapStore.debouncedRerender();
    }, 100);
}

async function GET_GEO(address) {
    address = window.localStorage.getItem('city') + " , " + address;
    try {
        const res = await mapGis.getGeocode(address);
        const point = {
            building_id: res.data.result.items[0].id,
            coordinates: [
                res.data.result.items[0].point.lon,
                res.data.result.items[0].point.lat,
            ],
            name: res.data.result.items[0].name,
        };

        if (searchStore.focusInput === "A") {
            pointA.value = { ...point };
            directionStore.pointA = { ...point };
        } else if (searchStore.focusInput === "B") {
            pointB.value = { ...point };
            directionStore.pointB = { ...point };
        }

        router.push({ name: "Map" });
        mapStore.triggerCenterMap(point);
        if (
            Object.keys(pointA.value).length !== 0 &&
            Object.keys(pointB.value).length !== 0
        ) {
            directionStore.debouncedDrawDirection();
        }
    } catch (error) {
        console.log(error);
    }
}

function saveToHistory(address) {
    let addresses = JSON.parse(localStorage.getItem("qt_search_history"));
    if (!addresses) {
        addresses = [];
    } else if (addresses?.length === 5) {
        addresses.pop();
    }
    addresses = addresses.filter((item) => item.id !== address.id);
    localStorage.setItem("qt_search_history", JSON.stringify([address, ...addresses]));
}
</script>

<style lang="scss" scoped>
.results-container {
    height: 50vh;
    overflow: scroll;
}

.search-results {
    padding-inline: 60px;
    background-color: #e5e5e5;
}

.result-item:hover {
    background-color: rgba(var(--v-theme-brand), 0.5);
}
</style>
