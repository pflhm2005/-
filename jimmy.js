(function(window, $) {
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        arr = [];

    //缩写一下
    var getId = str => $.getElementById(str);
    var getTag = str => $.getElementsByTagName(str);
    var getClass = str => $.getElementsByClassName(str);
    var advSear = str => $.querySelectorAll(str);

    //入口函数
    var jimmy = function(ele) {
        return new jimmy.prototype.init(ele);
    };

    //简化一下
    jimmy.fn = jimmy.prototype;

    //超简单扩展函数
    jimmy.fn.extend = function(o1, o2) {
        for (var key in o1) {
            this[key] = o1[key];
        }
        return this;
    };

    //初始化
    jimmy.fn.init = function(ele, ctx) {
        if (!ele) {
            return this;
        }
        //处理DOM节点
        if (ele.nodeType) {
            return this.push(ele);
        }
        //快速匹配正则
        if (rquickExpr.test(ele)) {
            matches = rquickExpr.exec(ele);
            if (match = matches[1]) {
                return this.push(getId(match));
            } else if (match = matches[2]) {
                return this.merge(getTag(match));
            } else if (match = matches[3]) {
                return this.merge(getClass(match));
            }
        }
        if ($.querySelectorAll) {
            return this.merge(advSear(ele));
        } else {
            return this;
        }
    }

    //扩展
    jimmy.fn.extend({
        length: 0,
        jimmy: '1.0.0',
        constructor: jimmy,
        push: arr.push,
        slice: arr.slice,
        merge: function(el) {
            return this.push(...el);
        },
        each: function(arr, callback) {
            for (var i = 0; i < arr.length; i++) {
                callback.call(arr[i], i, arr[i]);
            }
        },
        //是否是定位元素
        isPosition: function(str) {
            return str === 'relative' || str === 'abosulte' || str === 'fixed';
        },
        //获取第一个定位父元素宽高
        getPositionPWidth: function(ele) {
            var p = ele.parentNode;
            while (!this.isPosition(window.getComputedStyle(p).position)) {
                if (p.tagName === 'BODY') {
                    break;
                }
                p = p.parentNode;
            }
            return [window.getComputedStyle(p).width, window.getComputedStyle(p).height];
        },
        css: function(name, pseudo = null) {
            return window.getComputedStyle(this[0], pseudo)[name];
        },
        eq: function(index) {
            var ret = this.constructor();
            ret.push(this[index]);
            return ret;
        }
    });

    jimmy.ajax = function(obj) {
        if (!obj) {
            return;
        }
        var url = obj.url,
            method = obj.method.toLowerCase(),
            fn = obj.fn,
            data = obj.data,
            Data = parseData(data);

        function parseData(obj) {
            var finalData = '';
            for (var key in obj) {
                finalData += key + '=' + obj[key] + '&';
            }
            return finalData.slice(0, -1);
        };
        var xhr = new XMLHttpRequest();
        if (method === 'get') {
            url = url + '?' + Data;
            Data = null;
        }
        xhr.open(method, url);
        if (method = 'post') {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
        xhr.send(Data);
        xhr.onreadystatechange = function() {
            if (xhr.status == 200 && xhr.readyState == 4) {
                var result = xhr.responseText;
                fn(result);
            }
        };
    };

    //动画函数
    //由于函数构造原因 实际durantion会比设定长一些
    jimmy.fn.animate = function(obj, duration) {
        var ele = this[0];
        clearInterval(ele.timer);
        ele.timer = setInterval(() => {
            //判断是否全部执行完毕
            var flag = true;
            for (var key in obj) {
                var target = obj[key],
                    per = duration / 20,
                    current = window.getComputedStyle(ele, null)[key];
                //由于10%-0的变化是合理的 但是0作为target无法进入百分比分支 添加判断
                //getComputedStyle永远获取px属性 只能用style判断是否是百分比变化
                if (~ele.style[key].indexOf('%') && target === 0) {
                    target += '%';
                }
                current = parseFloat(current);
                //处理透明度
                if (key === 'opacity') {
                    var step = ((target - current) / per) * 100;
                    step = target - current > 0 ? Math.ceil(step) : Math.floor(step);
                    current += (step / 100);
                    ele.style[key] = current;
                }
                //处理百分比
                //这个支持有问题 暂时不能用
                //修复 但是duration是有问题的 
                //仅处理宽度
                else if (~target.indexOf('%')) {
                    //获取定位父元素宽
                    ele.pWidth = ele.pWidth || parseFloat(this.getPositionPWidth(ele)[0]);
                    //因为后面要加%单位 这里要先乘以100 坑爹啊
                    //已经不知道怎么注释了 toFix返回的是字符串 只能这样强制获取2位小数
                    current = (Math.floor((current / ele.pWidth) * 10000)) / 100;
                    target = parseInt(target);
                    var step = ((target - current) / per) * 100;
                    step = target - current > 0 ? Math.ceil(step) : Math.floor(step);
                    current += (step / 100);
                    ele.style[key] = current + '%';
                }
                //处理px单位 
                else {
                    target = parseInt(target);
                    var step = (target - current) / per;
                    step = target - current > 0 ? Math.ceil(step) : Math.floor(step);
                    current += step;
                    ele.style[key] = current + 'px';
                }
                //循环过程中有一个未达到目标置false
                if (target != current) {
                    flag = false;
                }
            }
            if (flag) {
                console.log(1);
                clearInterval(ele.timer);
            }
        }, 20);
    }

    //轮播图
    jimmy.fn.slide = function(obj) {
        var S = this[0],
            ele = S.children,
            _obj = obj || {};

        var btn_l = ele[0],
            btn_r = ele[1],
            dot = ele[2],
            pic = ele[3],
            pic_li = pic.children,
            len = pic_li.length,
            dot_li = 0,
            num = 0,
            lastnum = 0,
            timer = null;

        var _S = `position: relative;
                margin:0 auto;
                overflow: hidden;
                left: 0;
                top: 0;
                user-select:none;`,
            _btn = `font-family: Microsoft yahei;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                z-index: 10;
                width: 10%;
                height: 12%;
                background-color: rgba(0, 0, 0, 0.8);
                text-align: center;
                color: white;`,
            _pic = `left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                
                padding: 0;`,
            _dot = `z-index: 10;
                position: relative;
                top: 80%;
                transform: translateX(50%);`,
            _dot_li = `display: block;
                background-color: #ff9900;
                opacity: 0.3;
                margin: 0 1.2%;
                float: left;
                border-radius: 50%;
                text-indent: -999px;`;

        //构造函数
        function Slide() {
            //参数处理
            this.width = isNaN(parseInt(_obj.width)) ? '600' : parseInt(_obj.width);
            this.height = isNaN(parseInt(_obj.height)) ? '450' : parseInt(_obj.height);
            this.arrow = _obj.arrow !== false;
            this.dot = _obj.dot !== false;
            this.autoplay = typeof _obj.autoplay === "number" ? _obj.autoplay : _obj.autoplay === false ? false : 2000;

            //样式初始化
            this.ele_init();
            //事件初始化
            this.event_init();
        }

        Slide.prototype = {
            constructor: Slide,
            //包含宽高、style样式、加载初始化
            ele_init: function() {
                this.size_init();
                this.css_init();
                this.load_init();
            },
            event_init: function() {
                //父元素hover事件
                this.content_event();
                //小圆点事件
                this.dot_event();
                //按钮事件
                this.btn_event();
            },
            size_init: function() {
                S.style = `${_S}width:${this.width}px;height:${this.height}px;`;
            },
            css_init: function() {
                //由于字体大小百分比是根据em定义 直接写百分比无法动态响应
                //利用宽度与一个比例参数进行动态修正大小
                var per = 12,
                    per2 = 35,
                    dots = '';
                btn_l.style = `${_btn}left: -10%;text-indent:-1px;font-size: ${this.height / per}px`;
                btn_r.style = `${_btn}right:-10%;font-size:${this.height / per}px`;

                //设定user-select:none 所以大于号和小于号看起来像字体图标 
                btn_l.innerHTML = '\<';
                btn_r.innerHTML = '\>';

                pic.style = _pic;
                jimmy.fn.each(pic_li, function(i, value) {
                    value.style = `${_pic}opacity:0;position:absolute;list-style:none;`;
                });

                //动态添加小圆点和样式
                dot.style = _dot;
                for (var i = 0; i < len; i++) {
                    dots += "<span>" + i + "</span>";
                }
                dot.innerHTML = dots;
                dot_li = dot.children;
                jimmy.fn.each(dot_li, (i, value) => {
                    value.style = `${_dot_li}width:${this.height / per2}px;height:${this.height / per2}px;`;
                });
            },
            load_init: function() {
                //默认显示第一张图片 点亮第一个圆点 并根据参数设置样式
                dot_li[0].style.opacity = 1;
                pic_li[0].style.opacity = 1;
                !!this.autoplay && (timer = this.auto(this.autoplay));
                !this.dot && (dot.style.display = 'none');
                !this.arrow && (btn_l.style.display = 'none') && (btn_r.style.display = 'none');
            },
            //父元素hover
            content_event: function() {
                S.onmouseover = () => {
                    clearInterval(timer);
                    _(btn_l).animate({ left: 0 }, 200);
                    _(btn_r).animate({ right: 0 }, 200);
                    // btn_l.style.left = 0;
                    // btn_r.style.right = 0;
                };
                S.onmouseleave = () => {
                    timer = this.auto(this.autoplay);
                    _(btn_l).animate({ left: '-10%' }, 200);
                    _(btn_r).animate({ right: '-10%' }, 200);
                    // btn_l.style.left = '-10%';
                    // btn_r.style.right = '-10%';
                };
            },
            //圆点hover事件
            dot_event: function() {
                var count = len;
                //事件委托
                dot.onmouseover = () => {
                    num = parseInt(event.target.innerHTML);
                    this.change();
                }
            },
            //按钮点击事件
            btn_event: function() {
                btn_l.onclick = () => {
                    num = num === 0 ? len - 1 : num - 1;
                    this.change();
                };
                btn_r.onclick = () => {
                    num = num == len - 1 ? 0 : num + 1;
                    this.change();
                }
            },
            //配合transition真是相当简单啊
            change: function() {
                _(pic_li[num]).animate({ opacity: 1 }, 500);
                _(pic_li[lastnum]).animate({ opacity: 0 }, 500);
                // pic_li[num].style.opacity = 1;
                // pic_li[lastnum].style.opacity = 0;
                dot_li[num].style.opacity = 1;
                dot_li[lastnum].style.opacity = 0.3;
                lastnum = num;
            },
            //自动轮播 返回定时器ID
            auto: function(time) {
                return !!time && setInterval(() => {
                    btn_r.click();
                }, time);
            }
        };
        //返回一个实例
        //主要是为了结构清晰 new会自动调用函数
        new Slide(obj);
    }

    //重置原型
    jimmy.fn.init.prototype = jimmy.fn;

    //简化符号
    var _jimmy = window.jimmy,
        __ = window._;
    jimmy.noConflict = function(deep) {
        if (window._ === jimmy) {
            window._ = __;
        }
        if (deep && window.jimmy === jimmy) {
            window.jimmy = _jimmy;
        }
        return jimmy;
    }

    window._ = window.jimmy = jimmy;

    return jimmy;
})(window, document);