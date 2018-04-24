# iMusic

一个基于 `React` 与 `electron` 开发的音乐App。

感谢 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供的 API。

## 项目结构

```
├── config // 项目打包配置
├── mock // 模拟数据
├── src
│    ├── actions
│    ├── api // 请求接口
│    ├── assets // 公用静态资源
│    ├── components // (Redux)组件
│    ├── containers // (Redux)容器
│    └── reducers
├── resource // 后期可能调整该目录
├── dist
└── release
```

## 预览

- [在线地址](https://leezng.github.io/iMusic/) (使用模拟数据，与真实App存在一定差别。)

## 开发者

```
# download
git clone git@github.com:leezng/iMusic.git

# install dependencies
yarn

# run development environment
yarn dev
```

## LICENSE

[MIT](./LICENSE)
