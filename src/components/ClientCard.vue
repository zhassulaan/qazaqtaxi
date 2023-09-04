<template>
    <div class="drop-big-shadow pa-2 rounded-lg" style="line-height: 1.1em">
        <div class="font-weight-bold mb-2">{{ $t("passenger_info") }}</div>
        <div class="d-flex flex-row justify-space-between font-15">
            <div class="d-flex flex-row justify-start align-center">
                <v-avatar color="graydarker" class="mr-2"></v-avatar>
                <div class="font-weight-medium">
                    <div>{{ props.data.firstName }}</div>
                    <div>{{ props.data.lastName }}</div>
                </div>
            </div>
            <div>
                <div>{{ props.data.phone }}</div>
                <div class="nowrap">
                    <v-icon
                        v-for="n in props.data.stat"
                        :key="n"
                        icon="mdi-star"
                        size="small"
                    ></v-icon>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["data"]);
</script>
