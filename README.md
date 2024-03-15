# nextjs-blog-react-admin

## 简介

个人博客系统.包括博客页面(next.js),博客后台管理(React)和后端(node.js).本项目提供了一个简洁方便的博客方案,可以让发布和管理博客更加轻松.如果对项目有任何建议和想法,欢迎发起issue.

## 演示网站

后台管理演示网站: <https://admin.manfreddemoblog.top> (密码admin,请勿提交或修改数据)

博客演示网站: <https://www.manfreddemoblog.top/>

## 技术栈

**博客管理**:

- React 18.1.0
- React Router v6
- Ant Design 5.13.2
- Redux Toolkit
- redux-thunk
- axios
- echarts
- react-three-fiber
- react-simplemde-editor
- react-markdown
- CSS Modules

**后端**:

- JWT
- Express
- mongoose
- multer

**博客**:

- Next.js 12.2.5
- React 18.2.0
- CSS Modules
  
## 系统结构图

![系统结构图](https://user-images.githubusercontent.com/27950295/224519866-e5e5c052-1bf8-4d1e-9b25-766ffa92bb8b.PNG)
博客管理采用前后端分离的模式开发.前端使用react,antd搭建管理页面.因为后台管理不需要SEO,所以没有使用next.js.后端使用express.js框架构建的restful api,具有基本的增删改查功能,数据库使用mongoDB.博客网站使用next.js,并且是静态站点.这样的好处是SEO友好,页面加载速度快而且服务器压力小.在管理页面修改或者发布博客文章后,后端会请求next.js重新构建部分静态页面,使得博客页面的内容是最新的.其实也可以使用SSR(服务端渲染)方案,但担心服务器压力过大而没有选择此方案.next.js的服务端会从数据库中直接获取博客数据,然后根据数据编译出静态的html页面.因为这个过程是在服务端进行的,所以是安全的.博客管理上传的图片会保存到服务器本地.博客页面具有基本的评论功能,还在完善中.

## 功能和特点

- 博客管理和博客页面都完成了移动端适配.
- 博客页面经行了特定的SEO优化和性能优化,lighthouse接近满分.
- 管理页面可以对文章,分类和标签进行增删改查操作,文章可以设置为草稿来隐藏.
- 管理页面的博客列表中可以下载文章的md文件,文件中的Front-matter符合[hexo格式](https://hexo.io/zh-cn/docs/front-matter.html).
- 管理页面可以添加,删除和修改友链.
- 博客页面可以发布评论.管理页面可以查看最近评论和每篇博客的评论以及删除评论.
- 管理页面可以修改博客站点的网站元信息.
- 管理页面统计页使用react-three/fiber开发了3d词云,使用ECharts展示了过去30天博客动态的堆叠图.
- 管理页面使用markdown编辑器,支持GFM,KaTeX,脚注,代码高亮和代码块行高亮,并且支持自动保存.
- 后端的api会对短时间的大量请求进行限流.
- 登录鉴权使用JWT方案.如果用户修改密码,之前发布的令牌将失效.
- 博客系统内带有图床,支持多图片和文件夹上传.

## 文件夹目录

- /admin-blog 博客后台管理
- /backend 后端
- /nextjs-blog 博客页面

## 拉取项目和安装依赖

- 拉取项目并在三个文件夹下分别安装依赖(提前安装好Node.js,**注意Node版本必须14以上**)

```bash
git clone https://github.com/ManfredMT/nextjs-blog-react-admin.git

cd nextjs-blog-react-admin/admin-blog
npm install

cd ../backend
npm install

cd ../nextjs-blog
npm install
```

- **安装mongoDB**

## 部署

如果只想搭建博客,可以跳过后面的[开发运行](#开发运行)章节.

- 在admin-blog目录下打包前端管理项目.
  
  ```bash
  npm run build
  ```

  打包后的管理前端项目全都放在build文件夹下.运行后端的生产模式会根据这个build包创建静态服务器.

- 在backend目录下根据.envexample创建.env文件,把`NODE_ENV`**设置为production**,修改`JWT_SECRET`和`MY_SECRET_TOKEN`.具体参考[.env文件配置说明](#env文件配置说明).

  ```bash
  mv .envexample .env
  //修改.env文件
  ```
  
  运行生产模式.
  
  ```bash
  npm start
  ```

  express.js运行在localhost:5000.
  实际部署的时候建议使用PM2来启动服务,而不是直接`npm start`.PM2是一个进程管理工具,可以很方便的管理node.js应用.
  安装PM2:

  ```bash
  sudo npm i pm2 -g
  ```

  使用PM2启动:

  ```bash
  pm2 start server.js --name httpServer
  ```

  `--name`后面是应用的名字,可以把httpServer改成其他名字.

- 在nextjs-blog目录下根据.envexample创建.env.local文件,修改`MY_SECRET_TOKEN`与backend目录下.env相同.其他的项除了`ANALYZE`都与backend**配置一致**.具体参考[.env文件配置说明](#env文件配置说明).打包和运行生产模式.
  
  ```bash
  mv .envexample .env.local
  //修改.env.local文件
  ```

  打包和运行生产模式.

  ```bash
  npm run build
  npm start
  ```

  next.js运行在localhost:3001.
  或者使用PM2启动(推荐):

  ```bash
  pm2 start npm --name next -- start
  ```

这时项目只是运行在特殊的端口号上.可以使用nginx的反向代理让网站通过域名访问,网络上有很多教程,这里不再详细说明.**注意nginx服务器一定要配置X-Forwarded-For**,否则后端无法经行api请求的限流.如果没在.env配置`USER_PASSWORD`,部署之后**请修改默认的管理密码**.

## 开发运行

在三个文件夹下分别运行,可参考文件夹下package.json文件中scripts配置.

- 在backend目录下创建.env文件,可使用示例文件.envexample,具体配置可参考[.env文件配置说明](#env文件配置说明).然后运行开发模式,使用nodemon运行node.js后端,修改文件时自动重启服务.后端服务运行在localhost:5000.

    ```bash
    mv .envexample .env
    //修改.env文件
    npm run server
    ```

- 在admin-blog目录下,是博客管理的前端项目.开发时运行在localhost:3000.

    ```bash
    npm run start
    ```

- 在nextjs-blog目录下,是个人博客的项目.使用示例文件.envexample创建.env.local文件.具体配置可参考[.env文件配置说明](#env文件配置说明).next.js运行在localhost:3001.

    ```bash
    mv .envexample .env.local
    //修改.env.local文件
    npm run dev
    ```

## .env文件配置说明

在backend目录下需要有.env配置文件,并且nextjs-blog目录下需要有.env.local配置文件,才能让项目正常运行.项目中已经有.envexample示例文件作为参考.开发时可以不修改,部署时需要修改`NODE_ENV`,`JWT_SECRET`和`MY_SECRET_TOKEN`三项,其他的默认设置即可.下面详细说明每一项的含义.

/backend目录下的.env文件

- `NODE_ENV`项代表后端运行的模式,可以设置为development(开发)或者production(生产).**请在admin-blog目录下完成打包后再设置为production,因为node.js在生产环境下会根据admin-blog目录下的build文件夹创建静态服务器.**
- `PORT`项代表node.js运行的端口,如果不设置将使用5000端口.不建议更改.
- `MONGO_URI`项代表MongoDB数据库的URL.如果是自己服务器上安装的,可以不用修改.如果使用了云数据库,按云厂家说明经行配置.一般不需要修改.
- `DB_NAME`项代表MongoDB数据库中使用的Database名称,可以设置其他值.一般不需要修改.
- `JWT_SECRET`代表JWT中的secret.**请务必自己修改成其它字符串!不要将secret泄漏给别人或者暴露出去!**
- `USER_NAME`代表初始化的管理用户名,不需要修改,**只有在第一次启动后端之前有用**.
- `USER_PASSWORD`代表初始的管理用户密码,如果没有修改,请在管理UI界面修改密码,**注意只有在第一次启动后端之前有用**.
- `MY_SECRET_TOKEN`代表next.js中revalidate api需要的令牌.**请修改成其他字符串,并且在nextjs-blog目录下.env.local里设置成一样的.**
- `NEXTJS_PORT`代表next.js运行的端口,不建议更改.
- `DEMO`代表是否为演示环境,数字0代表非演示环境,其他数字代表演示环境.搭建博客设置为0就可以,不需要修改.

/nextjs-blog目录下的.env.local文件

- `USER_NAME`与/backend目录下的.env文件值相同.
- `MONGODB_URI`与/backend目录下的.env文件值相同.
- `DB_NAME`与/backend目录下的.env文件值相同.
- `MY_SECRET_TOKEN`与/backend目录下的.env文件值相同.
- `PORT`代表后端的端口,与/backend目录下的.env文件值相同.
- `ANALYZE`代表是否开启bundle-analyzer(打包文件分析),如果设置为true,将会分析两次,一次是服务端的分析,一次是客户端的分析.
  
## 开源许可证

MIT
