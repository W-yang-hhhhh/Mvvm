import {getValue} from '../util/ObjectUtil.js'
import {checkVBind} from './grammer/vbind.js'

//通过模板，找到哪些节点用到了这个模板
export let template2Vnode = new Map();
//通过节点，找到，这个节点下有哪些模板
export let vnode2Template = new Map();

export  function prepaerRender(vm,vnode){
    if(vnode ==null) return ;
 
    if(vnode.nodeType ==3){//是个文本节点
        analysisTemplateString(vnode);
    }
    if(vnode.nodeType ==0){
        console.log(vnode);
        setTemplate2Vnode("{{" + vnode.data[2] + "}}", vnode);
        setVnode2Template("{{" + vnode.data[2] + "}}", vnode);
    }
    analysisAttr(vm,vnode)
    //1表示 标签
    // if(vnode.nodeType==1){
        for(let i =0;i<vnode.children.length;i++){
          
            prepaerRender(vm,vnode.children[i]);
        }
    // }
}

function analysisTemplateString(vnode){
 
let templateStrList =vnode.text.match(/{{[a-zA-z0-9_.]+}}/g);
 
    for(let i =0;i<(templateStrList&&templateStrList.length);i++){
 
        setTemplate2Vnode(templateStrList[i],vnode);
        setVnode2Template(templateStrList[i],vnode);
    }

}
//建立映射
function setTemplate2Vnode(template,vnode){
    // console.log(template,vnode);
    let templateName =getTemplateName(template);
    let vnodeSet = template2Vnode.get(templateName)
    if(vnodeSet){
        vnodeSet.push(vnode);
    } else{
        template2Vnode.set(templateName,[vnode]);
    }
}

//建立映射
function setVnode2Template(template,vnode){
    
    let templateName =getTemplateName(template);
    let templateSet = vnode2Template.get(vnode)
    if(templateSet){
        templateSet.push(templateName);
    } else{
        vnode2Template.set(vnode,[templateName]);
    }
}


//去掉字符串中{{}}
function getTemplateName(template){

    if(template.substring(0,2)=='{{' && template.substring(template.length-2,template.length)){
        return template.substring(2,template.length-2)
    }else{
        return template;
    }
}
export function renderMixin(Due){
    Due.prototype.render = function(){
        renderNode(this,this._vnode);
    }
}

export function getTemplate2Vnode(){
    return template2Vnode;
}


export function getVnode2Template(){
    return vnode2Template;
}






export function renderNode(vm,vnode){
    checkVBind(vm,vnode);
    if(vnode.nodeType==3){//文本节点
        let template = vnode2Template.get(vnode);  
        if(template){
            let result = vnode.text;
           for(let i=0;i<template.length;i++){
                let templateValue = getTemplateValue([vm._data,vnode.env],template[i]);         
                if(templateValue){
                    result = result.replace('{{'+template[i]+'}}',templateValue)                   
                }      
           }
           vnode.elm.nodeValue=result
        }
    }else if(vnode.nodeType==1 &&vnode.tag=='INPUT'){
        let template = vnode2Template.get(vnode);
        if(template){
            for(let i = 0;i<template.length;i++){
                let  result = getTemplateValue([vm._data,vnode.env],template[i]);
                if(result){
                    vnode.elm.value = result;
                }
            }
        }
    }else{
        let children = vnode.children;
        for(let i =0;i<children.length;i++){
            renderNode(vm,children[i]);
        }
    }
}



function getTemplateValue(obj,name){
        for(let i=0;i<obj.length;i++){
                let temp =  getValue(obj[i],name);     
               if(temp!=null){
                   return temp
               }
        }
    return null;
}



export function renderData(vm,data){
    //content
   
    let vnodes = template2Vnode.get(data);
    if(vnodes!=null){
        for(let i =0;i<vnodes.length;i++){
            renderNode(vm,vnodes[i])
        }
    }
}


function analysisAttr(vm,vnode){
    if(vnode.nodeType!=1){
        return ;
    }
    let attrName = vnode.elm.getAttributeNames();
    if(attrName.indexOf('v-model')>-1){
        setTemplate2Vnode(vnode.elm.getAttribute('v-model'),vnode)
        setVnode2Template(vnode.elm.getAttribute('v-model'),vnode)
      
    }
}


export function getVNodeByTemplate(template){
    
    return template2Vnode.get(template)
}

export function clearMap(){
    
    template2Vnode.clear();
    vnode2Template.clear();
    console.log(template2Vnode);
}