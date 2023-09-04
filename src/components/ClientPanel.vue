<template>
    <v-sheet class="rounded-t-xl overflow-hidden client-panel">
        <v-container>
            <v-row>
                <v-col class="d-flex justify-center pb-0 pt-2 mb-2">
                    <slot name="toggler"></slot>
                </v-col>
            </v-row>
            <slot name="content"></slot>
        </v-container>
    </v-sheet>
</template>

<style lang="scss" scoped>
.client-panel {
    z-index: 99999;
}

.price-item {
    width: 110px;
    height: 100px;
    line-height: 1em;
}
</style>
