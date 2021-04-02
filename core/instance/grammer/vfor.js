import VNode from "../../vdom/vnode.js";
import {getValue} from '../../util/ObjectUtil.js'
//删除带有v-for的dom节点 并存放为虚拟节点  再根据遍历长度生成  dom节点
export function vforInit(vm,elm,parent,instructions){//(key) in list
       
    let virtualNode = new VNode(elm.nodeName,elm,[],'',getVirtualNodeData(instructions),parent,0);
    virtualNode.instructions = instructions;
    parent.elm.removeChild(elm);  //这样还会删除掉该节点上边和下边的文本节点，为保持dom结构一直，下面进行添加
    parent.elm.appendChild(document.createTextNode(''));
    let resultSet = analysisInstructions(vm,instructions,elm,parent)
  
    return virtualNode;
}


// 获取指令数据
function getVirtualNodeData(instructions){
    let insSet = instructions.trim().split(' ');
    if(insSet.length !=3 || insSet[1]!='in' && insSet[1] !='of'){
        throw new Error('error')
    }
    
    return insSet;
}
//分析指令
function analysisInstructions(vm,instructions,elm,parent){
    let insSet = getVirtualNodeData(instructions);
    let dataSet = getValue(vm._data,insSet[2]);
    
    if(!dataSet){
        throw new Error('error');
    }
    let resultSet=[]
    for(let i=0;i<dataSet.length;i++){
      
        let tempDom = document.createElement(elm.nodeName);
        
        tempDom.innerHTML = elm.innerHTML;
        
        let env = analysisKV(insSet[0],dataSet[i],i)//获取局部变量
        tempDom.setAttribute('env',JSON.stringify(env));//将变量设置到domli
        
        parent.elm.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
}


//分析 v-for每个遍历的对象的局部环境
/**
 * (item,index) in list
 * @param {*} instructions (item,index)
 * @param {*} value  list的值
 * @param {*} index  索引
 */
function analysisKV(instructions,value,index){
    if(/([a-zA-Z0-9]+)/.test(instructions)){
        instructions = instructions.trim().substring(1,instructions.length-1)
    }
  
    let keys = instructions.split(',');
    
    if(keys.length==0){
        throw new Error('instructions is error')
    }
    let obj={};
    if(keys.length >=1){//(item)
        obj[keys[0].trim()] =value
    }
    if(keys.length>=2){//(item,index)
        obj[keys[1].trim()] = index;
    }
    
    return obj //env局部变量
}