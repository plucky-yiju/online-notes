/**
 * 路由模块
 * 处理URL hash路由
 */
const Router = {
    currentPath: null,

    init: function(onRouteChange) {
        this.onRouteChange = onRouteChange;
        window.addEventListener('hashchange', () => this.handleRouting());
    },

    handleRouting: function() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.currentPath = decodeURIComponent(hash);
            this.onRouteChange(this.currentPath);
        } else {
            this.currentPath = null;
            this.onRouteChange(null);
        }
    },

    navigate: function(path) {
        window.location.hash = path;
    },

    getCurrentPath: function() {
        return this.currentPath;
    }
};
