(function(window, $) {
    var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        arr = [];

    //缩写一下
    function getId(str) { return $.getElementById(str); }

    function getTag(str) { return $.getElementsByTagName(str); }

    function getClass(str) { return $.getElementsByClassName(str); }

    function advSear(str) { return $.querySelectorAll(str); }

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
        ele = rquickExpr.exec(ele);
        if (match = ele[1]) {
            return this.push(getId(match));
        } else if (match = ele[2]) {
            return this.merge(getTag(match));
        } else if (match = ele[3]) {
            return this.merge(getClass(match));
        } else if ($.querySelectorAll) {
            return this.merge(advSear(match));
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
        }
    })

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
                user-select:none;`
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
                color: white;
                transition:all 1s;`,
            _pic = `left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                transition:all 0.6s;`,
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
            this.width = isNaN(Number(_obj.width)) ? '600' : _obj.width;
            this.height = isNaN(Number(_obj.height)) ? '450' : _obj.height;
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
            //包含宽高、样式、初始化
            ele_init: function() {
                this.size_init();
                this.css_init();
                this.load_init();
            },
            event_init: function() {
                this.dot_event();
                this.btn_event();
            },
            size_init: function() {
                S.style = _S + 'width:' + this.width + 'px;height:' + this.height + 'px;';
            },
            css_init: function() {
                var per = 12,
                    per2 = 35,
                    dots = '';
                btn_l.style = _btn + 'left: -10%;text-indent: -1px;font-size:' + this.height / per + 'px';
                btn_r.style = _btn + 'right:-10%;font-size:' + this.height / per + 'px';
                btn_l.innerHTML = '\<';
                btn_r.innerHTML = '\>';
                pic.style = _pic;
                jimmy.fn.each(pic_li, function(i, value) {
                    value.style = _pic + 'opacity:0;position:absolute;list-style:none;';
                });
                dot.style = _dot;
                for (var i = 0; i < len; i++) {
                    dots += "<span>" + i + "</span>"
                }
                dot.innerHTML = dots;
                dot_li = dot.children;
                jimmy.fn.each(dot_li, (i, value) => {
                    value.style = _dot_li + 'width:' + this.height / per2 + 'px;height:' + this.height / per2 + 'px;';
                });
            },
            load_init: function() {
                dot_li[0].style.opacity = 1;
                pic_li[0].style.opacity = 1;
                !!this.autoplay && (timer = this.auto(this.autoplay));
                !this.dot && (dot.style.display = 'none');
                !this.arrow && (btn_l.style.display = 'none') && (btn_r.style.display = 'none');
            },
            dot_event: function() {
                var count = len;
                dot.onmouseover = () => {
                    num = parseInt(event.target.innerHTML);
                    this.change();
                }
            },
            btn_event: function() {
                S.onmouseover = () => {
                    clearInterval(timer);
                    btn_l.style.left = 0;
                    btn_r.style.right = 0;
                };
                S.onmouseleave = () => {
                    timer = this.auto(this.autoplay);
                    btn_l.style.left = '-10%';
                    btn_r.style.right = '-10%';
                };
                btn_l.onclick = () => {
                    num = num === 0 ? len - 1 : num - 1;
                    this.change();
                };
                btn_r.onclick = () => {
                    num = num == len - 1 ? 0 : num + 1;
                    this.change();
                }
            },
            change: function() {
                pic_li[num].style.opacity = 1;
                pic_li[lastnum].style.opacity = 0;
                dot_li[num].style.opacity = 1;
                dot_li[lastnum].style.opacity = 0.3;
                lastnum = num;
            },
            auto: function(time) {
                return !!time && setInterval(() => {
                    btn_r.click();
                }, time);
            }
        }


        new Slide(obj);
    }

    //重置原型
    jimmy.fn.init.prototype = jimmy.fn;

    //简化符号
    window._ = jimmy;

})(window, document);