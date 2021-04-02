//v-model功能

import { setValue } from "../../util/ObjectUtil.js"


export function vmodel (vm,elm,data){
    
    elm.onchange = function (event){
   
        setValue(vm._data,data,elm.value);//vue对象 该元素绑定的属性 该元素的新value
    }
}