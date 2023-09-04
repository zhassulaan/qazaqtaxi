<template>
    <v-dialog>
        <div class="d-flex flex-column justify-center align-center block">
            <v-btn class="bg-brand"
                icon="mdi-heart text-white"
                size="x-large"
                @click="emit('closeMe')"
            ></v-btn>
            <div class="text-white font-weight-bold">{{ $t("thanks_ride") }}</div>
        </div>
    </v-dialog>
</template>

<script setup>
const emit = defineEmits(["closeMe"]);
</script>
