//虚拟dom节点原型
let number =0;
export default class VNode{
    constructor(
            tag,//标签类型，Div,span,input文本节点用#Text
            elm,//对应的真实节点
            children,//当前节点下的子节点
            text,//当前虚拟节点中的文本
            data,//VNodedata,暂时保留，暂无意义
            parent,//父级节点
            nodeType,
    ){
        this.tag =tag;
        this.elm=elm;
        this.children=children;
        this.text=text;
        this.data=data;
        this.parent=parent;
        this.nodeType=nodeType;
        this. env={};//当前节点的环境变量
        this.instructions =null;//指令
        this.template = [];//当前节点涉及到的模板
        this.number = number++;
    }
}