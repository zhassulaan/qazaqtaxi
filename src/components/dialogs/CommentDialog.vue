<template>
    <v-dialog class="dialog" z-index="99999">
        <v-sheet class="bg-white rounded-xl px-8 pt-5 pb-8">
            <div class="block text-center font-weight-bold">{{ props.title }}</div>
            <v-radio-group v-if="props.type && props.type === 'cancel'">
                <v-radio class="radio"></v-radio>
            </v-radio-group>
            <v-text-field class="yellow-border"
                hide-details
                variant="underlined"
                color="brand"
                append-inner-icon="mdi-arrow-right text-brand"
                v-model="commentText"
                @click:append-inner="emit('submit', commentText, selectedReason)"
            ></v-text-field>
        </v-sheet>
    </v-dialog>
</template>

<script setup>
import { ref } from "vue";
// import { useI18n } from "vue-i18n";

// const i18n = useI18n();
const selectedReason = ref(0);
const commentText = ref("");
const emit = defineEmits(["submit"]);
const props = defineProps(["title", "type"]);

// function onCheckboxClick(index) {
//   if (selectedReason.value === index) {
//     selectedReason.value = 0;
//   } else {
//     selectedReason.value = index;
//   }
// }
</script>

<style lang="scss" scoped>
.radio {
    height: 48px;
}
</style>
