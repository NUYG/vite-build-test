<template>
    <FpDefLayout>
        <template #comp>

            <MultiTab :tab-header="tabHeaders">
                <template #comp0>
                    <AdmCusMgmt/>
                </template>

                <template #comp1>
                    <AdmProInq/>
                </template>
            </MultiTab>

        </template>
    </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmCusMgmt from "@/views/AdminView/AdmCusView/AdmCusMgmt.vue";
import AdmProInq from "@/views/AdminView/AdmCusView/AdmProInq.vue";

export default {
    components: {
        FpDefLayout,
        AdmCusMgmt,
        AdmProInq,
        MultiTab,
    },
    data() {
        return {
            tabHeaders: [
                'Khách hàng', 'Yêu cầu căn'
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
