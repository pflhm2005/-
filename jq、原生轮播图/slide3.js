/*
    使用说明:

    本插件依赖jQuery 样式已定义
    文件按jquery,slide.js顺序引入

    结构必须按下定义，父元素ID或类自己定:
    <div id="slide">
        <div></div>
        <div></div>
        <div></div>
        <div>
            <img src="..">
            ...
            <img src="..">
        </div>
    </div>

************只需要插入img标签填写src属性***********

    引入方式:页面底部调用$('#silde').slide(obj)可传入5个参数
    width,height:轮播图区域宽高
    autoplay:传入false关闭轮播 数值为轮播间隔(毫秒) 其余值设为默认值2秒
    dot:传入false禁用下方小圆点 其余值默认显示
    arrow:两端箭头显示

    示例:
    $(#silde).slide({
        width:300,
        height:200,
        autoplay:1000,
        dot:true,
        arrow:false,
    })
*/
(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(jQuery);
    }
}(function($) {
    $.fn.slide = function(obj) {
        //获取参数列表 顶层元素
        var _obj = obj || {},
            _ = this,
            ele = _.children();

        //依次获取箭头图片圆点
        var btn_l = $(ele[0]),
            btn_r = $(ele[1]),
            dot = $(ele[2]),
            pic = $(ele[3]),
            pic_li = pic.children(),
            len = pic_li.length,
            dot_li = 0;

        //轮播图参数
        var num = 0,
            lastnum = 0,
            timer = null;

        //样式对象
        var style = {
            _: {
                position: "relative",
                margin: "0 auto",
                overflow: "hidden",
                left: 0,
                top: 0,
                userSelect: 'none'
            },
            btn: {
                fontFamily: "Microsoft yahei",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 10,
                width: "10%",
                height: "12%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                textAlign: "center",
                color: "white",
            },
            pic: {
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                margin: 0,
                padding: 0
            },
            dot: {
                zIndex: 10,
                position: "relative",
                top: "80%",
                transform: "translateX(50%)"
            },
            dot_li: {
                display: "block",
                backgroundColor: "#999",
                opacity: ".3",
                margin: "0 1.2%",
                float: "left",
                borderRadius: "50%",
                textIndent: "-999px"
            }
        };

        //构造函数
        function Slide() {
            //参数修正
            this.width = isNaN(parseInt(_obj.width)) ? 400 : parseInt(_obj.width);
            this.height = isNaN(parseInt(_obj.height)) ? 530 : parseInt(_obj.height);
            this.arrow = _obj.arrow !== false;
            this.dot = _obj.dot !== false;
            this.autoplay = typeof _obj.autoplay === "number" ? _obj.autoplay : _obj.autoplay === false ? false : 2000;

            //调用各类初始化函数
            this.ele_init();
            this.event_handle();
            this.options_handle();
        }

        //简单的合并对象
        function merge(obj2, obj1) {
            for (var key in obj2) {
                obj1[key] = obj2[key];
            }
            return obj1;
        }

        //原型方法
        Slide.prototype = {
            //修正构造函数
            constructor: Slide,

            //样式初始化函数
            ele_init: function() {
                //顺序不能变
                this.size_init();
                this.arrow_dot_init();
                this.css_init();
                this.load_init();
            },

            //事件绑定函数
            event_handle: function() {
                this.dot_event();
                this.btn_event();
            },

            //父元素宽高
            size_init: function() {
                _.css({ width: this.width + "px", height: this.height + "px" });
            },

            //生成按钮与圆点
            arrow_dot_init: function() {
                var s_height = parseInt(_.css("height")),
                    count = len,
                    per2 = 35,
                    per = 12;
                btn_l.css("fontSize", s_height / per + "px").html("<");
                btn_r.css("fontSize", s_height / per + "px").html(">");
                while (count--) {
                    dot.prepend($("<span style='width:" + s_height / per2 + "px;height:" + s_height / per2 + "px'>" + count + "</span>"));
                }
                dot_li = dot.children();
            },

            //样式添加
            css_init: function() {
                _.css(style._);
                btn_l.css(merge(style.btn, {
                    left: "-10%",
                    textIndent: "-1px"
                }));
                btn_r.css(merge(style.btn, { right: "-10%" }));
                pic.css(merge(style.pic, { position: "relative" }));
                pic_li.css(merge(style.pic, {
                    opacity: 0,
                    position: "absolute",
                    listStyle: "none",
                }));
                dot.css(style.dot);
            },

            //初始化动画
            load_init: function() {
                dot_li.css(style.dot_li);
                dot_li.eq(0).css({ "backgroundColor": "#ff9900", "opacity": 1 });
                pic_li.eq(0).css("opacity", 1);
            },
            //圆点相关事件
            dot_event: function() {
                var _this = this;
                dot_li.hover(function() {
                    num = parseInt($(this).html());
                    _this.change();
                });
            },

            //箭头相关事件
            btn_event: function() {
                var that = this;
                _.hover(function() {
                    clearInterval(timer);
                    btn_l.stop().animate({ left: 0 }, 500);
                    btn_r.stop().animate({ right: 0 }, 500);
                }, function() {
                    timer = that.auto(that.autoplay);
                    btn_l.stop().animate({ left: "-10%" }, 500);
                    btn_r.stop().animate({ right: "-10%" }, 500);
                });
                btn_l.click(function() {
                    num = num === 0 ? len - 1 : num - 1;
                    that.change();
                });
                btn_r.click(function() {
                    num = num == len - 1 ? 0 : num + 1;
                    that.change();
                })
            },
            change: function() {
                pic_li.eq(lastnum).stop().animate({ opacity: 0 }, 500)
                    .end().eq(num).stop().animate({ opacity: 1 }, 500);
                dot_li.eq(lastnum).css({ "backgroundColor": "#999", "opacity": 0.3 });
                dot_li.eq(num).css({ "backgroundColor": "#ff9900", "opacity": 1 });
                lastnum = num;
            },

            //参数处理函数
            options_handle: function() {
                !this.arrow && btn_l.css("display", "none") && btn_r.css("display", "none");
                !this.dot && dot.css("display", "none");
                this.autoplay && (timer = this.auto(this.autoplay));
            },

            //自动轮播
            auto: function(time) {
                return !!time && setInterval(function() { btn_r.click(); }, time);
            },
        };

        //返回一个实例
        new Slide(obj);
    };
}));