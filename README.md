# Sibo Xiao的个人网页

这是一个模拟终端界面的个人网页项目，可以部署到GitHub Pages上。

## 项目特点

- 模拟终端界面
- ASCII艺术字展示名字
- 交互式命令行体验
- 页面导航功能

## 文件结构

- `index.html` - 主页面，模拟终端界面
- `styles.css` - 样式文件
- `script.js` - JavaScript功能实现
- `page-a.html` - 页面A

## 部署到GitHub Pages步骤

1. 在GitHub上创建一个新仓库（例如：`username.github.io`）

2. 初始化本地Git仓库并将代码推送到GitHub：

   ```bash
   git init
   git add .
   git commit -m "初始提交"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. 在GitHub仓库设置中启用GitHub Pages：
   - 进入仓库页面
   - 点击"Settings"
   - 滚动到"GitHub Pages"部分
   - 在"Source"下拉菜单中选择"main"分支
   - 点击"Save"

4. 等待几分钟后，你的网站将在`https://你的用户名.github.io/你的仓库名`上可访问

## 自定义内容

你可以通过修改以下文件来自定义你的个人网页：

- 在`index.html`中修改ASCII艺术字和其他内容
- 在`script.js`中添加更多命令和功能
- 在`page-a.html`中添加你想展示的内容
- 在`styles.css`中自定义样式

## 本地预览

你可以通过以下方式在本地预览网站：

1. 使用VS Code的Live Server扩展
2. 使用Python的简易HTTP服务器：`python -m http.server`
3. 使用Node.js的http-server：`npx http-server`

然后在浏览器中访问`http://localhost:8000`或相应端口。 