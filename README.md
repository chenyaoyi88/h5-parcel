## h5-parcel 单页配置

一般用来开发简单的单页（活动页）配置，用 ts 代替 js，用 sass 代替 css，配置了开发和打包生产两种模式。

开发模式：不会有任何文件生成。

生产模式：在此文件同级目录打包出 test（测试环境）/prod（生产环境） 文件夹，最终要上传到生产服务器的静态文件。

### 命令

##### 安装

```javascript
npm install

// 国内推荐 cnpm
cnpm install
```

##### 开发 / 启动项目：

```javascript
npm start
```

预设了 3 个环境，process.env.NODE_ENV 对应的环境值分别是：

- development   开发
- test          测试
- prodction     生产/正式    

打包各种环境：

```bash
# 打包测试环境
npm run build:test

# 打包生产/正式环境
npm run build:prod
```

##### 打包完后预览项目：

```bash

# 预览打包好的【测试】环境静态文件
npm run preview:test

# 预览打包好的【正式】环境静态文件
npm run preview:prod
```

##### 打包完后直接上传到 ftp：

注：填写了测试环境 ftp 配置的 config.ftp.test.json 和生产环境的 ftp 配置的 config.ftp.prod.json 自行准备在 package.json 同级根目录下，不要忘记在 .gitignore 中添加忽略这两个文件，格式如下：

```json
{
  "host": "主机",
  "user": "用户名",
  "password": "密码"
}
```

```bash

# 打包【测试】环境静态文件，然后直接上传到测试环境 ftp
npm run upload:test

# 打包【生产】环境静态文件，然后直接上传到生产环境 ftp（建议手动上传或者推送代码到 master 分支用 jekins 发布）
npm run upload:prod
```

##### 打包测试环境代码并使用 puppeteer 进行界面自动化测试：

```bash
# 测试之前先安装测试工具（默认不安装，因为太大，puppeteer 安装里面包含了 Chromium，120MB，国内推荐使用 cnpm 安装）
cnpm install puppeteer async-limiter -D
# 国内推荐使用 cnpm 安装

# 其实就是执行 node test/index.js
npm run test
```
 
### 目录结构描述

```bash
├── config                              # 上传配置
├── dist_prod/dist_test                 # 打包后的静态文件（打包成功后才会出现）
├── node_modules                        # 项目依赖包
├── src                                 # 开发目录
│   ├── component                       # 组件（迭代后单独出来 import 引入）
│   ├── images                          # 图片文件
│   ├── sass                            # scss 样式文件
│   ├── ts                              # ts 文件
│   ├── favicon.ico                     # 网站图标
│   └── index.html                      # 单页模版
├── .babelrc                            # js兼容处理
├── config.ftp.test.json                # 测试环境 ftp 上传配置
├── config.ftp.prod.json                # 生产环境 ftp 上传配置
├── config.info.json                    # 项目信息
├── cssnano.config.js                   # cssnano 额外配置
├── imagemin.config.js                  # 图片压缩配置（目前是自己写的后期处理）
├── index.d.ts                          # 项目声明文件
├── package.json                        # 项目说明文件
├── postcss.config.js                   # postcss 配置文件
├── README.md                           # 此文件
├── tsconfig                            # ts 配置文件
└── tslint.json                         # ts 编码规范文件
```

### 存在问题

- 暂无不能自定义输入文件有自定义文件夹（https://github.com/parcel-bundler/parcel/pull/745）
- 暂时没有针对这个工具的图片压缩插件，parcel-plugin-imagemin 有BUG会报错，因此自行在打包完成后添加了图片优化
