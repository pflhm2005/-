/**
 * @description 类型检测
 * @param {*} o
 * @return {type} 返回传入数据类型
 */
const type = (o) => Object.prototype.toString.call(o).slice(8, -1);

const has = Object.prototype.hasOwnProperty;

/**
 * @description 转换对象
 * @param {Object} obj
 */
const normalizeQuery = (obj) => {
  let str = '';
  if (type(obj) === 'Object') {
    let keys = Object.keys(obj);
    keys.forEach(v => {
      str += `&${v}=${encodeURIComponent(obj[v])}`;
    });
    return `?${str.slice(1)}`;
  }
};


/**
 * @description 代理微信路由跳转
 * @param {String} 参数直接为字符串代表路径
 * @param {Object} 接受path、query的对象
 */
const routerHandler = {
  apply(target, thisBinding, args) {
    let arg = args[0];
    let _type = type(arg);
    let obj;
    if (_type === 'String') {
      obj = { url: arg };
    }
    if (_type === 'Object') {
      if (has.call(arg, 'url')) return target.call(this, arg);
      let { path, query } = arg;
      obj = { url: path + normalizeQuery(query) };
    }
    target.call(this, obj);
  },
};

/**
 * 简化模拟history.go方法
 */
const backHandler = {
  apply(target, thisBinding, args) {
    let num = args[0] || -1;
    target.call(this, {
      delta: Math.abs(num),
    });
  },
};


const push = new Proxy(wx.navigateTo, routerHandler);
const replace = new Proxy(wx.redirectTo, routerHandler);
const back = new Proxy(wx.navigateBack, backHandler);

export default {
  push,
  replace,
  back,
};
