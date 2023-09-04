<template>
    <div class="pa-2 rounded-lg drop-big-shadow">
        <div class="font-weight-bold">{{ props.data.title }}</div>
        <div class="font-weight-medium">
            <v-icon icon="mdi-circle-outline text-red" size="small"></v-icon>
            {{ props.data.target }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["data"]);
</script>
