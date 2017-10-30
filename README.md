

# 说明

- 这里有一些以前自己封装的小玩意和工作中封装的组件



- slide3.js为jquery版本的轮播图



- jimmy.js为原生js写的轮播图



- upload.vue是element-ui组件el-upload的二级封装，修改了部分源码

详细说明可见https://pflhm2005.github.io/archives/

1. jimmy-ibd-class为自定义参数，用于挂载在上传按钮上的动态类名称
2. jimmy-remove-tip为自定义参数，用于删除图片时是否进行弹框提示，因为懒，所以默认打开
3. num为图片上传上限，达到上限会隐藏上传按钮，但不影响删除按钮，需配合jimmy-ibd-class一起使用
4. index为内部用途，当存在多个图片集合时，用来区别上传的图片属于哪一个
5. title为图集标题，可选



- Jimmy_table.vue是为了应付特殊而变态的需求自己封装的表格组件

1. 不太好解释，也不太实用，总之可以配合父组件实现表格合并、拆分、选中等功能