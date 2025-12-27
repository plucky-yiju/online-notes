/**
 * TOC目录模块
 * 管理右侧文章目录
 */
const TOC = {
    elements: {
        tocSidebar: null,
        tocNav: null,
        toggleBtn: null
    },

    init: function() {
        this.elements.tocSidebar = document.getElementById('toc-sidebar');
        this.elements.tocNav = document.getElementById('toc-nav');
        this.elements.toggleBtn = document.getElementById('toggle-toc');

        this.bindEvents();
        this.restoreState();
    },

    bindEvents: function() {
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', () => this.toggle());
        }
    },

    toggle: function() {
        const toc = this.elements.tocSidebar;
        const btn = this.elements.toggleBtn;

        toc.classList.toggle('collapsed');

        if (toc.classList.contains('collapsed')) {
            btn.textContent = '◀';
            btn.title = '展开目录';
        } else {
            btn.textContent = '▶';
            btn.title = '收起目录';
        }

        localStorage.setItem('tocCollapsed', toc.classList.contains('collapsed'));
    },

    restoreState: function() {
        if (window.innerWidth <= 768) return;

        if (localStorage.getItem('tocCollapsed') === 'true') {
            this.elements.tocSidebar.classList.add('collapsed');
            if (this.elements.toggleBtn) {
                this.elements.toggleBtn.textContent = '◀';
                this.elements.toggleBtn.title = '展开目录';
            }
        }
    },

    generate: function(contentElement) {
        const tocNav = this.elements.tocNav;
        if (!tocNav) return;

        tocNav.innerHTML = '';

        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

        if (headings.length === 0) {
            tocNav.innerHTML = '<p class="toc-empty">暂无目录</p>';
            return;
        }

        const tree = this.buildTree(headings);
        const ul = document.createElement('ul');
        ul.className = 'toc-list';
        this.renderTree(tree, ul, true);
        tocNav.appendChild(ul);
    },

    buildTree: function(headings) {
        const tree = [];
        const stack = [{ level: 0, children: tree }];

        headings.forEach((heading) => {
            const level = parseInt(heading.tagName.charAt(1));
            const node = {
                id: heading.id,
                text: heading.textContent,
                level: level,
                children: []
            };

            while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(node);
            stack.push(node);
        });

        return tree;
    },

    renderTree: function(nodes, container, defaultOpen) {
        nodes.forEach(node => {
            const li = document.createElement('li');
            li.className = `toc-item toc-level-${node.level}`;

            if (node.children.length > 0) {
                li.classList.add('toc-folder');
                if (defaultOpen) {
                    li.classList.add('open');
                }

                const toggle = document.createElement('span');
                toggle.className = 'toc-toggle-icon';
                toggle.textContent = defaultOpen ? '▼' : '▶';
                toggle.onclick = (e) => {
                    e.stopPropagation();
                    li.classList.toggle('open');
                    toggle.textContent = li.classList.contains('open') ? '▼' : '▶';
                };

                const a = document.createElement('a');
                a.href = '#' + node.id;
                a.textContent = node.text;
                a.dataset.target = node.id;
                a.onclick = (e) => {
                    e.preventDefault();
                    document.getElementById(node.id).scrollIntoView({ behavior: 'smooth' });
                    this.highlightItem(node.id);
                };

                const header = document.createElement('div');
                header.className = 'toc-item-header';
                header.appendChild(toggle);
                header.appendChild(a);
                li.appendChild(header);

                const childUl = document.createElement('ul');
                childUl.className = 'toc-children';
                this.renderTree(node.children, childUl, defaultOpen);
                li.appendChild(childUl);
            } else {
                const a = document.createElement('a');
                a.href = '#' + node.id;
                a.textContent = node.text;
                a.dataset.target = node.id;
                a.onclick = (e) => {
                    e.preventDefault();
                    document.getElementById(node.id).scrollIntoView({ behavior: 'smooth' });
                    this.highlightItem(node.id);
                };
                li.appendChild(a);
            }

            container.appendChild(li);
        });
    },

    clear: function() {
        if (this.elements.tocNav) {
            this.elements.tocNav.innerHTML = '<p class="toc-empty">选择文章查看目录</p>';
        }
    },

    highlightItem: function(targetId) {
        const tocItems = document.querySelectorAll('.toc-item a');

        if (targetId) {
            tocItems.forEach(item => {
                if (item.dataset.target === targetId) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
            return;
        }
    },

    highlightOnScroll: function(contentElement) {
        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const tocItems = document.querySelectorAll('.toc-item a');
        let currentHeading = null;

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top <= 100) {
                currentHeading = heading;
            }
        });

        tocItems.forEach(item => {
            if (currentHeading && item.dataset.target === currentHeading.id) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
};
