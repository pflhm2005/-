# 自己尝试用原生JS写点什么
- 目前这里有一个原生js的轮播图插件 顺便支持支持简易选择符

- html格式如下：

  ​

  ```html
  <div id="div">
          <div></div>
          <div></div>
          <div></div>
          <div>
              <img src="image/01.jpg">
              <img src="image/02.jpg">
              <img src="image/03.jpg">
          </div>
  </div>
  ```



- JS调用方式如下：

  ​

  ```javascript
  _('#div').slide();
  ```



- 目前原生方法支持3个参数，以对象形式传入：

  ​

  ```javascript
  //示例
  _('#div').slide({
    //轮播区域宽高
    widht:'500px',	
    height:'500px',
    //设定是否自动轮播或自动轮播时间(ms)
    autoplay:false
  });
  ```



- jQuery的版本代码比较好看