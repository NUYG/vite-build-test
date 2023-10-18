<template>
  <button :style="getBtnStyle" :class="['d-flex justify-content-center align-items-center', getStatusClass, rmPaddingClass]" :disabled="disabled" @click.prevent="handleClick">
    <slot name="btnPre"></slot>
    <img class="h-100 d-flex" v-if="btnIcon && !rightIcon" :src="btnIcon" alt="" :style="imgStyle"/>
    <a v-if="content" :style="textStyle">{{ content }}</a>
    <img class="h-100 d-flex" v-if="btnIcon && rightIcon" :src="btnIcon" alt="" :style="imgStyle"/>
    <slot name="btnExt"></slot>
  </button>
</template>

<script>
import {grayToOpacity} from "@/utils/utils";

export default {
  data() {
    return {
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    contentColor: {
      type: String,
      default: '',
    },
    btnIcon: {
      type: String,
      default: ''
    },
    btnHeight: {
      type: Number,
      default: 100
    },
    onBtnColor: {
      type: String,
      default: ''
    },
    activeBtn: {
      type: Boolean,
      default: false
    },
    textSize:{
      type:Number,
      default:16
    },
    iconSize:{
      type:Number
    },
    rmPadding: {
      type: Boolean,
      default: false,
    },
    btnOpacity: {
      type: Number,
      default: 16
    },
    btnRadius: {
      type: Number,
      default: 0,
    },
    rotate: {
      type: Number,
      default: 0,
    },
    squarePadding:{
      type:Boolean,
      default:false
    },
    rightIcon: {
      type: Boolean,
      default: false,
    },
    xPadding: {
      type: Number,
      default: 0,
    }
  },
  computed: {
    rmPaddingClass(){
      return this.rmPadding ? 'p-0 border-0' : 0;
    },
    getStatusClass() {
      switch (this.status) {
        case 'warning':
          return 'btn-warning'
        case 'error':
          return 'btn-error'
        case 'danger':
          return 'btn-danger'
        case 'success':
          return 'btn-success'
        case 'info':
          return 'btn-info'
        case 'light':
          return 'btn-light'
        case 'dark':
          return 'btn btn-dark'
        case 'default':
          return 'btn-outline-dark'
        case 'gray-btn':
          return 'gray-button'
        case 'no-bg-btn':
          return 'no-bg-button'
        case 'gray-border':
          return 'border-number'
        case 'more-btn' :
          return 'more-btn'
        default:
          return ''
      }
    },
    getBtnStyle() {
      let activeColor=''
      const btnPadding = this.squarePadding ? `padding: 6px !important;` : (this.xPadding ? `padding: 10px ${this.xPadding}px !important;` : '');
      const btnRadius = this.btnRadius ? `border-radius: ${this.btnRadius}px !important;` : '';
      if(this.activeBtn&& this.status==='gray-btn')
      {
        activeColor='white'
      }
      return `height:${this.btnHeight}%; background-color:${this.colorBtn}!important ;opacity:${grayToOpacity(this.btnOpacity)};color:${activeColor};${btnPadding};${btnRadius};`
    },
    textStyle()
    {
      return `font-size:${this.textSize}px; margin: 0px 5px; color: ${this.contentColor}`
    },
    rotateStyle() {
      return `transform: rotate(${this.rotate}deg); `;
    },
    colorBtn() {
       return  this.activeBtn ? this.onBtnColor : ''
    },
    sizeIcon()
    {
      return this.iconSize ? `width:${this.iconSize}px;height:${this.iconSize}px; ` : ''
    },
    imgStyle(){
      return this.rotateStyle + this.sizeIcon;
    },
  },
  methods: {
    handleClick() {
      this.id ? this.$emit('btnClick', this.id) : this.$emit('btnClick')
    }
  },
  emits: ['btnClick'],
}
</script>

