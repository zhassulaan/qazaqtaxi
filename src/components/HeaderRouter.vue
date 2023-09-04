<template>
    <div class="anchor text-center block">
        <v-btn
            class="nav-btn"
            icon="mdi-arrow-left text-brand"
            variant="text"
            @click="emit('clicked')"
        ></v-btn>
        <span class="font-weight-bold"> {{ props.title }} </span>
    </div>
</template>

<script setup>
const props = defineProps(["title"]);
const emit = defineEmits(["clicked"]);
</script>

<style lang="scss" scoped>
.anchor {
    position: relative;
}

.nav-btn {
    position: absolute;
    top: 50%;
    left: 30px;
    transform: translateY(-50%);
}
</style>
