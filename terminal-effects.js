// Terminal visual effects functionality
document.addEventListener('DOMContentLoaded', function() {
    // Delay initialization to ensure script.js is fully loaded
    setTimeout(() => {
        initTerminalEffects();
    }, 300);
    
    function initTerminalEffects() {
        // Available terminal effect list
        const terminalEffects = [
            { name: 'Default', class: '' },
            { name: 'Green Hacker Style', class: '' }, // Current default style
            { name: 'Frosted Glass', class: 'terminal-glassmorphism' },
            { name: 'Gradient Border', class: 'terminal-gradient-border' },
            { name: 'Pixel Border', class: 'terminal-pixel-border' },
            { name: 'Neumorphism', class: 'terminal-neumorphism' },
            { name: 'CRT Display', class: 'terminal-crt' },
            { name: 'Textured Background', class: 'terminal-textured' },
            { name: 'Metallic', class: 'terminal-metallic' },
            { name: 'Neon Border', class: 'terminal-neon-border' }
        ];
        
        // Get terminal element
        const terminal = document.querySelector('.terminal');
        
        // Check if global objects are available
        if (!window.commands || !window.addOutput || !window.processCommand) {
            console.error('Terminal functions are not available yet');
            return;
        }
        
        // Create terminal effect command
        window.commands['theme'] = {
            description: 'Change terminal visual effect',
            action: showThemeOptions
        };
        
        // Apply default theme on initialization (theme 3 - Gradient Border)
        applyTheme(3, null, null);
        
        // Store current theme for use in other pages
        window.currentTheme = 3;
        
        // Show theme options
        function showThemeOptions(interactionId, theme, args) {
            // If arguments are provided, try to apply the corresponding theme
            if (args && args.length > 0) {
                const themeIndex = parseInt(args[0]);
                if (!isNaN(themeIndex) && themeIndex >= 0 && themeIndex < terminalEffects.length) {
                    applyTheme(themeIndex, interactionId, theme);
                    // Store current theme for use in other pages
                    window.currentTheme = themeIndex;
                    return;
                }
            }
            
            // Otherwise show theme list
            window.addOutput('Available terminal visual effects:', 'info', interactionId, theme);
            terminalEffects.forEach((effect, index) => {
                window.addOutput(`  ${index} - ${effect.name}`, '', interactionId, theme);
            });
            window.addOutput('Use the command "theme <number>" to apply the corresponding effect. Example: theme 5', '', interactionId, theme);
        }
        
        // Apply theme effect
        function applyTheme(index, interactionId, theme) {
            // Remove all theme classes
            terminalEffects.forEach(effect => {
                if (effect.class) {
                    terminal.classList.remove(effect.class);
                }
            });
            
            // Apply the selected theme
            const selectedEffect = terminalEffects[index];
            if (selectedEffect.class) {
                terminal.classList.add(selectedEffect.class);
            }
            
            // Output success message if interaction is active
            if (interactionId && theme) {
                window.addOutput(`Applied "${selectedEffect.name}" effect`, 'success', interactionId, theme);
            }
        }
        
        // Expose applyTheme to global scope for use in other files
        window.applyTheme = function(index) {
            applyTheme(index, null, null);
        };
    }
}); 