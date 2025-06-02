document.addEventListener('DOMContentLoaded', () => {
    const terminalContent = document.getElementById('terminal-content');
    const commandHistory = document.getElementById('command-history');
    const commandInput = document.getElementById('command-input');

    // Color themes for terminal interactions
    const colorThemes = [
        { prompt: '#4da6ff', output: '#f0f0f0', error: '#ff5252', info: '#4da6ff', success: '#4caf50' },
        { prompt: '#50fa7b', output: '#f8f8f2', error: '#ff5555', info: '#8be9fd', success: '#50fa7b' },
        { prompt: '#ffb86c', output: '#f8f8f2', error: '#ff5555', info: '#8be9fd', success: '#50fa7b' },
        { prompt: '#ff79c6', output: '#f8f8f2', error: '#ff5555', info: '#8be9fd', success: '#50fa7b' },
        { prompt: '#bd93f9', output: '#f8f8f2', error: '#ff5555', info: '#8be9fd', success: '#50fa7b' },
        { prompt: '#f1fa8c', output: '#f8f8f2', error: '#ff5555', info: '#8be9fd', success: '#50fa7b' },
        { prompt: '#00b7c3', output: '#ffffff', error: '#ff4040', info: '#00b7c3', success: '#00c853' },
        { prompt: '#ff7043', output: '#f5f5f5', error: '#d50000', info: '#29b6f6', success: '#00c853' }
    ];
    
    // Current color theme index
    let currentThemeIndex = 0;
    
    // Function to get next color theme
    function getNextColorTheme() {
        const theme = colorThemes[currentThemeIndex];
        currentThemeIndex = (currentThemeIndex + 1) % colorThemes.length;
        return theme;
    }

    // Welcome message
    addOutput(`Welcome to Sibo Xiao's personal website!`, 'info');
    addOutput(`Type 'help' to see available commands.`, 'info');
    
    // Track if IPython is active
    window.isIPythonActive = false;
    
    // Command list - expose globally
    const commands = {
        'about': {
            description: 'About me',
            action: showAbout
        },
        'contact': {
            description: 'Contact information',
            action: showContact
        },
        'ls': {
            description: 'List available pages',
            action: showPages
        },
        'cd': {
            description: 'Navigate to specified page',
            action: navigateToPage
        },
        'ipython': {
            description: 'Start raw Python shell',
            action: startIPython
        },
        'whoami': {
            description: 'Show current user',
            action: showWhoami
        },
        'date': {
            description: 'Show current date and time',
            action: showDate
        },
        'theme': {
            description: 'Change terminal visual effect',
            action: function(interactionId, theme) {
                addOutput('Available terminal visual effects:', 'info', interactionId, theme);
                addOutput('Use the command "theme <number>" to apply the corresponding effect. Example: theme 5', '', interactionId, theme);
                addOutput('Type help to see other available commands', '', interactionId, theme);
            }
        },
        'help': {
            description: 'Display help information',
            action: showHelp
        },
        'clear': {
            description: 'Clear terminal',
            action: clearTerminal
        }
    };
    
    // Expose commands globally
    window.commands = commands;

    // Handle input commands
    commandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = commandInput.value.trim().toLowerCase();
            
            // Add command to history
            if (command) {
                // Get new color theme for this interaction
                const theme = getNextColorTheme();
                
                // Create interaction group with unique id
                const interactionId = Date.now().toString();
                const interactionGroup = document.createElement('div');
                interactionGroup.className = 'interaction-group';
                interactionGroup.dataset.interactionId = interactionId;
                commandHistory.appendChild(interactionGroup);
                
                // Add command line with new theme color
                const commandLine = document.createElement('div');
                commandLine.innerHTML = `<span class="prompt" style="color: ${theme.prompt}">user@visitor:~$</span> ${command}`;
                interactionGroup.appendChild(commandLine);
                
                // Execute command with this interaction id
                processCommand(command, interactionId, theme);
                
                // Clear input
                commandInput.value = '';
                
                // Scroll to bottom
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }
        }
    });

    // Command processor - maintain internal calls and global exposure
    function processCommand(command, interactionId, theme) {
        // Extract command name and parameters
        const parts = command.split(' ');
        const cmdName = parts[0];
        const args = parts.slice(1);
        
        if (commands[cmdName]) {
            // If command exists, execute the corresponding action function and pass parameters
            commands[cmdName].action(interactionId, theme, args);
        } else {
            addOutput(`bash: ${command}: command not found. Type 'help' to see available commands.`, 'error', interactionId, theme);
        }
    }
    
    // Expose processCommand globally
    window.processCommand = processCommand;

    // Add output to terminal - maintain internal calls and global exposure
    function addOutput(message, type = '', interactionId = null, theme = null) {
        const output = document.createElement('div');
        output.className = `output ${type}`;
        
        // Apply theme colors if provided
        if (theme) {
            switch(type) {
                case 'error':
                    output.style.color = theme.error;
                    break;
                case 'info':
                    output.style.color = theme.info;
                    break;
                case 'success':
                    output.style.color = theme.success;
                    break;
                default:
                    output.style.color = theme.output;
            }
        }
        
        output.textContent = message;
        
        // Add to specific interaction group if ID provided
        if (interactionId) {
            const group = document.querySelector(`.interaction-group[data-interaction-id="${interactionId}"]`);
            if (group) {
                group.appendChild(output);
                return;
            }
        }
        
        // Fallback to command history if no group found
        commandHistory.appendChild(output);
    }
    
    // Expose addOutput globally
    window.addOutput = addOutput;

    // Show help
    function showHelp(interactionId, theme) {
        addOutput('Available commands:', 'info', interactionId, theme);
        for (const [cmd, info] of Object.entries(commands)) {
            addOutput(`  ${cmd.padEnd(10)} - ${info.description}`, '', interactionId, theme);
        }
    }

    // Clear terminal
    function clearTerminal() {
        commandHistory.innerHTML = '';
    }
    
    // Show page list
    function showPages(interactionId, theme) {
        addOutput('Available pages:', '', interactionId, theme);
        addOutput('  photo', '', interactionId, theme);
    }

    // Navigate to specified page
    function navigateToPage(interactionId, theme, args) {
        if (!args || args.length === 0) {
            addOutput('Error: Please specify a page name. Example: cd photo', 'error', interactionId, theme);
            return;
        }

        const pageName = args[0].toLowerCase();
        
        if (pageName === 'photo') {
            navigateToPageA(interactionId, theme);
        } else {
            addOutput(`Error: Page '${pageName}' not found. Type 'ls' to see available pages.`, 'error', interactionId, theme);
        }
    }

    // Navigate to page A
    function navigateToPageA(interactionId, theme) {
        addOutput('Opening Photo page...', 'success', interactionId, theme);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        
        // Create floating window with Pixel Border style
        const floatingWindow = document.createElement('div');
        floatingWindow.className = 'floating-window terminal-pixel-border';
        
        // 设置足够大的尺寸以显示照片
        floatingWindow.style.width = '70%';
        floatingWindow.style.height = '85%';
        floatingWindow.style.maxWidth = '1000px';
        floatingWindow.style.maxHeight = '85vh';
        
        // Create window header
        const header = document.createElement('div');
        header.className = 'floating-window-header';
        
        // Window title
        const title = document.createElement('div');
        title.className = 'floating-window-title';
        title.textContent = 'Photo';
        
        // Control buttons
        const controls = document.createElement('div');
        controls.className = 'floating-window-controls';
        
        // Close button
        const closeBtn = document.createElement('div');
        closeBtn.className = 'floating-window-control';
        closeBtn.textContent = '✕';
        closeBtn.addEventListener('click', () => {
            floatingWindow.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(floatingWindow);
                document.body.removeChild(overlay);
            }, 300);
        });
        
        // Content area
        const content = document.createElement('div');
        content.className = 'floating-window-content';
        content.style.overflow = 'auto'; // 添加滚动功能
        content.style.padding = '20px';
        
        // Get Photo page content
        fetch('photo.html')
            .then(response => response.text())
            .then(html => {
                // Create temporary element to parse HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // Get page content area
                const pageContent = doc.querySelector('.content');
                if (pageContent) {
                    // 直接使用内容，包括图片画廊
                    content.innerHTML = pageContent.innerHTML;
                    
                    // 添加额外的样式确保图片在弹窗中也能正确显示
                    const styleElement = document.createElement('style');
                    styleElement.textContent = `
                        .floating-window .gallery {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            gap: 30px;
                            width: 100%;
                        }
                        
                        .floating-window .gallery-item {
                            width: 90%;
                            max-width: 700px;
                            height: auto;
                            aspect-ratio: 16/9;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-bottom: 0;
                        }
                        
                        .floating-window .gallery-item img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain;
                            background-color: #0f0f0f;
                        }
                    `;
                    floatingWindow.appendChild(styleElement);
                    
                    // 应用一些简单动画效果
                    const title = content.querySelector('h1');
                    const paragraph = content.querySelector('p');
                    const gallery = content.querySelector('.gallery');
                    
                    // 初始隐藏所有元素
                    if (title) title.style.opacity = '0';
                    if (paragraph) paragraph.style.opacity = '0';
                    if (gallery) gallery.style.opacity = '0';
                    
                    // 标题渐入效果
                    setTimeout(() => {
                        if (title) {
                            title.style.transition = 'opacity 0.8s ease';
                            title.style.opacity = '1';
                        }
                    }, 300);
                    
                    // 段落渐入效果
                    setTimeout(() => {
                        if (paragraph) {
                            paragraph.style.transition = 'opacity 0.8s ease';
                            paragraph.style.opacity = '1';
                        }
                    }, 800);
                    
                    // 画廊渐入效果
                    setTimeout(() => {
                        if (gallery) {
                            gallery.style.transition = 'opacity 1.2s ease';
                            gallery.style.opacity = '1';
                            
                            // 图片逐个显示动画
                            const items = gallery.querySelectorAll('.gallery-item');
                            items.forEach((item, index) => {
                                item.style.opacity = '0';
                                item.style.transform = 'translateY(20px)';
                                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                                
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                    item.style.transform = 'translateY(0)';
                                }, 1200 + (index * 200));
                            });
                        }
                    }, 1000);
                } else {
                    content.innerHTML = '<h1>Photo Gallery</h1><p>Content could not be loaded.</p>';
                }
            })
            .catch(error => {
                content.innerHTML = '<h1>Error</h1><p>Failed to load content: ' + error.message + '</p>';
            });
        
        // Assemble window
        controls.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(controls);
        floatingWindow.appendChild(header);
        floatingWindow.appendChild(content);
        document.body.appendChild(floatingWindow);
        
        // Add dragging functionality
        makeDraggable(floatingWindow, header);
        
        // Show window and overlay
        setTimeout(() => {
            overlay.classList.add('show');
            floatingWindow.classList.add('show');
        }, 10);
    }
    
    // Add draggable functionality
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // Get mouse position
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate mouse movement distance
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            // Stop movement
            document.onmouseup = null;
            document.onmousemove = null;
        }
        
        // Add touch support
        handle.addEventListener('touchstart', function(e) {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            
            const touchMove = function(e) {
                e.preventDefault();
                pos1 = pos3 - e.touches[0].clientX;
                pos2 = pos4 - e.touches[0].clientY;
                pos3 = e.touches[0].clientX;
                pos4 = e.touches[0].clientY;
                
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            };
            
            const touchEnd = function() {
                document.removeEventListener('touchmove', touchMove);
                document.removeEventListener('touchend', touchEnd);
            };
            
            document.addEventListener('touchmove', touchMove, { passive: false });
            document.addEventListener('touchend', touchEnd);
        }, { passive: false });
    }
    
    // Show about info
    function showAbout(interactionId, theme) {
        addOutput('=== About Me ===', 'info', interactionId, theme);
        addOutput('Junior at Zhejiang University, major in computer science', '', interactionId, theme);
    }
    
    // Show contact info
    function showContact(interactionId, theme) {
        addOutput('=== Contact Information ===', 'info', interactionId, theme);
        addOutput('Email: sibodotxiao@gmail.com', '', interactionId, theme);
        addOutput('GitHub: https://github.com/SeabirdShore', '', interactionId, theme);
    }
    
    // Show current user
    function showWhoami(interactionId, theme) {
        addOutput('visitor', '', interactionId, theme);
    }
    
    // Show current date
    function showDate(interactionId, theme) {
        addOutput(new Date().toString(), '', interactionId, theme);
    }

    // Start IPython shell using Skulpt
    function startIPython(interactionId, theme) {
        // Set IPython active flag
        window.isIPythonActive = true;
        
        // Create special IPython container
        const ipythonContainer = document.createElement('div');
        ipythonContainer.className = 'ipython-container';
        ipythonContainer.dataset.interactionId = interactionId;
        
        // Find current interaction group and add container
        const group = document.querySelector(`.interaction-group[data-interaction-id="${interactionId}"]`);
        if (group) {
            group.appendChild(ipythonContainer);
        } else {
            commandHistory.appendChild(ipythonContainer);
        }
        
        // Initial message
        addOutput('Loading IPython environment...', 'info', interactionId, theme);
        
        // 用于存储所有代码的累积代码字符串，这是确保变量共享的关键
        let accumulatedCode = '';
        
        // JavaScript变量字典，用于手动跟踪Python变量
        let jsVariables = {};
        
        // Load Skulpt if not already loaded
        function loadSkulpt() {
            return new Promise((resolve, reject) => {
                if (window.Sk) {
                    resolve();
                    return;
                }
                
                // Create loading indicator
                const loader = document.createElement('div');
                loader.className = 'skulpt-loader';
                loader.innerHTML = '<div class="spinner"></div><span>Loading Python environment...</span>';
                ipythonContainer.appendChild(loader);
                
                // Load Skulpt scripts
                const skulptCore = document.createElement('script');
                skulptCore.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
                
                const skulptStdlib = document.createElement('script');
                skulptStdlib.src = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';
                
                document.head.appendChild(skulptCore);
                
                skulptCore.onload = () => {
                    document.head.appendChild(skulptStdlib);
                    
                    skulptStdlib.onload = () => {
                        // Remove loader
                        if (loader.parentNode) {
                            loader.parentNode.removeChild(loader);
                        }
                        resolve();
                    };
                    
                    skulptStdlib.onerror = () => {
                        reject(new Error("Failed to load Skulpt standard library"));
                    };
                };
                
                skulptCore.onerror = () => {
                    reject(new Error("Failed to load Skulpt core"));
                };
            });
        }
        
        // Initialize IPython environment
        loadSkulpt().then(() => {
            // Configure Skulpt
            Sk.configure({
                output: (text) => {
                    // Append to current output cell
                    if (currentOutputCell) {
                        const content = currentOutputCell.querySelector('.ipython-output-content');
                        if (content) {
                            content.textContent += text;
                        }
                    }
                },
                read: (filename) => {
                    if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[filename] === undefined) {
                        throw new Error(`File not found: ${filename}`);
                    }
                    return Sk.builtinFiles.files[filename];
                },
                __future__: Sk.python3
            });
            
            // Create IPython-style interface
            createIPythonInterface(ipythonContainer, theme);
            
            // Success message
            addOutput('IPython ready! Type Python code to execute.', 'success', interactionId, theme);
            addOutput('Use ? for help, Enter to execute code.', 'info', interactionId, theme);
            
        }).catch(error => {
            addOutput(`Failed to load Python environment: ${error.message}`, 'error', interactionId, theme);
        });
        
        // Track current output cell for Skulpt output redirection
        let currentOutputCell = null;
        
        // Create IPython interface elements
        function createIPythonInterface(container, theme) {
            // Create header
            const ipythonHeader = document.createElement('div');
            ipythonHeader.className = 'ipython-header';
            ipythonHeader.innerHTML = `
                <div class="ipython-logo">
                    <svg viewBox="0 0 32 32" width="24" height="24">
                        <path d="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM7.53 14.276c0-1.889 0.897-2.781 2.033-2.781s2.033 0.889 2.033 2.781v3.448c0 1.889-0.897 2.781-2.033 2.781s-2.033-0.889-2.033-2.781v-3.448zM20.435 25.29c-3.511 0-4.401-2.382-4.401-4.867v-9.002c0-0.19 0.155-0.344 0.344-0.344h1.309c0.19 0 0.344 0.155 0.344 0.344v8.999c0 1.328 0.289 3.044 2.634 3.044 0.147 0 0.278 0.126 0.278 0.276v1.273c0 0.155-0.126 0.278-0.274 0.278-0.079 0-0.158 0-0.234 0z"></path>
                    </svg>
                </div>
                <div class="ipython-info">
                    <div>Python 3.x (Skulpt)</div>
                </div>
            `;
            container.appendChild(ipythonHeader);
            
            // Variables for command history
            const commandHistory = [];
            let historyIndex = -1;
            let cellCounter = 1;
            
            // 用于多行输入模式
            let isMultilineMode = false;
            let indentLevel = 0;
            
            // Create first input cell
            createInputCell(cellCounter);
            
            // Function to create input cell
            function createInputCell(number, isMultiline = false) {
                const cell = document.createElement('div');
                cell.className = 'ipython-cell';
                
                const prompt = document.createElement('span');
                prompt.className = 'ipython-prompt';
                // 显示主提示符或续行提示符，确保续行提示符前有三个空格
                prompt.textContent = isMultiline ? '...: ' : `In [${number}]: `;
                // 手动设置内边距以确保对齐
                if (isMultiline) {
                    prompt.style.paddingLeft = '3ch'; // 添加3个字符宽度的左内边距
                }
                prompt.style.color = theme.prompt;
                
                const input = document.createElement('div');
                input.className = 'ipython-input';
                input.contentEditable = true;
                input.spellcheck = false;
                
                cell.appendChild(prompt);
                cell.appendChild(input);
                container.appendChild(cell);
                
                // Focus on the input
                setTimeout(() => input.focus(), 0);
                
                // Handle key events
                input.addEventListener('keydown', handleKeyDown);
                
                return { cell, input, prompt };
            }
            
            // Handle input key events
            function handleKeyDown(e) {
                const input = e.target;
                
                // 多行模式下的缩进处理
                if (e.key === 'Tab') {
                    e.preventDefault();
                    document.execCommand('insertText', false, '    '); // 插入4个空格
                    return;
                }
                
                // Shift+Enter用于创建新行并继续输入
                if (e.key === 'Enter' && e.shiftKey) {
                    e.preventDefault();
                    
                    // 获取当前输入内容
                    const code = input.textContent;
                    
                    // 检测是否需要增加缩进
                    if (code.trim().endsWith(':')) {
                        indentLevel += 1;
                    } else if (code.trim() === '' && indentLevel > 0) {
                        // 空行减少缩进
                        indentLevel -= 1;
                    }
                    
                    // 设置多行模式
                    isMultilineMode = true;
                    
                    // 让当前单元格不可编辑
                    input.contentEditable = false;
                    
                    // 创建新的续行单元格
                    const newCell = createInputCell(cellCounter, true);
                    
                    // 添加适当的缩进
                    if (indentLevel > 0) {
                        newCell.input.textContent = '    '.repeat(indentLevel);
                        // 将光标放在缩进后
                        placeCaretAtEnd(newCell.input);
                    }
                    
                    return;
                }
                
                // Execute code on Enter
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    
                    // 结束多行模式并执行代码
                    const allCode = collectMultilineCode();
                    isMultilineMode = false;
                    indentLevel = 0;
                    
                    // 执行代码
                    executeCode(allCode);
                    
                    return;
                }
                // Navigate history - Up
                else if (e.key === 'ArrowUp' && !e.shiftKey) {
                    if (historyIndex > 0) {
                        e.preventDefault();
                        historyIndex--;
                        input.textContent = commandHistory[historyIndex];
                        // Move cursor to end
                        placeCaretAtEnd(input);
                    }
                }
                // Navigate history - Down
                else if (e.key === 'ArrowDown' && !e.shiftKey) {
                    e.preventDefault();
                    if (historyIndex < commandHistory.length - 1) {
                        historyIndex++;
                        input.textContent = commandHistory[historyIndex];
                    } else {
                        historyIndex = commandHistory.length;
                        input.textContent = '';
                    }
                    // Move cursor to end
                    placeCaretAtEnd(input);
                }
            }
            
            // 收集多行代码
            function collectMultilineCode() {
                // 获取所有输入单元格
                const inputCells = container.querySelectorAll('.ipython-cell:not(.ipython-output)');
                let codeLines = [];
                
                // 从当前cellCounter的第一个输入单元格开始，收集所有代码行
                let collecting = false;
                let currentCodeCounter = null;
                
                for (let i = 0; i < inputCells.length; i++) {
                    const cell = inputCells[i];
                    const prompt = cell.querySelector('.ipython-prompt');
                    const input = cell.querySelector('.ipython-input');
                    
                    // 确定是否开始或继续收集
                    if (prompt.textContent.includes(`In [${cellCounter}]`)) {
                        collecting = true;
                        currentCodeCounter = cellCounter;
                    } else if (prompt.textContent.includes('In [') && !prompt.textContent.includes(`In [${cellCounter}]`)) {
                        // 如果是另一个编号的主提示符，停止收集
                        if (collecting && currentCodeCounter !== cellCounter) {
                            collecting = false;
                        }
                    }
                    
                    // 收集代码
                    if (collecting && input.textContent.trim() !== '') {
                        codeLines.push(input.textContent);
                    }
                }
                
                return codeLines.join('\n');
            }
            
            // 新函数：执行代码
            function executeCode(code) {
                if (!code.trim()) return;
                
                // Add to history
                commandHistory.push(code);
                historyIndex = commandHistory.length;
                
                // Create output cell with Out label
                currentOutputCell = document.createElement('div');
                currentOutputCell.className = 'ipython-cell ipython-output';
                
                // Add Out label
                const outLabel = document.createElement('span');
                outLabel.className = 'ipython-prompt ipython-out-prompt';
                outLabel.textContent = `Out[${cellCounter}]: `;
                outLabel.style.color = '#4caf50'; // 默认使用绿色表示成功
                currentOutputCell.appendChild(outLabel);
                
                const outputContent = document.createElement('pre');
                outputContent.className = 'ipython-output-content';
                currentOutputCell.appendChild(outputContent);
                
                container.appendChild(currentOutputCell);
                
                // Special commands
                if (code === '?') {
                    // Help
                    outputContent.textContent = `
IPython-style Terminal Help:
---------------------------
- Execute code: Enter
- Multi-line code: Shift+Enter (adds continuation lines with "..:")
- Tab: Insert 4 spaces (indent)
- History navigation: Up/Down arrows
- Special commands:
  ? - Show this help
  %clear - Clear the terminal
  %reset - Reset the Python environment
  %who - Show defined variables
  exit() - Exit IPython mode
                    `.trim();
                    
                    // 添加空白行
                    addWhitespaceBetweenCells();
                    
                    // Create next input cell
                    cellCounter++;
                    createInputCell(cellCounter);
                    
                } else if (code === 'exit()') {
                    // Exit IPython
                    outputContent.textContent = 'Exiting IPython...';
                    
                    // Remove the container after a delay
                    setTimeout(() => {
                        if (container.parentNode) {
                            container.parentNode.removeChild(container);
                            // Reset IPython active flag
                            window.isIPythonActive = false;
                            // Restore focus to main terminal
                            commandInput.focus();
                        }
                    }, 1000);
                    
                } else if (code === '%clear') {
                    // Clear cells except the current one
                    const cells = container.querySelectorAll('.ipython-cell, .ipython-output, .ipython-whitespace');
                    cells.forEach(cell => {
                        container.removeChild(cell);
                    });
                    
                    // Reset counter
                    cellCounter = 1;
                    
                    // Create new input
                    createInputCell(cellCounter);
                    
                } else if (code === '%reset') {
                    // Reset Python environment
                    outputContent.textContent = 'Python environment reset.';
                    
                    // 重置累积代码和变量
                    accumulatedCode = '';
                    jsVariables = {};
                    
                    // 添加空白行
                    addWhitespaceBetweenCells();
                    
                    // Create next input cell
                    cellCounter++;
                    createInputCell(cellCounter);
                    
                } else if (code === '%who') {
                    // Show variables
                    try {
                        // 从累积代码中提取变量名
                        const variableRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=/gm;
                        const matches = [...accumulatedCode.matchAll(variableRegex)];
                        const variableNames = matches.map(match => match[1]);
                        const uniqueNames = [...new Set(variableNames)];
                        
                        if (uniqueNames.length > 0) {
                            outputContent.textContent = 'Variables defined in the global namespace:\n' + uniqueNames.join(' ');
                        } else {
                            outputContent.textContent = 'No variables defined in the global namespace.';
                        }
                    } catch (err) {
                        outputContent.textContent = 'Error listing variables: ' + err.toString();
                        outputContent.style.color = theme.error;
                    }
                    
                    // 添加空白行
                    addWhitespaceBetweenCells();
                    
                    // Create next input cell
                    cellCounter++;
                    createInputCell(cellCounter);
                    
                } else {
                    // 对于普通Python代码，累积代码并执行
                    try {
                        let hasOutput = false;
                        
                        // 添加当前代码到累积代码
                        accumulatedCode += code + '\n';
                        
                        // 配置Skulpt输出
                        Sk.configure({
                            output: (text) => {
                                hasOutput = true;
                                outputContent.textContent += text;
                            },
                            read: (filename) => {
                                if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[filename] === undefined) {
                                    throw new Error(`File not found: ${filename}`);
                                }
                                return Sk.builtinFiles.files[filename];
                            },
                            __future__: Sk.python3,
                            retainingReturn: true
                        });
                        
                        // 执行累积的所有代码
                        Sk.misceval.asyncToPromise(() => {
                            return Sk.importMainWithBody("__main__", false, accumulatedCode, true);
                        }).then((module) => {
                            // 检查是否有返回值需要显示（仅显示当前单元格的返回值）
                            try {
                                // 提取当前单元格的最后一个表达式的值（如果有）
                                if (!hasOutput && code.indexOf('=') === -1 && code.indexOf('print') === -1) {
                                    // 如果代码是纯表达式，尝试执行并获取值
                                    Sk.misceval.asyncToPromise(() => {
                                        return Sk.importMainWithBody("<expr>", false, "result = " + code, true);
                                    }).then((exprModule) => {
                                        if (exprModule.$d.result) {
                                            const returnValue = Sk.ffi.remapToJs(exprModule.$d.result);
                                            outputContent.textContent = String(returnValue);
                                        }
                                    }).catch(() => {
                                        // 表达式求值失败，忽略错误
                                    });
                                }
                            } catch (e) {
                                // 忽略返回值处理错误
                            }
                            
                            // 如果没有输出也没有返回值，隐藏输出单元格
                            if (!hasOutput && !outputContent.textContent) {
                                if (currentOutputCell.parentNode) {
                                    currentOutputCell.parentNode.removeChild(currentOutputCell);
                                }
                            } else {
                                // 添加空白行
                                addWhitespaceBetweenCells();
                            }
                            
                            // Create next input cell
                            cellCounter++;
                            createInputCell(cellCounter);
                        }).catch((err) => {
                            // Show error
                            outputContent.textContent = err.toString();
                            outputContent.style.color = theme.error;
                            // 错误时输出标签变为红色
                            outLabel.style.color = '#e74c3c'; // 红色表示错误
                            
                            // 错误发生时回滚最后添加的代码
                            accumulatedCode = accumulatedCode.substring(0, accumulatedCode.length - code.length - 1);
                            
                            // 添加空白行
                            addWhitespaceBetweenCells();
                            
                            // Create next input cell
                            cellCounter++;
                            createInputCell(cellCounter);
                        });
                    } catch (err) {
                        // Show synchronous errors
                        outputContent.textContent = err.toString();
                        outputContent.style.color = theme.error;
                        // 同步错误时也改变输出标签颜色
                        outLabel.style.color = '#e74c3c'; // 红色表示错误
                        
                        // 同步错误也回滚代码
                        accumulatedCode = accumulatedCode.substring(0, accumulatedCode.length - code.length - 1);
                        
                        // 添加空白行
                        addWhitespaceBetweenCells();
                        
                        // Create next input cell
                        cellCounter++;
                        createInputCell(cellCounter);
                    }
                }
                
                // Scroll to the bottom
                container.scrollTop = container.scrollHeight;
            }
            
            // 添加Out行与下一个In行之间的空白行
            function addWhitespaceBetweenCells() {
                const whitespace = document.createElement('div');
                whitespace.className = 'ipython-whitespace';
                whitespace.style.height = '10px';
                container.appendChild(whitespace);
            }
            
            // Helper to place caret at the end of contenteditable
            function placeCaretAtEnd(element) {
                const range = document.createRange();
                range.selectNodeContents(element);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        
        // Add IPython styles if not already added
        if (!document.getElementById('ipython-style')) {
            const style = document.createElement('style');
            style.id = 'ipython-style';
            style.textContent = `
                .ipython-container {
                    background-color: #222;
                    border: 1px solid #444;
                    border-radius: 4px;
                    padding: 10px;
                    margin: 10px 0;
                    font-family: monospace;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .ipython-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #333;
                }
                
                .ipython-logo {
                    margin-right: 10px;
                }
                
                .ipython-logo svg {
                    fill: #4584b6;
                }
                
                .ipython-info {
                    color: #aaa;
                    font-size: 0.9em;
                }
                
                .ipython-help {
                    font-size: 0.8em;
                    color: #777;
                    margin-top: 3px;
                }
                
                .ipython-cell {
                    display: flex;
                    margin: 5px 0;
                }
                
                .ipython-prompt {
                    min-width: 60px;
                    padding-right: 5px;
                    color: #4584b6;
                    font-weight: bold;
                }
                
                .ipython-input {
                    flex: 1;
                    outline: none;
                    min-height: 1.2em;
                    white-space: pre-wrap;
                }
                
                .ipython-output {
                    display: flex;
                    align-items: flex-start;
                    margin: 5px 0;
                }
                
                .ipython-out-prompt {
                    color: #e74c3c;
                    font-weight: bold;
                }
                
                .ipython-output-content {
                    margin: 0;
                    white-space: pre-wrap;
                    flex: 1;
                }
                
                .ipython-whitespace {
                    height: 10px;
                    width: 100%;
                }
                
                .skulpt-loader {
                    display: flex;
                    align-items: center;
                    color: #aaa;
                    margin: 10px 0;
                }
                
                .spinner {
                    border: 3px solid #333;
                    border-top: 3px solid #4584b6;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                    margin-right: 10px;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Disable main terminal input focus when IPython is active
        commandInput.blur();
    }

    // Ensure input always has focus
    document.addEventListener('click', (e) => {
        // Only focus main terminal input if click is not inside IPython container
        // and IPython is not active
        if (!window.isIPythonActive || 
            !e.target.closest('.ipython-container')) {
            commandInput.focus();
        }
    });

    // Initialize focus
    commandInput.focus();
}); 