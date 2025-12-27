/**
 * Markdown渲染模块
 * 处理Markdown解析和代码高亮
 */
const Markdown = {
    contentElement: null,

    init: function(contentElement) {
        this.contentElement = contentElement;
        this.configureMarked();
    },

    configureMarked: function() {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
    },

    render: function(markdown) {
        this.contentElement.innerHTML = marked.parse(markdown);
        this.highlightCode();
        this.addHeadingIds();
        this.enhanceCodeBlocks();
    },

    highlightCode: function() {
        this.contentElement.querySelectorAll('pre code').forEach(block => {
            hljs.highlightElement(block);
        });
    },

    addHeadingIds: function() {
        this.contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading, index) => {
            if (!heading.id) {
                heading.id = 'heading-' + index;
            }
        });
    },

    enhanceCodeBlocks: function() {
        const preElements = Array.from(this.contentElement.querySelectorAll('pre'));
        const self = this;

        // 折叠配置
        const config = BlogConfig.codeBlock || {};
        const foldable = config.foldable !== false;
        const foldThreshold = config.foldThreshold || 15;

        preElements.forEach(pre => {
            if (pre.closest('.code-block')) {
                return;
            }

            const code = pre.querySelector('code');
            if (!code) return;

            const rawCode = code.textContent;
            const langMatch = code.className.match(/language-(\w+)/);
            const lang = langMatch ? langMatch[1] : '';

            const lines = rawCode.split('\n');
            if (lines[lines.length - 1] === '') {
                lines.pop();
            }
            const lineCount = lines.length;

            // 超过foldThreshold行则折叠，折叠后显示foldThreshold行
            const shouldFold = foldable && lineCount > foldThreshold;

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block';
            if (shouldFold) {
                wrapper.classList.add('code-block-foldable', 'code-block-folded');
                wrapper.style.setProperty('--folded-lines', foldThreshold);
            }

            // 创建工具栏
            const toolbar = document.createElement('div');
            toolbar.className = 'code-toolbar';

            // 左侧：语言标签
            if (lang) {
                const langLabel = document.createElement('span');
                langLabel.className = 'code-lang';
                langLabel.textContent = lang;
                toolbar.appendChild(langLabel);
            }

            // 右侧按钮容器
            const buttons = document.createElement('div');
            buttons.className = 'code-buttons';

            // 折叠按钮（如果需要）
            if (shouldFold) {
                const foldBtn = document.createElement('button');
                foldBtn.className = 'code-fold';
                foldBtn.setAttribute('data-folded', 'true');
                foldBtn.innerHTML = '<span class="fold-icon">▼</span><span class="fold-text">展开 ' + lineCount + ' 行</span>';
                foldBtn.addEventListener('click', function() {
                    const isFolded = this.getAttribute('data-folded') === 'true';
                    if (isFolded) {
                        wrapper.classList.remove('code-block-folded');
                        this.setAttribute('data-folded', 'false');
                        this.innerHTML = '<span class="fold-icon">▲</span><span class="fold-text">收起</span>';
                    } else {
                        wrapper.classList.add('code-block-folded');
                        this.setAttribute('data-folded', 'true');
                        this.innerHTML = '<span class="fold-icon">▼</span><span class="fold-text">展开 ' + lineCount + ' 行</span>';
                    }
                });
                buttons.appendChild(foldBtn);
            }

            // 复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-copy';
            copyBtn.innerHTML = '<span class="copy-icon">📋</span><span class="copy-text">复制</span>';
            copyBtn.addEventListener('click', function() {
                self.copyCode(rawCode, copyBtn);
            });
            buttons.appendChild(copyBtn);

            toolbar.appendChild(buttons);

            // 创建行号
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'line-numbers';
            for (let i = 1; i <= lineCount; i++) {
                const lineNum = document.createElement('span');
                lineNum.className = 'line-num';
                lineNum.textContent = i;
                lineNumbers.appendChild(lineNum);
            }

            // 创建代码内容容器
            const codeContent = document.createElement('div');
            codeContent.className = 'code-content';

            // 创建代码主体
            const codeBody = document.createElement('div');
            codeBody.className = 'code-body';
            codeBody.appendChild(lineNumbers);
            codeBody.appendChild(codeContent);

            // 组装wrapper
            wrapper.appendChild(toolbar);
            wrapper.appendChild(codeBody);

            // 在pre之前插入wrapper
            pre.parentNode.insertBefore(wrapper, pre);

            // 将pre移动到codeContent中
            codeContent.appendChild(pre);
        });
    },

    copyCode: function(code, button) {
        navigator.clipboard.writeText(code).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">已复制</span>';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
            const textarea = document.createElement('textarea');
            textarea.value = code;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            const originalHTML = button.innerHTML;
            button.innerHTML = '<span class="copy-icon">✓</span><span class="copy-text">已复制</span>';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
        });
    },

    showWelcome: function() {
        this.contentElement.innerHTML = `
            <div class="welcome">
                <h1>欢迎来到我的笔记博客</h1>
                <p>从左侧选择一篇文章开始阅读</p>
            </div>
        `;
    },

    showError: function(message) {
        this.contentElement.innerHTML = `
            <div class="welcome">
                <h1>😕 文章未找到</h1>
                <p>${message}</p>
            </div>
        `;
    }
};
