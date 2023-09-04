<template>
    <div>
        <router-view class="map"></router-view>
        <ClientPanel class="bottom-panel"
            :style="{ height: `${panelHeight}px` }"
        >
            <template v-slot:toggler>
                <v-sheet class="bg-graydark rounded-lg toggler"
                    width="50"
                    height="5"
                    @mousedown="onMouseDown"
                ></v-sheet>
            </template>
            <template v-slot:content>
                <component :is="interfaces[currentInterface]" />
            </template>
        </ClientPanel>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { storeToRefs } from "pinia";
import { useMapStore } from "@/store/map";
import { usePanelStore } from "@/store/userPanel";
import ClientPanel from "@/components/ClientPanel.vue";
import ChatInterface from "@/components/interfaces/ChatInterface.vue";
import CheckInterface from "@/components/interfaces/CheckInterface.vue";
import DriverInterface from "@/components/interfaces/DriverInterface.vue";
import OrderInterface from "@/components/interfaces/OrderInterface.vue";

const mapStore = useMapStore();
const panelStore = usePanelStore();
const { mode } = storeToRefs(panelStore);
const interfaces = {
    DriverInterface,
    ChatInterface,
    CheckInterface,
    OrderInterface,
};
let initialHeight;
let startY = 0;
const currentInterface = ref("");
const togglePanel = ref(false);
const panelHeight = ref(initialHeight);


function onMouseDown(event) {
    togglePanel.value = true;
    startY = event.clientY;
}
function onMouseMove(event) {
    if (togglePanel.value) {
        const deltaY = event.clientY - startY;
        const scrolledHeight = panelHeight.value - deltaY;
        const modeBool = (mode.value === "order-in-progress");
        if (
            (scrolledHeight >= initialHeight * .9) && (
                modeBool && (scrolledHeight <= window.innerHeight) ||
                !modeBool && (scrolledHeight <= initialHeight * 1.1)
            )
        ) {
            panelHeight.value -= deltaY;
        }
        startY = event.clientY;
    }
}
function onMouseUp() {
    togglePanel.value = false;
    if ((mode.value === "order-in-progress") && (panelHeight.value > window.innerHeight * .5)) {
        panelHeight.value = window.innerHeight * .95;
    } else {
        panelHeight.value = initialHeight;
    }
}

onMounted(() => {
    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("pointerup", onMouseUp);
});

onBeforeUnmount(() => {
    window.removeEventListener("pointermove", onMouseMove);
    window.removeEventListener("pointerup", onMouseUp);
});

watch(togglePanel, () => {
    mapStore.debouncedRerender();
});

watch(
    mode,
    () => {
        switch (mode.value) {
            case "stand-by":
                initialHeight = 270;
                currentInterface.value = "OrderInterface";
                mapStore.debouncedRerender();
                break;
            case "pick-car":
                initialHeight = 365;
                currentInterface.value = "OrderInterface";
                mapStore.debouncedRerender();
                break;
            case "pre-order":
                initialHeight = 260;
                currentInterface.value = "OrderInterface";
                mapStore.debouncedRerender();
                break;
            case "order-in-progress":
                initialHeight = 250;
                currentInterface.value = "DriverInterface";
                mapStore.debouncedRerender();
                break;
            case "chat":
                initialHeight = 550;
                currentInterface.value = "ChatInterface";
                mapStore.debouncedRerender();
                break;
            case "check":
                initialHeight = 550;
                currentInterface.value = "CheckInterface";
                mapStore.debouncedRerender();
                break;
            default:
                mode.value = "stand-by";
                initialHeight = 260;
                currentInterface.value = "OrderInterface";
                mapStore.debouncedRerender();
                break;
        }
        panelHeight.value = initialHeight;
    }, {
        immediate: true,
    }
);
</script>

<style lang="scss" scoped>
.top-panel {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}

.map {
    width: 100vw;
    height: 100vh;
}

.bottom-panel {
    position: fixed;
    bottom: 0;
    width: 100%;
    transition: .3s;
    z-index: 10000;
}

.bottom-panel--down {
    bottom: -255px;
}

.bottom-panel--up {
    bottom: 0;
}

.toggler {
    cursor: pointer;
}
</style>
