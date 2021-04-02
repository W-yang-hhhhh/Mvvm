
export  function getValue (obj,name){  //name可能是个name.x
     if(!obj){
         return obj
     }
    let result =obj;
    if(obj){
        let names = name.split('.');
    //   console.log(result,names);
        for(let i =0;i<names.length;i++){
            // console.log(result,names[i]);
           if(result[names[i]]){
            result = result[names[i]];
           }else{
               return undefined;
           }
            
           
        }
    }
   
    return result
    
}

/**
 * 
 * @param {*} obj 对象
 * @param {*} data 属性
 * @param {*} value 要给的值
 */
export  function setValue (obj,data,value){
    if(!obj){
        return ;
    }
    let attrList  = data.split('.');

    let temp= obj;
    for(let i = 0;i<attrList.length-1;i++){
     
        if(temp[attrList[i]]){
            temp = temp[attrList[i]];
        }else{
            return ;
        }

    }
 
    if(temp[attrList[attrList.length-1]]!=null){
        temp[attrList[attrList.length-1]] = value;
    }
}





export function easyclone(obj){
    return JSON.parse(JSON.stringify(obj));
    //缺点 深层对象  复制的还是地址；
}


export function mergeAttr(obj1,obj2){//合并属性
         if(obj1==null){
             return clone(obj2)
         }
         if(obj2 ==null){
             return clone(obj1)
         }
         let result = {};
         let obj1Attrs =Object.getOwnPropertyNames(obj1);
         for(let i = 0 ;i<obj1Attrs.length ;i++){
             result[obj1Attrs[i]] = clone(obj1[obj1Attrs[i]]);
         }
         let obj2Attrs =Object.getOwnPropertyNames(obj2);
         for(let i = 0 ;i<obj2Attrs.length ;i++){
             result[obj2Attrs[i]] = clone(obj2[obj2Attrs[i]]);
         }
         return result;

}



function clone(obj){
    if(obj instanceof Array){
        return cloneArray(obj);
    }else if(obj instanceof Object){
        return cloneObject(obj)
    }else{
        return obj
    }

}

function cloneObject(obj){//克隆对象
    let result = {};
    let names = Object.getOwnPropertyNames(obj);
    for (let i = 0;i<names.length;i++){
        result[names[i]]=clone(obj[names[i]]);
    }
    return result;
}


function cloneArray(obj){//克隆数组

    let result = new Array(obj.length);
    for(let i =0;i<obj.length;i++){
        result[i] = clone(obj[i]);
    }
    return result ;
}


export function getEnvAttr(vm,vnode){
    let result = mergeAttr(vm._data,vnode.env);
    result = mergeAttr(result,vm._computed);
    return result;
}