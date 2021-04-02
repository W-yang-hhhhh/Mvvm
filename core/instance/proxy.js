//构建代理
// 类似 监听 我们要知道哪个属性被修改了，我们才能对页面上的内容进行更新
// 首先捕获修改     所以我们用代理方式监听属性修改

import { rebuild } from './mount.js';
import {renderData} from './render.js'
import {getValue} from "../util/ObjectUtil.js";

 let arrProto = Array.prototype;

 function defArrayFunc (obj,func,namespace,vm){
    Object.defineProperty(obj,func,{
        enumerable:true,
        configurable:true,
        value:function(...args){
            let original = arrProto[func];
            let result =  original.apply(this,args);
           
            rebuild(vm,getnamespace(namespace,""))
            renderData(vm,getnamespace(namespace,""))
            return result;
        }
    })
 }
function proxyArr(vm,arr,namespace){
    let obj ={
        eleType:'Array',
        toString:function(){
            let result ='';
            for(let i =0;i<arr.length;i++){
                result+=arr[i]+', ';
            }
            return result.substring(0,result.length-2);
        },
        push(){},
        pop(){},
        shift(){},
        unshift(){}
    }
    defArrayFunc.call(vm,obj,'push',namespace,vm);
    defArrayFunc.call(vm,obj,'pop',namespace,vm);
    defArrayFunc.call(vm,obj,'shift',namespace,vm)
    defArrayFunc.call(vm,obj,'unshift',namespace,vm)
    arr.__proto__ = obj;
    return arr

}

function constructObjProxy(vm,obj,namespace){
  
    let proxyObj = {};
    for(let prop in obj){  
    
        //设置代理对像proxyObj的值
        Object.defineProperty(proxyObj,prop,{
            configurable:true,
            get(){
                return obj[prop]
            },
            set:function(val){
                //当发生属性修改就调用这个值
                console.log(val);
                obj[prop] =val;
                
                renderData(vm,getnamespace(namespace,prop))
            }
        })
        //设置实体本身的值
        Object.defineProperty(vm,prop,{
            configurable:true,
            get(){
                return obj[prop]
            },
            set:function(val){
            
                //当发生属性修改就调用这个set函数
              
                obj[prop] =val;
               
                let value = getValue(vm._data,getnamespace(namespace,prop))
               
                if(value instanceof Array){
                    
                    rebuild(vm,getnamespace(namespace,prop))
                    renderData(vm,getnamespace(namespace,prop))
                }else{
                    renderData(vm,getnamespace(namespace,prop))
                }

                
               
            }
        })

        if(obj[prop] instanceof Object){
        
            proxyObj[prop] = constructProxy(vm,obj[prop],getnamespace(namespace,prop));
        }   
    }
   
    return proxyObj;
}


/**
 * 
 * @param {Due代理对象} vm 
 * @param {代理属性} obj 
 * @param namespace
 */
export function constructProxy(vm,obj,namespace){
     
    //递归 
    let proxyObj =null;
    if(obj instanceof Array){//判断是否为数组
    
        proxyObj = new Array(obj.length);
        for(let i=0;i<proxyObj.length;i++){
            proxyObj[i] = constructProxy(vm,obj[i],namespace);
        }

        proxyObj = proxyArr(vm,obj,namespace)
        
    }else if(obj instanceof Object){//判断是否为对象
        
        proxyObj = constructObjProxy(vm,obj,namespace)
    }else{
        throw new Error('error')
    }
    return proxyObj;
}


function getnamespace(nowNamespace,nowProp){
    if(nowNamespace ==null ||nowNamespace==''){
        return nowProp
    }
    else if(nowProp==null ||nowProp==''){
        return nowNamespace
    }else{
        return nowNamespace+'.'+nowProp;
    }
   
}