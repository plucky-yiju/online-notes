/**
 * 移动端适配模块
 * 处理移动端菜单和响应式行为
 */
const Mobile = {
    elements: {
        sidebar: null,
        tocSidebar: null,
        overlay: null,
        menuBtn: null,
        tocBtn: null,
        themeBtn: null
    },

    init: function() {
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.tocSidebar = document.getElementById('toc-sidebar');
        this.elements.overlay = document.getElementById('mobile-overlay');
        this.elements.menuBtn = document.getElementById('mobile-menu-btn');
        this.elements.tocBtn = document.getElementById('mobile-toc-btn');
        this.elements.themeBtn = document.getElementById('mobile-theme-btn');

        this.bindEvents();
    },

    bindEvents: function() {
        if (this.elements.menuBtn) {
            this.elements.menuBtn.addEventListener('click', () => this.toggleMenu());
        }

        if (this.elements.tocBtn) {
            this.elements.tocBtn.addEventListener('click', () => this.toggleToc());
        }

        if (this.elements.themeBtn) {
            this.elements.themeBtn.addEventListener('click', () => {
                const themePanel = document.getElementById('theme-panel');
                if (themePanel) {
                    themePanel.classList.toggle('show');
                }
            });
        }

        if (this.elements.overlay) {
            this.elements.overlay.addEventListener('click', () => this.closeAll());
        }
    },

    toggleMenu: function() {
        this.closeToc();
        const sidebar = this.elements.sidebar;
        const overlay = this.elements.overlay;

        sidebar.classList.toggle('mobile-open');
        if (overlay) {
            overlay.classList.toggle('show');
        }
    },

    toggleToc: function() {
        this.closeMenu();
        const tocSidebar = this.elements.tocSidebar;
        const overlay = this.elements.overlay;

        if (tocSidebar) {
            tocSidebar.classList.toggle('mobile-open');
            if (overlay) {
                overlay.classList.toggle('show');
            }
        }
    },

    closeMenu: function() {
        const sidebar = this.elements.sidebar;
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
    },

    closeToc: function() {
        const tocSidebar = this.elements.tocSidebar;
        if (tocSidebar) {
            tocSidebar.classList.remove('mobile-open');
        }
    },

    closeAll: function() {
        this.closeMenu();
        this.closeToc();
        const overlay = this.elements.overlay;
        if (overlay) {
            overlay.classList.remove('show');
        }
    },

    isMobile: function() {
        return window.innerWidth <= 768;
    }
};
