/**
 * 侧边栏模块
 * 管理左侧文章列表和侧边栏收缩
 */
const Sidebar = {
    elements: {
        sidebar: null,
        postList: null,
        toggleBtn: null
    },

    postsTree: [],

    init: function() {
        this.elements.sidebar = document.getElementById('sidebar');
        this.elements.postList = document.getElementById('post-list');
        this.elements.toggleBtn = document.getElementById('toggle-sidebar');

        this.bindEvents();
        this.restoreState();
    },

    bindEvents: function() {
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle: function() {
        const sidebar = this.elements.sidebar;
        const btn = this.elements.toggleBtn;

        sidebar.classList.toggle('collapsed');

        if (sidebar.classList.contains('collapsed')) {
            btn.textContent = '▶';
            btn.title = '展开侧边栏';
        } else {
            btn.textContent = '◀';
            btn.title = '收起侧边栏';
        }

        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    },

    restoreState: function() {
        if (window.innerWidth <= 768) return;

        if (localStorage.getItem('sidebarCollapsed') === 'true') {
            this.elements.sidebar.classList.add('collapsed');
            if (this.elements.toggleBtn) {
                this.elements.toggleBtn.textContent = '▶';
                this.elements.toggleBtn.title = '展开侧边栏';
            }
        }
    },

    setPostsTree: function(tree) {
        this.postsTree = tree;
        this.render();
    },

    render: function() {
        this.elements.postList.innerHTML = '';
        this.renderItems(this.postsTree, this.elements.postList);
    },

    renderItems: function(items, container) {
        items.forEach(item => {
            const li = document.createElement('li');

            if (item.type === 'folder') {
                li.className = 'folder';

                const toggle = document.createElement('div');
                toggle.className = 'folder-toggle';
                toggle.innerHTML = `<span class="folder-icon">📁</span><span class="folder-name">${item.name}</span>`;

                toggle.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    li.classList.toggle('open');
                    const icon = toggle.querySelector('.folder-icon');
                    icon.textContent = li.classList.contains('open') ? '📂' : '📁';
                };

                li.appendChild(toggle);

                if (item.children && item.children.length > 0) {
                    const childUl = document.createElement('ul');
                    childUl.className = 'folder-children';
                    this.renderItems(item.children, childUl);
                    li.appendChild(childUl);
                }
            } else {
                li.className = 'file';
                const a = document.createElement('a');
                a.href = '#' + item.path;
                a.innerHTML = `<span class="file-icon">📄</span><span class="file-name">${item.title}</span>`;
                a.dataset.path = item.path;

                a.onclick = () => {
                    this.updateActiveLink(item.path);
                    if (window.innerWidth <= 768) {
                        Mobile.closeAll();
                    }
                };

                li.appendChild(a);
            }

            container.appendChild(li);
        });
    },

    expandParentFolders: function(filepath) {
        const parts = filepath.split('/');
        if (parts.length <= 1) return;

        const folderName = parts[0];
        this.elements.postList.querySelectorAll('li.folder').forEach(li => {
            const nameEl = li.querySelector('.folder-name');
            if (nameEl && nameEl.textContent === folderName) {
                li.classList.add('open');
                const icon = li.querySelector('.folder-icon');
                if (icon) icon.textContent = '📂';
            }
        });
    },

    updateActiveLink: function(filepath) {
        this.elements.postList.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
        });

        if (filepath) {
            const activeLink = this.elements.postList.querySelector(`a[data-path="${filepath}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    },

    showError: function(message) {
        this.elements.postList.innerHTML = `<li class="error">${message}</li>`;
    }
};
