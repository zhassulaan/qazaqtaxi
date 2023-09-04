<template>
    <v-dialog persistent class="dialog" z-index="99999">
        <div class="d-flex flex-column justify-center align-center block">
            <v-btn class="bg-white text-black"
                icon="mdi-arrow-left text-black"
                size="x-large"
                @click="emit('closeMe')"
            ></v-btn>
            <div class="text-white font-weight-bold">{{ prop.title }}</div>
        </div>
    </v-dialog>
</template>

<script setup>
const prop = defineProps(["title"]);
const emit = defineEmits(["closeMe"]);
</script>
