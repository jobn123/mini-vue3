
## 项目初始化

```shell
mkdir mini-vue3 && cd mini-vue3

yarn init -y
```

## jest 安装

```shell
yard add jest -D
```

## 测试jest

* 创建index.test.js
* 编写测试文件
  ```javascript
    test('adds 1 + 2 to equal 3', () => {
      expect(true).toBe(true);
    });
  ```
* 在vscode中安装`Jest`、`Jest Runner` 插件
* 在package.json的script中添加测试命令
  ```json
    "scripts": {
      "test": "jest"
    },
  ```
  * 之后就可以通过 `yarn test` 来运行测试用例了

## 集成typescript

* yarn add typescript -D
* npx tsc --init 生成ts配置文件
* yarn add @types/jest -D
* 打开ts.config.json
  ```json
    "types": ["jest"],
  ```

## 支持esm

jest 默认是在node环境中运行也就是commonjs规范，但是我们现在前端开发基本都是用esmodule的方式。所以需要借助babel将我们的代码转换成commonjs后在

* 将ts.config.json 中 `noImplicitAny`设为false 允许我们使用any

* 配置babel
  * yarn add --dev babel-jest @babel/core @babel/preset-env
  * 可以在工程的根目录下创建一个babel.config.js文件用于配置与你当前Node版本兼容的Babel
  ```js
    module.exports = {
      presets: [['@babel/preset-env', {targets: {node: 'current'}}]],
    };
  ```
  * 结合ts yarn add --dev @babel/preset-typescript
  * 修改babel.config.js
  ```js
    module.exports = {
      presets: [
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-typescript',
      ],
    };
  ```