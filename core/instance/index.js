import {initMixin} from './init.js'
import {renderMixin} from './render.js'
function Due(options){
    this._init(options);
    if(this._created){
        this._created.call(this);
    }
    this.render();//渲染方法
  
}
initMixin(Due);
renderMixin(Due)

export default Due;
