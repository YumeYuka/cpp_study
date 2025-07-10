import { defineConfig } from 'vitepress'

import { devDependencies } from '../../package.json'
import markdownItTaskCheckbox from 'markdown-it-task-checkbox'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid';

import { usePosts } from './theme/untils/permalink';
const { rewrites } = await usePosts();

export default defineConfig({
  lang: 'zh-CN',
  title: "C++ 学习指南",
  description: "C++ 入门",
  rewrites,

  // #region fav
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  // #endregion fav

  base: '/', //网站部署到github的vitepress这个仓库里

  // cleanUrls:true, //开启纯净链接无html

  //启用深色模式
  // appearance: 'dark',


  //markdown配置
  markdown: {
    //行号显示
    lineNumbers: true,

    // toc显示一级标题
    toc: {level: [1,2,3]},

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[\!\!code/g, '[!code')
        }
      }
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true
    },

    config: (md) => {
      // 组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`
        return htmlResult
      },

      // 代码组中添加图片
      md.use((md) => {
        const defaultRender = md.render
        md.render = (...args) => {
          const [content, env] = args
          const currentLang = env?.localeIndex || 'root'
          const isHomePage = env?.path === '/' || env?.relativePath === 'index.md'  // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
          }
          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          if (currentLang === 'root') {
            defaultContent = defaultContent.replace(/NOTE/g, '提醒')
              .replace(/TIP/g, '建议')
              .replace(/IMPORTANT/g, '重要')
              .replace(/WARNING/g, '警告')
              .replace(/CAUTION/g, '注意')
          } else if (currentLang === 'ko') {
            // 韩文替换
            defaultContent = defaultContent.replace(/NOTE/g, '알림')
              .replace(/TIP/g, '팁')
              .replace(/IMPORTANT/g, '중요')
              .replace(/WARNING/g, '경고')
              .replace(/CAUTION/g, '주의')
          }
          // 返回渲染的内容
          return defaultContent
        }

        // 获取原始的 fence 渲染规则
        const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content);

        // 重写 fence 渲染规则
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx];
          const info = token.info.trim();

          // 判断是否为 md:img 类型的代码块
          if (info.includes('md:img')) {
            // 只渲染图片，不再渲染为代码块
            return `<div class="rendered-md">${md.render(token.content)}</div>`;
          }

          // 其他代码块按默认规则渲染（如 java, js 等）
          return defaultFence(tokens, idx, options, env, self);
        };
      })
      
      md.use(groupIconMdPlugin) //代码组图标
      md.use(markdownItTaskCheckbox) //todo
      md.use(MermaidMarkdown); 

    }

  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ts: localIconLoader(import.meta.url, '../public/svg/typescript.svg'), //本地ts图标导入
          md: localIconLoader(import.meta.url, '../public/svg/md.svg'), //markdown图标
          css: localIconLoader(import.meta.url, '../public/svg/css.svg'), //css图标
          js: 'logos:javascript', //js图标
        },
      }),
      [MermaidPlugin()]
    ]as any,
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid'],
    },
  },

  lastUpdated: true, //此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释

  //主题配置
  themeConfig: {
    //左上角logo
    logo: '/logo.svg',
    //logo: 'https://vitejs.cn/vite3-cn/logo-with-shadow.png', //远程引用
    //siteTitle: false, //标题隐藏

    //设置站点标题 会覆盖title
    //siteTitle: 'Hello World',

    //编辑本页
    editLink: {
      pattern: 'https://github.com/YumeYuka/cpp_study/docs/:path', // 改成自己的仓库
      text: '在GitHub编辑本页'
    },

    //上次更新时间
    lastUpdated: {
      text: '上次更新时间',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },

    //导航栏
    nav: [
      { text: '首页', link: '/' },
      {
        text: '指南',
        items: [
          {
            text: '基础语法',
            collapsed: false,
            items: [
              { text: '导航', link: '/guide/README' },
              { text: '开始', link: '/guide/开始' },
              { text: '变量和基本类型', link: '/guide/变量和基本类型' },
              { text: '字符串、向量和数组', link: '/guide/字符串、向量和数组' },
              { text: '表达式', link: '/guide/表达式' },
              { text: '语句', link: '/guide/语句' },
              { text: '函数', link: '/guide/函数' },
              { text: '类', link: '/guide/类' },
            ],
          },
          {
            text: '进阶学习',
            collapsed: false,
            items: [
              { text: 'IO库', link: '/guide/IO库' },
              { text: '顺序容器', link: '/guide/顺序容器' },
              { text: '泛型算法', link: '/guide/泛型算法' },
              { text: '关联容器', link: '/guide/关联容器' },
              { text: '动态内存', link: '/guide/动态内存' },
              { text: '拷贝控制', link: '/guide/拷贝控制' },
              { text: '操作重载与类型转换', link: '/guide/操作重载与类型转换' }
            ],
          },
          {
            text: '高级特性',
            collapsed: false,
            items: [
              { text: '面向对象程序设计', link: '/guide/面向对象程序设计' },
              { text: '模板与泛型编程', link: '/guide/模板与泛型编程' },
              { text: '标准库特殊设施', link: '/guide/标准库特殊设施' },
                  { text: '用于大型程序的工具', link: '/guide/用于大型程序的工具' },
              { text: '特殊工具与技术', link: '/guide/特殊工具与技术' },
            ],
          },
        ],
      },
      { text: `VitePress ${devDependencies.vitepress.replace('^', '')}`, link: 'https://vitepress.dev/zh/', noIcon: true },
    ],


    //侧边栏
    sidebar: [
      {
        text: '基础语法',
        collapsed: false,
        items: [
          { text: '导航', link: '/guide/README' },
          { text: '开始', link: '/guide/开始' },
          { text: '变量和基本类型', link: '/guide/变量和基本类型' },
          { text: '字符串、向量和数组', link: '/guide/字符串、向量和数组' },
          { text: '表达式', link: '/guide/表达式' },
          { text: '语句', link: '/guide/语句' },
          { text: '函数', link: '/guide/函数' },
          { text: '类', link: '/guide/类' },
        ],
      },
      {
        text: '进阶学习',
        collapsed: false,
        items: [
          { text: 'IO库', link: '/guide/IO库' },
          { text: '顺序容器', link: '/guide/顺序容器' },
          { text: '泛型算法', link: '/guide/泛型算法' },
          { text: '关联容器', link: '/guide/关联容器' },
          { text: '动态内存', link: '/guide/动态内存' },
          { text: '拷贝控制', link: '/guide/拷贝控制' },
          { text: '操作重载与类型转换', link: '/guide/操作重载与类型转换' }
        ],
      },
      {
        text: '高级特性',
        collapsed: false,
        items: [
          { text: '面向对象程序设计', link: '/guide/面向对象程序设计' },
          { text: '模板与泛型编程', link: '/guide/模板与泛型编程' },
          { text: '标准库特殊设施', link: '/guide/标准库特殊设施' },
              { text: '用于大型程序的工具', link: '/guide/用于大型程序的工具' },
          { text: '特殊工具与技术', link: '/guide/特殊工具与技术' },
        ],
      },
    ],



    search: {
       provider: "local",
        root: {
            translations: {
                button: {
                    buttonText: "搜索文档",
                    buttonAriaLabel: "搜索文档",
                },
                modal: {
                    noResultsText: "无法找到相关结果",
                    resetButtonTitle: "清除查询条件",
                    footer: {
                        selectText: "选择",
                        navigateText: "切换",
                    },
                },
            },
        },
    },



    //社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/YumeYuka/cpp_study' }
    ],

    //手机端深浅模式文字修改
    darkModeSwitchLabel: '深浅模式',




    //页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023-${new Date().getFullYear()}`,
    },


    //侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',


    //大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲'
    },


    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

  },



})