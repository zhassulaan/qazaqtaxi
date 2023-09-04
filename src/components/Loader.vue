<template>
    <div v-show="mapStore.showLoader" class="loader">
        <div class="radius-animation">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
</template>

<script setup>
import { useMapStore } from "@/store/map";

const mapStore = useMapStore();
</script>

<style lang="scss" scoped>
@mixin animation-mixin($name, $step-var, $size-var) {
  @keyframes #{$name} {
    0% {
        width: 0px;
        height: 0px;
    } #{$step-var} {
        width: $size-var + 20;
        height: $size-var + 20;
    } #{$step-var + 50} {
        width: $size-var;
        height: $size-var;
    } 100% {
        width: $size-var;
        height: $size-var;
    }
  }
}

@include animation-mixin(appear-1, 10%, 33px);
@include animation-mixin(appear-2, 20%, 66px);
@include animation-mixin(appear-3, 30%, 100px);
@include animation-mixin(appear-4, 40%, 140px);
@include animation-mixin(appear-5, 50%, 170px);

.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.5);
    z-index: 500;
}

.radius-animation {
    position: relative;
}

.radius-animation div:nth-child(1) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 23px;
    height: 23px;
    background-color: rgba(var(--v-theme-brand), 0.4);
    border-radius: 1000px;
    transform: translate(-50%, -50%);
    animation: appear-1 1.5s linear infinite;
}

.radius-animation div:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 66px;
    height: 66px;
    background-color: rgba(var(--v-theme-brand), 0.35);
    border-radius: 1000px;
    transform: translate(-50%, -50%);
    animation: appear-2 1.5s linear infinite;
}

.radius-animation div:nth-child(3) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    background-color: rgba(var(--v-theme-brand), 0.3);
    border-radius: 1000px;
    transform: translate(-50%, -50%);
    animation: appear-3 1.5s linear infinite;
}

.radius-animation div:nth-child(4) {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    background-color: rgba(var(--v-theme-brand), 0.25);
    border-radius: 1000px;
    transform: translate(-50%, -50%);
    animation: appear-4 1.5s linear infinite;
}

.radius-animation div:nth-child(5) {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 170px;
    height: 170px;
    background-color: rgba(var(--v-theme-brand), 0.2);
    border-radius: 1000px;
    transform: translate(-50%, -50%);
    animation: appear-5 1.5s linear infinite;
}

// @keyframes appear {
//     0% {
//         width: 0px;
//         height: 0px;
//     } 100% {
//         width: 100px;
//         height: 100px;
//     }
// }
</style>
