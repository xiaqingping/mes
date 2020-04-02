## MOCK 数据目录

系统级接口 Mock 数据时，根据后端服务，直接在 mock 目录下，新建对应的 `js` 文件。

项目级接口 Mock 数据时，应先在 mock 目录下新建一个对应的项目目录。比如 业务伙伴项目（bp），应先新建一个 `bp` 文件夹，然后再按照后端服务新建对应的 `js` 文件。

查看[UmiJS 文档](https://umijs.org/zh-CN/docs/mock)来学习如何 Mock 数据。

利用 [Mockjs](http://mockjs.com/) 辅助生成模拟数据，可以提高 Mock 数据的能力。

### 新建 Mock 数据文件

MOCK 接口应该根据所属项目，建立新的文件夹和 js 文件。

比如：BP 项目，应在 mock 文件夹下新建一个名为 `bp` 的文件夹，然后根据页面用到的各个服务的接口，再新建对应名字的 `js` 文件。比如你会用到 `businessPartners` 服务的接口，那么就应该在 `mock/bp/` 下新建 `businessPartners.js` 文件。

不过，如果 MOCK 的接口为全局接口，如登录，获取验证码等，可以直接在 mock 根目录下，新建对应服务的 js 文件。

### 例子

如果要 MOCK `/user/123456` 这个接口。

1. 新建一个 `user.js` 文件。调用这个接口的项目，决定了这个文件的位置。如果是全局调用，就放在 `mock/` 目录下，如果是 BP 项目调用，就放在 `mock/bp/` 目录下。
2. 每个 MOCK 文件都会导出一个 JS 对象。对象中的 `key` 为接口的 `方法名 地址`，`value` 为接口应返回的数据。
   ```js
   export default {
     'GET /user/123456': {
       name: '老王',
       age: 27,
     },
   };
   ```
3. 使用

   - 可以直接引入 `axios`，然后使用 `axios('/user/123456').then(res => console.log(res))`。
   - 通过封装好的接口方法。

     ```js
     import request from '@/utils/request';

     export default {
       getUser() {
         return request('/user/123456');
       },
     };
     ```

     上面的 getUser 方法，会通过封装好的一个 request 方法，将接口地址 `/user/123456` 变为 `http://devmes.sangon.com:30443/api/user/123456`（baseURL + requestURL），这样会造成 MOCK 接口和请求接口不一致，然后导致 MOCK 失败。因此，应对调用接口做一下修改：

     ```js
     import request from '@/utils/request';

     export default {
       getUser() {
         // url 前添加了 /mock，然后 request 方法会根据这个做出对应的处理。
         return request('/mock/user/123456');
       },
     };
     ```

### 注意

Mock 只有在开发时才有用，项目 build 后无法使用。而且如果你使用了第二种方法（为接口前添加 `/mock` 标记），那一定要记得在后端接口可以请求后，将这个标记删除掉。
