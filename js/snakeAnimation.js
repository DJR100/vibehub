class SnakeAnimation {
  constructor(canvasId, gridSize = 20, speed = 150) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = gridSize;
    this.speed = speed;
    this.direction = 'right';
    this.fruitColors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'];
    this.snakeColor = '#FF5733'; // Initial color
    
    // Initialize snake body (array of positions)
    this.snake = [
      {x: 5, y: 10},
      {x: 4, y: 10},
      {x: 3, y: 10}
    ];
    
    // Resize canvas initially
    this.resizeCanvas();
    
    // Place first fruit
    this.placeFruit();
    
    // Start animation loop
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }
  
  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement.offsetWidth;
    this.canvas.height = this.canvas.parentElement.offsetHeight;
    this.cols = Math.floor(this.canvas.width / this.gridSize);
    this.rows = Math.floor(this.canvas.height / this.gridSize);
  }
  
  placeFruit() {
    const colorIndex = Math.floor(Math.random() * this.fruitColors.length);
    this.fruit = {
      x: Math.floor(Math.random() * (this.cols - 2)) + 1,
      y: Math.floor(Math.random() * (this.rows - 2)) + 1,
      color: this.fruitColors[colorIndex]
    };
  }
  
  moveSnake() {
    // Create new head based on current direction
    const head = {x: this.snake[0].x, y: this.snake[0].y};
    
    switch(this.direction) {
      case 'right': head.x++; break;
      case 'left': head.x--; break;
      case 'up': head.y--; break;
      case 'down': head.y++; break;
    }
    
    // Wrap around the screen if needed
    if (head.x >= this.cols) head.x = 0;
    if (head.x < 0) head.x = this.cols - 1;
    if (head.y >= this.rows) head.y = 0;
    if (head.y < 0) head.y = this.rows - 1;
    
    // Add new head
    this.snake.unshift(head);
    
    // Check if fruit is eaten
    if (head.x === this.fruit.x && head.y === this.fruit.y) {
      // Change snake color to match the fruit
      this.snakeColor = this.fruit.color;
      // Place new fruit
      this.placeFruit();
    } else {
      // Remove tail if no fruit eaten
      this.snake.pop();
    }
    
    // Automated direction changes to make it more interesting
    if (Math.random() < 0.05) {
      this.changeDirection();
    }
    
    // Try to move toward fruit sometimes
    if (Math.random() < 0.3) {
      this.moveTowardFruit();
    }
  }
  
  changeDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };
    
    // Filter out current direction and its opposite to avoid 180° turns
    const validDirections = directions.filter(d => 
      d !== this.direction && d !== opposites[this.direction]
    );
    
    // Pick a random valid direction
    this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
  }
  
  moveTowardFruit() {
    const head = this.snake[0];
    
    // Determine if horizontal or vertical movement is needed more
    const horizontalDiff = this.fruit.x - head.x;
    const verticalDiff = this.fruit.y - head.y;
    
    if (Math.abs(horizontalDiff) > Math.abs(verticalDiff)) {
      // Move horizontally
      if (horizontalDiff > 0 && this.direction !== 'left') {
        this.direction = 'right';
      } else if (horizontalDiff < 0 && this.direction !== 'right') {
        this.direction = 'left';
      }
    } else {
      // Move vertically
      if (verticalDiff > 0 && this.direction !== 'up') {
        this.direction = 'down';
      } else if (verticalDiff < 0 && this.direction !== 'down') {
        this.direction = 'up';
      }
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Nearly transparent background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      this.ctx.fillStyle = this.snakeColor;
      this.ctx.fillRect(
        segment.x * this.gridSize, 
        segment.y * this.gridSize, 
        this.gridSize - 1, 
        this.gridSize - 1
      );
    });
    
    // Draw fruit
    this.ctx.fillStyle = this.fruit.color;
    this.ctx.fillRect(
      this.fruit.x * this.gridSize,
      this.fruit.y * this.gridSize,
      this.gridSize - 1,
      this.gridSize - 1
    );
  }
  
  animate() {
    this.moveSnake();
    this.draw();
    
    setTimeout(() => {
      requestAnimationFrame(() => this.animate());
    }, this.speed);
  }
}

// Initialize the animation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create and add canvas to the home container
  const homeSection = document.querySelector('body > main > section:first-child') || 
                      document.querySelector('.hero-section') || 
                      document.querySelector('section:first-child');
  
  if (homeSection) {
    // Set up container for proper positioning
    homeSection.style.position = 'relative';
    homeSection.style.overflow = 'hidden';
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'snakeCanvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    
    // Add canvas to the home section
    homeSection.insertBefore(canvas, homeSection.firstChild);
    
    // Start the snake animation
    new SnakeAnimation('snakeCanvas', 15, 150);
  } else {
    console.error('Could not find home section to add snake animation');
  }
}); 