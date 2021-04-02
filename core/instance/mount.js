//挂载

import VNode from "../vdom/vnode.js";
import { vmodel } from "./grammer/vmodel.js";
 
import {renderNode,template2Vnode,prepaerRender,getVNodeByTemplate,clearMap} from './render.js'
import {vforInit} from './grammer/vfor.js'
import {mergeAttr} from '../util/ObjectUtil.js'
import { checkVBind } from "./grammer/vbind.js";
import {checkVon} from './grammer/von.js'
export function initMount(Due){
    Due.prototype.$mount = function(el){
        let vm =this;
        let rootDom = document.getElementById(el);
        mount(vm,rootDom);
    }
}

export function mount(vm,elm){
    //进行挂载
   
    vm._vnode =constructVNode(vm,elm,null);
    //进行预备渲染(建立渲染索引，通过模板找vnode，通过vnode找模板  )
    prepaerRender(vm,vm._vnode);
   
}

function constructVNode(vm,elm,parent){//深度优先搜索
    let vnode = analysisAttr(vm,elm,parent);
     
    if(vnode==null){//不是虚拟节点 
    
        let children = [];
        let text =getNodeText(elm);
        
        let data = null;
        let nodeType = elm.nodeType;
        let tag = elm.nodeName;
        vnode = new VNode(tag,elm,children,text,data,parent,nodeType)
        if(elm.nodeType==1 && elm.getAttribute('env')){
            vnode.env = mergeAttr(vnode.env,JSON.parse(elm.getAttribute('env')));//属性合并的方法

        }else{
            vnode.env = mergeAttr(vnode.env ,parent? parent.env:{});
        }
     
    }
    
    checkVBind(vm,vnode);
    checkVon(vm,vnode);
    let childrens =vnode.nodeType==0? vnode.parent.elm.childNodes : vnode.elm.childNodes;
    let len = vnode.nodeType==0? vnode.parent.elm.childNodes.length :vnode.elm.childNodes.length;
    for(let i =0;i<len;i++){
        let childNodes = constructVNode(vm,childrens[i],vnode)
        if(childNodes instanceof VNode){//返回单一节点的时候
            vnode.children.push(childNodes);
        }else{//返回节点数组的时候
            vnode.children = vnode.children.concat(childNodes);
        }
    }
    return vnode;
}

//分析属性
function analysisAttr(vm,elm,parent){
   
    if(elm.nodeType==1){ //标签
      
        let attrName = elm.getAttributeNames();
        if(attrName.indexOf('v-model')>-1){
            vmodel(vm,elm,elm.getAttribute('v-model'));
        }
        if(attrName.indexOf('v-for')>-1){   
            console.log(template2Vnode);
        let result=  vforInit(vm,elm,parent,elm.getAttribute('v-for'));
     
        return result 

        }
       
    }
}

function getNodeText(elm){
    if(elm.nodeType ==3){
        return elm.nodeValue;

    }else{
        return '';
    }
}

export function rebuild (vm,template){
    console.log(template);
    console.log(template2Vnode);
    let virtualNode = getVNodeByTemplate(template);
    console.log(virtualNode);
    for(let i = 0;i<virtualNode.length ;i++){
        virtualNode[i].parent.elm.innerHTML="";
        virtualNode[i].parent.elm.appendChild(virtualNode[i].elm)
        //变回原来模板一样
    let result  = constructVNode(vm,virtualNode[i].elm,virtualNode[i].parent)
        virtualNode[i].parent.children  = [result];
        clearMap();
        prepaerRender(vm,vm._vnode);//重新简历索引
        renderNode(vm, vm._vnode);
    
    }
}