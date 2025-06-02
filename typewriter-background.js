// Typewriter background animation
document.addEventListener('DOMContentLoaded', function() {
    // Create container element
    const container = document.createElement('div');
    container.id = 'typewriter-background';
    document.body.appendChild(container);

    // Set container style
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'hidden';
    container.style.zIndex = '-1';
    container.style.opacity = '0.9';
    container.style.pointerEvents = 'none';
    
    // Code snippets for typewriter effect with language identification
    const codeSnippets = [
        {
            code: 'function helloWorld() {\n  console.log("Hello, world!");\n  return true;\n}',
            language: 'javascript'
        },
        {
            code: 'const data = fetch("https://api.example.com")\n  .then(response => response.json())\n  .then(data => console.log(data));',
            language: 'javascript'
        },
        {
            code: 'import React, { useState } from "react";\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return <div>{count}</div>;\n}',
            language: 'jsx'
        },
        {
            code: 'class Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n  }\n}',
            language: 'javascript'
        },
        {
            code: 'def quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)',
            language: 'python'
        },
        {
            code: 'const fib = n => n <= 1 ? n : fib(n-1) + fib(n-2);',
            language: 'javascript'
        },
        {
            code: 'SELECT users.name, orders.order_date\nFROM users\nJOIN orders ON users.id = orders.user_id\nWHERE orders.status = "completed"\nORDER BY orders.order_date DESC;',
            language: 'sql'
        },
        {
            code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
            language: 'java'
        },
        {
            code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
            language: 'cpp'
        },
        {
            code: 'func main() {\n    fmt.Println("Hello, World!")\n}',
            language: 'go'
        },
        {
            code: 'use strict;\nuse warnings;\n\nprint "Hello, World!\\n";',
            language: 'perl'
        },
        {
            code: 'fn main() {\n    println!("Hello, World!");\n}',
            language: 'rust'
        }
    ];
    
    // Command snippets
    const commandSnippets = [
        { cmd: 'npm install react react-dom', type: 'npm' },
        { cmd: 'cd /var/www/html', type: 'bash' },
        { cmd: 'ls -la', type: 'bash' },
        { cmd: 'ssh user@192.168.1.100', type: 'network' },
        { cmd: 'python3 -m venv env', type: 'python' },
        { cmd: 'git clone https://github.com/username/repo.git', type: 'git' },
        { cmd: 'docker ps -a', type: 'docker' },
        { cmd: 'curl https://api.example.com/data', type: 'network' },
        { cmd: 'sudo apt update && sudo apt upgrade -y', type: 'linux' },
        { cmd: 'find . -name "*.js" | xargs grep "function"', type: 'bash' },
        { cmd: 'ps aux | grep node', type: 'process' },
        { cmd: 'npm run build', type: 'npm' },
        { cmd: 'kubectl get pods', type: 'kubernetes' },
        { cmd: 'tar -czvf archive.tar.gz directory/', type: 'bash' },
        { cmd: 'netstat -tulpn', type: 'network' },
        { cmd: 'echo $PATH', type: 'bash' },
        { cmd: 'tail -f /var/log/nginx/error.log', type: 'logs' }
    ];
    
    // Language style configurations
    const languageStyles = {
        javascript: {
            color: '#f7df1e', // JavaScript yellow
            borderColor: '#f7df1e',
            labelText: 'JavaScript'
        },
        jsx: {
            color: '#61dafb', // React blue
            borderColor: '#61dafb',
            labelText: 'React/JSX'
        },
        python: {
            color: '#3776ab', // Python blue
            borderColor: '#3776ab',
            labelText: 'Python'
        },
        sql: {
            color: '#e38c00', // SQL orange
            borderColor: '#e38c00',
            labelText: 'SQL'
        },
        java: {
            color: '#b07219', // Java brown
            borderColor: '#b07219',
            labelText: 'Java'
        },
        cpp: {
            color: '#f34b7d', // C++ pink
            borderColor: '#f34b7d',
            labelText: 'C++'
        },
        go: {
            color: '#00add8', // Go blue
            borderColor: '#00add8',
            labelText: 'Go'
        },
        perl: {
            color: '#0298c3', // Perl blue
            borderColor: '#0298c3',
            labelText: 'Perl'
        },
        rust: {
            color: '#dea584', // Rust orange
            borderColor: '#dea584',
            labelText: 'Rust'
        }
    };
    
    // Command type styles
    const commandStyles = {
        bash: { color: '#4da6ff', labelText: 'Bash' },
        npm: { color: '#cb3837', labelText: 'NPM' },
        git: { color: '#f05032', labelText: 'Git' },
        docker: { color: '#2496ed', labelText: 'Docker' },
        kubernetes: { color: '#326ce5', labelText: 'Kubernetes' },
        network: { color: '#009688', labelText: 'Network' },
        python: { color: '#3776ab', labelText: 'Python' },
        linux: { color: '#fcc624', labelText: 'Linux' },
        process: { color: '#8bc34a', labelText: 'Process' },
        logs: { color: '#ff5722', labelText: 'Logs' }
    };
    
    // Calculate maximum number of lines based on screen size
    function calculateMaxLines() {
        const windowWidth = window.innerWidth;
        
        if (windowWidth < 768) {
            // Mobile devices
            return 10;
        } else if (windowWidth < 1200) {
            // Tablets and small laptops
            return 20;
        } else if (windowWidth < 1600) {
            // Medium sized screens
            return 50;
        } else {
            // Large screens
            return 100;
        }
    }

    // Configuration
    let maxLines = calculateMaxLines();
    const typingSpeed = { min: 30, max: 100 };
    const newLineDelay = { min: 100, max: 200 };
    const typewriterLines = [];
    
    // Position randomly on screen, but only on sides of the terminal
    function positionElement(element) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Estimate terminal dimensions (based on CSS)
        const terminalWidth = Math.min(900, windowWidth - 60); // max-width: 900px, margin: 30px
        const terminalHeight = windowHeight - 60; // calc(100vh - 60px)
        
        // Calculate terminal position (it's centered)
        const terminalLeft = (windowWidth - terminalWidth) / 2;
        const terminalRight = terminalLeft + terminalWidth;
        
        // Determine max width for the element
        const maxElementWidth = Math.min(350, terminalLeft * 0.9); // Limit width and ensure it fits
        
        // Skip if screen is too narrow
        if (maxElementWidth < 100) {
            // Screen is too narrow, hide element
            element.style.display = 'none';
            return;
        }
        
        // Decide which side to place the element (left or right)
        // If one side is too narrow, force the other side
        let side;
        if (terminalLeft < 100) {
            side = 'right';
        } else if (windowWidth - terminalRight < 100) {
            side = 'left';
        } else {
            side = Math.random() > 0.5 ? 'left' : 'right';
        }
        
        let left;
        if (side === 'left') {
            // Position on left side of terminal
            const safeWidth = Math.max(0, terminalLeft - maxElementWidth - 10);
            left = 10 + Math.random() * safeWidth;
        } else {
            // Position on right side of terminal
            const safeRight = Math.max(0, windowWidth - terminalRight - maxElementWidth - 10);
            left = terminalRight + 10 + Math.random() * safeRight;
        }
        
        // Randomize vertical position
        const safeTop = Math.max(60, windowHeight * 0.1);
        const safeBottom = Math.min(windowHeight - 100, windowHeight * 0.9);
        const top = safeTop + Math.random() * (safeBottom - safeTop);
        
        // Apply position
        element.style.position = 'absolute';
        element.style.top = top + 'px';
        element.style.left = left + 'px';
        element.style.maxWidth = maxElementWidth + 'px';
        element.style.zIndex = '-1'; // Ensure it stays behind the terminal
    }
    
    // Function to create a new typewriter line
    function createTypewriterLine() {
        // Skip if window is too small
        if (window.innerWidth < 576) { // Very small mobile screens
            setTimeout(startTypewriterBackground, 1000);
            return;
        }
        
        // Select random snippet
        const useCommandSnippet = Math.random() < 0.3; // 30% chance for command
        
        let snippet, language, type, style;
        
        if (useCommandSnippet) {
            const commandSnippet = commandSnippets[Math.floor(Math.random() * commandSnippets.length)];
            snippet = commandSnippet.cmd;
            type = commandSnippet.type;
            style = commandStyles[type] || commandStyles.bash; // Default to bash style
        } else {
            const codeSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            snippet = codeSnippet.code;
            language = codeSnippet.language;
            style = languageStyles[language] || { color: '#f0f0f0', borderColor: '#f0f0f0', labelText: 'Code' }; // Default style
        }
        
        // Create line element
        const line = document.createElement('div');
        line.className = 'typewriter-line';
        line.style.fontFamily = 'monospace';
        line.style.fontSize = '12px';
        line.style.margin = '5px 0';
        line.style.whiteSpace = 'pre-wrap';
        line.style.color = '#f0f0f0';
        
        // Create wrapper for opacity control - separate from content
        const opacityWrapper = document.createElement('div');
        opacityWrapper.style.opacity = '1';
        
        // Create container with header
        const container = document.createElement('div');
        container.style.backgroundColor = 'rgba(30, 31, 33, 0.95)';
        container.style.borderRadius = '4px';
        container.style.overflow = 'hidden';
        container.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        
        // Create header with language label
        const header = document.createElement('div');
        header.style.backgroundColor = 'rgba(20, 21, 23, 0.95)';
        header.style.padding = '4px 12px';
        header.style.borderBottom = `1px solid ${style.color}`;
        header.style.fontSize = '10px';
        header.style.color = style.color;
        header.textContent = style.labelText || 'Code';
        
        // Create content area
        const content = document.createElement('div');
        content.style.padding = '8px 12px';
        
        // Assemble components
        container.appendChild(header);
        container.appendChild(content);
        opacityWrapper.appendChild(container);
        line.appendChild(opacityWrapper);
        
        // Position on sides of the terminal
        positionElement(line);
        
        // Add to container and typewriter lines array
        document.getElementById('typewriter-background').appendChild(line);
        
        // Store line info
        const lineInfo = {
            element: line,
            opacityElement: opacityWrapper, // 使用单独的元素控制透明度
            contentElement: content,
            text: snippet,
            currentIndex: 0,
            isCommand: useCommandSnippet,
            type: type,
            language: language,
            style: style,
            isDone: false,
            creationTime: Date.now()
        };
        
        typewriterLines.push(lineInfo);
        
        // Start typing animation
        typeCharacter(lineInfo);
        
        // Start fade effect immediately
        startFadeEffect(lineInfo);
        
        // Remove oldest line if exceeded max
        if (typewriterLines.length > maxLines) {
            const oldestLine = typewriterLines.shift();
            if (oldestLine.element.parentNode) {
                oldestLine.element.parentNode.removeChild(oldestLine.element);
            }
        }
    }
    
    // Function to start fade effect
    function startFadeEffect(lineInfo) {
        // Calculate a stay duration
        const stayDuration = Math.floor(Math.random() * 10000) + 5000; // 5-15 seconds
        
        // Start the fade effect gradually over time
        const fadeStart = 100; // Start fading after 0.1 seconds
        const fadeInterval = 50; // Update more frequently
        let elapsed = 0;
        
        // Create interval for gradual opacity change
        const fadeIntervalId = setInterval(() => {
            elapsed += fadeInterval;
            
            if (elapsed >= fadeStart && lineInfo.opacityElement) {
                // Calculate new opacity based on elapsed time
                // Will gradually go from 1.0 to 0.02 over the duration with linear fading
                const progress = Math.min(1, (elapsed - fadeStart) / (stayDuration - fadeStart));
                // Use linear change instead of cubic curve
                const newOpacity = Math.max(0.02, 1 - (progress * 0.98));
                
                // Apply new opacity to the opacity wrapper element
                lineInfo.opacityElement.style.opacity = newOpacity.toString();
            }
            
            // When stay duration is reached, remove the element
            if (elapsed >= stayDuration) {
                clearInterval(fadeIntervalId);
                
                // Final fade out effect
                if (lineInfo.element) {
                    lineInfo.opacityElement.style.transition = 'opacity 1s';
                    lineInfo.opacityElement.style.opacity = '0';
                    setTimeout(() => {
                        if (lineInfo.element && lineInfo.element.parentNode) {
                            lineInfo.element.parentNode.removeChild(lineInfo.element);
                        }
                    }, 1000);
                }
            }
        }, fadeInterval);
    }
    
    // Function to type a character
    function typeCharacter(lineInfo) {
        if (lineInfo.currentIndex < lineInfo.text.length) {
            // Get current character
            const char = lineInfo.text.charAt(lineInfo.currentIndex);
            
            // Append character to line
            if (lineInfo.isCommand) {
                lineInfo.contentElement.innerHTML = '<span style="color: ' + lineInfo.style.color + '; font-weight: bold;">$ </span>' + 
                    lineInfo.text.substring(0, lineInfo.currentIndex + 1);
            } else {
                lineInfo.contentElement.textContent = lineInfo.text.substring(0, lineInfo.currentIndex + 1);
            }
            
            // Increment index
            lineInfo.currentIndex++;
            
            // Schedule next character
            const randomDelay = Math.floor(Math.random() * 
                (typingSpeed.max - typingSpeed.min)) + typingSpeed.min;
            setTimeout(() => typeCharacter(lineInfo), randomDelay);
        } else {
            // Typing complete
            lineInfo.isDone = true;
        }
    }
    
    // Start creating typewriter lines
    function startTypewriterBackground() {
        // Estimate terminal dimensions 
        const windowWidth = window.innerWidth;
        const terminalWidth = Math.min(900, windowWidth - 60);
        const sideSpace = (windowWidth - terminalWidth) / 2;
        
        // Calculate delay based on available space
        let delay;
        if (sideSpace < 200) {
            // Very little space, slower rate
            delay = Math.floor(Math.random() * 2000) + 2000; // 2-4 seconds
        } else {
            // Adequate space, normal rate
            delay = Math.floor(Math.random() * 
                (newLineDelay.max - newLineDelay.min)) + newLineDelay.min;
        }
        
        createTypewriterLine();
        
        // Schedule next line
        setTimeout(startTypewriterBackground, delay);
    }
    
    // Initialize
    startTypewriterBackground();
    
    // Update maxLines on window resize
    window.addEventListener('resize', function() {
        maxLines = calculateMaxLines();
        // Clear existing lines and start fresh
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        typewriterLines.length = 0;
        startTypewriterBackground();
    });
}); 