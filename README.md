<<<<<<< HEAD
# classSchedule
毕设作业
=======
# changsha_mobile

> changsha's mobile project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## remind

1.在后面添加参数login_name={账号}自动登录    http://localhost:8081/#/?login_name=admin

## 技术栈

#### 架子 - [vue-cli](https://www.jianshu.com/p/2769efeaa10a)
```
1. npm install -g vue-cli
2. vue init webpack project-name
```
##### CSS预处理 - LESS
```
npm install less less-loader --save
```
使用:
```
<style lang='less'>
  ...
</style>
```
```HTML
<div ref="scrollDom" style="height: 100%;overflow: hidden">
  <div>
      <!--需要滚动的dom-->
  </div>
</div>
```
> 注：scrollDom必须为高度固定，且为overflow：hidden
```javascript
import BScroll from 'better-scroll'

mounted(){
  let wrapper = this.$refs.scrollDom
  this.$nextTick(() => {
    this.scroll = new BScroll(wrapper, {click: true})
  })
},
```

#### 路由 - [vue-router](https://router.vuejs.org/zh-cn/)

#### 状态管理 - [vuex](https://vuex.vuejs.org/zh-cn/)

#### http插件 - [axios](https://github.com/imcvampire/vue-axios)

#### UI框架 - [mint-UI](http://mint-ui.github.io/)

#### mock模拟数据
[https://www.cnblogs.com/chen-cong/p/8001352.html](https://www.cnblogs.com/chen-cong/p/8001352.html)
1. 在mock.js添加对应的mock数据，如salt
2. 在/build/webpack.dev.conf.js
```
  var salt = appData.salt;

  //devServer内：
  before(app) {
    app.post('/api/salt', (req, res) => {
      res.json({
        errno: 0,
        data: salt
      })//接口返回json数据，上面配置的数据seller就赋值给data请求后调用
    })
}
```

## 目录结构

```
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置
├── node_modules       // npm包资源
├── dist               // 项目build目录
├── static             // 静态资源目录
├── src                // 生产目录
│   ├── api             // http接口
│   ├── assets          // 图片/css资源/js
│   ├── components      // 各种公用组件
│   ├── lib             // css/js库
│   ├── page	            // router页面
│        ├── Home.vue              // 页面 - 一个页面对应一个route
│   ├── router	          // router配置文件
│   ├── store	          // vuex配置文件
│    ├── App.vue              // 主页面 
│    └── main.js           // Webpack 预编译入口
├── .babelrc           // babel配置文件
├── .editorconfig      // 编辑器配置文件
├── .eslintrc.js       // eslint配置文件
├── .gitignore         // 忽略上传git配置
├── mock.json            // mock数据json文件
├── index.html         // 默认index入口
├── package.json       // 项目配置文件
```

> 注： 本project暂未使用eslint
>>>>>>> 初次导入
