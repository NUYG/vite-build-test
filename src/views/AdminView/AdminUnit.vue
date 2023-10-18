<template>
    <FpDefLayout>
        <template #comp>

            <MultiTab :tab-header="tabHeaders">
                <template #comp0>
                    <AdmCartMgmt/>
                </template>

                <template #comp1>
                    <AdmUHistory/>
                </template>
            </MultiTab>

        </template>
    </FpDefLayout>
</template>

<script>
import FpDefLayout from "@/views/FpDefLayout.vue";
import MultiTab from "@/components/FpLayout/MultiTab.vue";
import AdmCartMgmt from "@/views/AdminView/AdmUnitView/AdmCartMgmt.vue";
import AdmUHistory from "@/views/AdminView/AdmUnitView/AdmUHistory.vue";

export default {
    components: {
        FpDefLayout,
        AdmCartMgmt,
        AdmUHistory,
        MultiTab,
    },
    data() {
        return {
            tabHeaders: [
                'Thay đổi giỏ hàng', 'Lịch sử căn'
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
