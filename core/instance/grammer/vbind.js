import { getValue,getEnvAttr } from "../../util/ObjectUtil.js";
import {generateCode} from "../../util/code.js"
export function checkVBind(vm,vnode){
    if(vnode.nodeType!=1){
        return ;
    }
    let attrNames = vnode.elm.getAttributeNames();
    for(let i =0;i<attrNames.length;i++){
    
        if(attrNames[i].indexOf('v-bind:')==0 || attrNames[i].indexOf(':')==0){
     
            vBind(vm,vnode,attrNames[i],vnode.elm.getAttribute(attrNames[i]))
        }
    }
}

function vBind(vm,vnode,name,value){
  
    let k  = name.split(":")[1];
    
     if(/^{[\w\W]+}$/.test(value)){
        let str  = value.substring(1,value.length-1).trim();
        let expressionList = str.split(',');
        let result = analysisExpressioni(vm,vnode,expressionList)
        console.log(result);
        vnode.elm.setAttribute(k,result);
     }else{
        let v = getValue(vm._data,value);
        vnode.elm.setAttribute(k,v);
     }
   
}


function analysisExpressioni(vm,vnode,expressionList){
    //获取当前环境变量
    
    let  attr = getEnvAttr(vm,vnode);
     
    let envCode = generateCode(attr);
   
    let result = "";
    for(let i =0;i<expressionList.length ;i++){
        let site = expressionList[i].indexOf(':');
        if(site >-1){
            let code = expressionList[i].substring(0,site);
            let exp = expressionList[i].substring(site+1,expressionList[i].length)
            if(eval(`${envCode};${exp}`)){
                result += code + ',';
            }
            console.log(code,exp);
        }else{
            result += expressionList[i] + ',';
           
        }
    }
    
    if(result.length >0){
        result = result.substring(0,result.length-1)
    }
    return result.substring(0,result.length)//去结尾逗号
    //判断表达式是否成立
    //拼组result


}