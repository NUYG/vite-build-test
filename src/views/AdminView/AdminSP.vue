<template>
    <FpDefLayout>
        <template #comp>

            <MultiTab :tab-header="tabHeaders">
                <template #comp0>
                    <AdmSPDetail/>
                </template>

                <template #comp1>
                    <AdmSPStats/>
                </template>
            </MultiTab>

        </template>
    </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmSPStats from "@/views/AdminView/AdmSPView/AdmSPStats.vue";
import AdmSPDetail from "@/views/AdminView/AdmSPView/AdmSPDetail.vue";

export default {
    components: {
        FpDefLayout,
        AdmSPStats,
        AdmSPDetail,
        MultiTab,
    },
    data() {
        return {
            tabHeaders: [
                'Chi tiết', 'Thống kê'
            ]
        }
    },
    computed: {},
    methods: {},
    watch: {},
    mounted() {
    }
}
</script>

<style scoped>
</style>
