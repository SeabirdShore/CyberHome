// Matrix rain background animation
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-background';
    document.body.appendChild(canvas);

    // Set canvas style
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.5';
    
    // Get canvas context
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Initialize canvas size
    resizeCanvas();
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters - using more technical characters
    const chars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%"\'#&_(),.;:?!\\|{}<>[]^~';
    
    // Set up the columns
    const fontSize = 18;
    let columns; // Array to store the current position of each column
    let drops; // Array to store drops (characters in each column)
    
    // Initialize the arrays
    function initMatrix() {
        columns = canvas.width / fontSize;
        drops = [];
        
        // Initialize drops at random positions
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
        }
    }
    
    // Initialize
    initMatrix();
    
    // Reset matrix when window is resized
    window.addEventListener('resize', initMatrix);
    
    // Draw the matrix
    function draw() {
        // Semi-transparent black to create fade effect
        ctx.fillStyle = 'rgba(18, 19, 20, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set the color and font for the characters
        ctx.fillStyle = '#4da6ff';
        ctx.font = fontSize + 'px monospace';
        
        // Loop through the drops
        for (let i = 0; i < drops.length; i++) {
            // Select a random character
            const text = chars[Math.floor(Math.random() * chars.length)];
            
            // Draw the character
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Move the drop down
            drops[i]++;
            
            // Reset drop when it reaches bottom or randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                drops[i] = 0;
            }
            
            // Randomly reset some drops
            if (Math.random() > 0.995) {
                drops[i] = 0;
            }
        }
    }
    
    // Animation loop
    setInterval(draw, 35);
}); 