/**
 * 笔记博客主应用入口
 * 整合所有模块，协调各组件工作
 */
(function() {
    'use strict';

    const App = {
        elements: {
            content: null,
            contentWrapper: null
        },

        init: function() {
            this.elements.content = document.getElementById('content');
            this.elements.contentWrapper = document.querySelector('.content-wrapper');

            // 初始化各模块
            Markdown.init(this.elements.content);
            Sidebar.init();
            TOC.init();
            Mobile.init();

            // 初始化路由
            Router.init((path) => this.onRouteChange(path));

            // 绑定滚动事件
            this.bindScrollEvent();

            // 绑定主题面板关闭按钮
            this.bindThemePanelClose();

            // 加载文章列表
            this.loadPosts();
        },

        bindScrollEvent: function() {
            if (this.elements.contentWrapper) {
                this.elements.contentWrapper.addEventListener('scroll', () => {
                    TOC.highlightOnScroll(this.elements.content);
                });
            }
        },

        bindThemePanelClose: function() {
            const themePanelClose = document.getElementById('theme-panel-close');
            if (themePanelClose) {
                themePanelClose.addEventListener('click', () => {
                    document.getElementById('theme-panel').classList.remove('show');
                });
            }
        },

        loadPosts: function() {
            Loader.loadPostsTree()
                .then(tree => {
                    Sidebar.setPostsTree(tree);
                    Router.handleRouting();
                })
                .catch(error => {
                    Sidebar.showError(error.message);
                    Markdown.showWelcome();
                });
        },

        onRouteChange: function(path) {
            if (path) {
                this.loadPost(path);
                Sidebar.updateActiveLink(path);
                Sidebar.expandParentFolders(path);
            } else {
                Markdown.showWelcome();
                Sidebar.updateActiveLink(null);
                TOC.clear();
            }
        },

        loadPost: function(filepath) {
            Loader.loadPost(filepath)
                .then(markdown => {
                    Markdown.render(markdown);
                    TOC.generate(this.elements.content);
                })
                .catch(error => {
                    Markdown.showError(error.message);
                    TOC.clear();
                });
        }
    };

    // 启动应用
    document.addEventListener('DOMContentLoaded', () => App.init());
})();
