<template>
    <button type="button" :class="getTggBtnClass" data-bs-toggle="modal" :data-bs-target="dataTarget">
        {{ triggerBtnText }}
    </button>

    <div class="modal fade" :id="id" tabindex="-1" data-bs-backdrop="false" role="dialog" data-bac :aria-labelledby="popupTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" >
                <div class="modal-header" >
                    <h5 class="modal-title fs-5" :id="popupTitle"><b>{{ title }}</b></h5>
                </div>

                <div class="modal-body ">
                    {{ content }}
                </div>
                <div class="modal-footer">
                    <div class='p-2'>
                        <button @click="funcBtnClicked" type="button" class="gray-button btn-wrap-text p-2" data-bs-dismiss="modal">{{ funcBtnText }}</button>
                    </div>
                    <div class="p-2">
                        <button type="button" class="gray-button" data-bs-dismiss="modal"> Đóng </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {}
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        triggerBtnText: {
            type: String,
            required: true,
        },
        triggerBtnClass: {
            type: String,
            default: '',
        },
        tggBtnClassAdd: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: "Bạn hãy xác nhận",
        },
        content: {
            type: String,
            default: "",
        },
        funcBtnText: {
            type: String,
            default: "Xác nhận",
        },
        parameters: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        dataTarget() {
            return "#" + this.id;
        },
        popupTitle() {
            return this.id + "title";
        },
        getTggBtnClass() {
            return (this.triggerBtnClass ? (this.triggerBtnClass + " ") : ("w-100" +
              " gray-button btn-wrap-text text-white bg-dark small p-2 ")) + this.tggBtnClassAdd;
        },
    },
    methods: {
        funcBtnClicked() {
            if (Object.keys(this.parameters).length > 0) {
                this.$emit("func-btn-clicked", this.parameters);
            } else {
                this.$emit("func-btn-clicked");
            }
        },
    },
    emits: ["func-btn-clicked"],
    mounted() {
    }
}
</script>

<style scoped>
</style>
