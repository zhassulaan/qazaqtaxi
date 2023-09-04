<template>
    <v-row>
        <v-col class="d-flex flex-row justify-space-between align-center py-0">
            <div>{{ $t("duration") }} ~7{{ $t("min") }}</div>
            <div>
                <v-btn size="small" icon="mdi-phone" class="mr-3"></v-btn>
                <v-btn size="small" icon="mdi-message" class="mr-3"></v-btn>
                <v-btn size="small" icon="mdi-alert"></v-btn>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <ClientCard
                :data="{
                    firstName: 'Имя',
                    lastName: 'Фамилия',
                    phone: '+7 707 777 7777',
                    stat: 5,
                }"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col class="pt-0">
            <WayCard
                :data="{
                    title: $t('departure'),
                    target: 'улица Мауленова, 92',
                }"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="3">
            <v-btn class="rounded-lg bg-blackish font-weight-bold"
                block
                height="60"
                icon="mdi-close-thick text-white"
                @click="handleCancelClick()"
            ></v-btn>
        </v-col>
        <v-col>
            <v-btn class="rounded-lg bg-brand font-weight-bold text-white"
                block
                height="60"
                :disabled="mode === 'driver-ready'"
                @click="handleMainClick()"
            >
                <span class="text-white" v-show="mode === 'driver-to-client'">
                    {{ $t("arrived") }}
                </span>
                <span class="text-white" v-show="mode === 'driver-to-goal'">
                    {{ $t("complete_order") }}
                </span>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup>
// import { ref } from "vue";
import { storeToRefs } from "pinia";
import { usePanelStore } from "@/store/userPanel";
import ClientCard from "@/components/ClientCard.vue";
import WayCard from "@/components/WayCard.vue";

const panelStore = usePanelStore();
const { mode } = storeToRefs(panelStore);

// const orderStatus = ref("waiting");

function handleCancelClick() {
    if (mode.value === "driver-ready") {
        // TODO уход с линии сервер
        mode.value = "driver-stand-by";
    }
}

// function handleReadyClick() {
//     // TODO выход на линию сервер
//     mode.value = "driver-ready";
// }

function handleMainClick() {}
</script>
