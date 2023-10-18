<template>
  <div class="d-flex flex-wrap align-items-center" :style="{marginTop: marginTop+'px', marginBottom: marginBot+'px'}">
    <div class="col col-md-12 col-xxl">
      <span v-if="!editing" class="text-content">
        <span v-show="itemData.val == null" class="text-decoration-line-through">
          {{ itemData.desc }} {{ valTranlate(itemData.oldVal) }} {{ getItemUnit }}
        </span>
        <span v-show="itemData.val != null">
          {{ itemData.desc }} {{ valTranlate(itemData.val) }} {{ getItemUnit }}
        </span>
      </span>
      <div v-else class="row d-flex flex-wrap align-items-center">
        <div v-if="!valueEditableCategory(cateName)" class="col pe-2">
          <input v-model="editingDesc" id="descForm" class="form-control border-white px-0" type="text" required/>
        </div>
        <div v-else class="col-xxl-auto col-md-12 col-sm-auto col-12">
          <span class="text-content me-3">
            {{ itemData.desc }}
          </span>
        </div>
        <div v-if="valueEditableCategory(cateName)" class="col">
          <input v-if="typeCheck(itemData.val) === TypeName.DATE" :min="calendarMinDate" max="2099-06-08"
                 v-model="editingVal" id="dayForm" class="p-0 form-control border-white" type="date" required/>
          <input v-else-if="typeCheck(itemData.val) === TypeName.NUMBER" v-model.lazy="editingVal" id="numberForm"
                 class="p-0 form-control border-white" type="number" pattern="\d*"  required/>
          <div v-else-if="typeCheck(itemData.val) === TypeName.BOOLEAN" class="p-0 form-check form-switch">
            <input v-model="editingVal" id="checkForm"
                   class="p-0 form-switch form-switch-xl form-check-input" type="checkbox" role="switch"/>
          </div>
          <input v-else v-model="editingVal" id="textForm" class="p-0 form-control border-white" type="text" required/>
        </div>
        <!--            <div class="col-auto">-->
        <!--              {{ getItemUnit }}-->
        <!--            </div>-->
        <div class="col-auto">
          <div class="row d-flex flex-wrap">
            <div class="col-auto pe-3 ps-1">
              <ButtonView :btnIcon="getIconUrl('XCircleIcon.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                          @click="onEditCancelClk" status="no-bg-btn"/>
            </div>
            <div class="col-auto pe-2 ps-2">
              <ButtonView :btnIcon="getIconUrl('TickCircle.svg')" :btnOpacity="16" :iconSize="29" :rmPadding="true"
                          @click="onEditVerifyClk" status="no-bg-btn"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!editing && editable" class="col-auto ps-md-0">
      <div class="d-flex">
        <div v-show="canDeny" class="col-auto pe-3 ps-1 ps-md-0">
          <ButtonView :btnIcon="getIconUrl('XCircleIcon.svg')" :btnOpacity="16" :iconSize="28" :rmPadding="true"
                      @click="onDenyClk" status="no-bg-btn"/>
        </div>
        <div v-show="canApprove" class="col-auto pe-2 ps-2">
          <ButtonView :btnIcon="getIconUrl('TickCircle.svg')" :btnOpacity="16" :iconSize="28" :rmPadding="true"
                      @click="onApproveClk" status="no-bg-btn"/>
        </div>
        <div v-show="canChange" class="col-auto pe-2 ps-1 ps-md-0">
          <ButtonView status="gray-btn" :textSize="14" content="Chỉnh sửa" @click="editing=true" />
        </div>
        <div v-show="canDelete" class="col-auto pe-2 ps-1 ps-md-0">
          <ButtonView status="gray-btn" :textSize="14" content="Thu hồi" @click="onDelClk"/>
        </div>
        <div v-show="canSugDelete" class="col-auto pe-2 ps-1 ps-md-0">
          <ButtonView status="gray-btn" :textSize="14" content="Thu hồi" @click="onSugDelClk"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ButtonView from "@/components/FpButton/ButtonView.vue";
import {calendarMinDate, getIconUrl, grayToOpacity, typeCheck, TypeName} from "@/utils/utils";
import {
  denyNegoItem,
  descEditableCategory,
  itemUnit,
  justApproveNegoItem, revertDoneNegoItem, sugDelNegoItem, updateNegoItem,
  valueEditableCategory
} from "@/utils/saleProcess";
import {ddMmYyyy} from "@/utils/dateTimeUtils";

export default {
  components: {ButtonView},
  data() {
    return {
      editing: false,
      editingDesc: '',
      editingVal: '',
      // Other
      TypeName,
    }
  },
  props: {
    itemData: {
      type: Object,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    cateName: {
      type: String,
      required: true,
    },
    rent: {
      type: Boolean,
      required: true,
    },
    isAgent: {
      type: Boolean,
      required: true,
    },
    oneMan: {
      type: Boolean,
      required: true,
    },
    editable: {
      type: Boolean,
      default: true,
    },
    canApprove: {
      type: Boolean,
      default: true,
    },
    canDeny: {
      type: Boolean,
      default: true,
    },
    canChange: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    canSugDelete: {
      type: Boolean,
      default: false,
    },
    marginTop: {
      type: Number,
      default: 0,
    },
    marginBot: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    getItemUnit() {
      return itemUnit(this.itemData, this.itemName, this.rent);
    },
    calendarMinDate,
  },
  methods: {
    getIconUrl,
    grayToOpacity,
    descEditableCategory,
    valueEditableCategory,
    //
    typeCheck,
    valTranlate(val){
      if (typeCheck(val) === TypeName.DATE){
        return ddMmYyyy(val);
      }

      if (typeCheck(val) === TypeName.BOOLEAN){
        return val ? 'Có' : 'Không';
      }
      return val;
    },
    approveItem(agent){
      justApproveNegoItem(this.itemData, agent);
      this.$emit('approved', this.cateName, this.itemName);
    },
    onApproveClk() {
      this.approveItem(this.isAgent);
    },
    onDenyClk() {
      if (this.itemData.done){
        revertDoneNegoItem(this.itemData);
      }
      else {
        denyNegoItem(this.itemData, this.isAgent);
      }
      this.notifyNegoRejected();
    },
    onDelClk() {
      this.$emit('deleted', this.cateName, this.itemName);
    },
    onSugDelClk(){
      sugDelNegoItem(this.itemData, this.isAgent);
      if (this.oneMan){
        // if one user do this negotiate, automatic applied approve
        this.approveItem(!this.isAgent);
      } else {
        this.notifyNegoChange();
      }
    },
    onEditVerifyClk() {
      if (!this.editingVal && valueEditableCategory(this.cateName)) {
        return;
      }
      this.itemData.desc = this.editingDesc;

      updateNegoItem(this.itemData, this.editingVal, this.isAgent);
      this.editing = false;

      if (this.oneMan){
        // if one user do this negotiate, automatic applied approve
        this.approveItem(!this.isAgent);
      } else {
        this.notifyNegoChange();
      }
    },
    onEditCancelClk() {
      this.editingDesc = this.itemData.desc;
      this.editingVal = this.itemData.val;
      this.editing = false;
    },
    notifyNegoChange(){
      this.$emit('updated', this.cateName, this.itemData);
    },
    notifyNegoRejected(){
      this.$emit('denied', this.cateName, this.itemData);
    },
  },
  watch: {
    itemData: {
      handler(val) {
        this.editingDesc = val.desc;
        this.editingVal = val.val;
      },
      deep: true,
    },
    editingVal(val){
      if(typeCheck(val) === TypeName.NUMBER){
        this.editingVal = Math.max(0, val);
      }
    },
  },
  mounted() {
    this.onEditCancelClk();
  },
  emits: ['approved', 'denied', 'deleted', 'updated']
}
</script>

