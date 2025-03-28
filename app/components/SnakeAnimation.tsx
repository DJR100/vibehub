'use client';

import { useEffect, useRef } from 'react';

interface SnakeAnimationProps {
  gridSize?: number;
  speed?: number;
}

// Add type definitions for our game objects
interface Point {
  x: number;
  y: number;
}

interface Fruit extends Point {
  color: string;
}

interface TextZone {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

type Direction = 'up' | 'down' | 'left' | 'right';

interface DirectionMap {
  [key: string]: Direction;
}

export default function SnakeAnimation({ gridSize = 15, speed = 120 }: SnakeAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    console.log("Snake animation initializing");
    
    // First declare these variables at the top of the effect
    let cols = 0;
    let rows = 0;
    
    // Now define the resizeCanvas function
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      
      // Now update cols and rows after setting canvas dimensions
      cols = Math.floor(canvas.width / gridSize);
      rows = Math.floor(canvas.height / gridSize);
      
      console.log("Canvas resized to:", canvas.width, "x", canvas.height);
      console.log("Grid dimensions:", cols, "x", rows);
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Snake game variables
    const fruitColors = [
      '#FF5733',  // Orange/red (primary)
      '#5DFF33',  // Bright green
      '#338DFF',  // Bright blue
      '#F3FF33',  // Yellow
      '#FF33F3'   // Pink
    ];
    
    let snakeColor = fruitColors[0];
    let direction: Direction = 'right';
    let snake: Point[] = [
      {x: Math.floor(cols / 2), y: Math.floor(rows * 0.7)},
      {x: Math.floor(cols / 2) - 1, y: Math.floor(rows * 0.7)},
      {x: Math.floor(cols / 2) - 2, y: Math.floor(rows * 0.7)},
      {x: Math.floor(cols / 2) - 3, y: Math.floor(rows * 0.7)},
      {x: Math.floor(cols / 2) - 4, y: Math.floor(rows * 0.7)}
    ];

    // Define a text zone to avoid placing fruits there
    const textZone: TextZone = {
      top: Math.floor(rows * 0.2),
      bottom: Math.floor(rows * 0.5),
      left: Math.floor(cols * 0.1),
      right: Math.floor(cols * 0.9)
    };
    
    // Track active fruits - we'll have multiple now
    let fruits: Fruit[] = [];
    const maxFruits = 3;
    
    // Add score to the component's state variables at the top of useEffect
    let score = 0;
    let scoreColor = fruitColors[0]; // Initial score color matches snake
    
    // Place a fruit at a random position
    const placeFruit = () => {
      const colorIndex = Math.floor(Math.random() * fruitColors.length);
      
      let newX = 0;
      let newY = 0;
      let validPosition = false;
      let attempts = 0;
      
      while (!validPosition && attempts < 50) {
        attempts++;
        newX = Math.floor(Math.random() * (cols - 2)) + 1;
        newY = Math.floor(Math.random() * (rows - 2)) + 1;
        
        const inTextZone = newY >= textZone.top && newY <= textZone.bottom && 
                          newX >= textZone.left && newX <= textZone.right;
        
        const onSnake = snake.some(segment => segment.x === newX && segment.y === newY);
        const onFruit = fruits.some(f => f.x === newX && f.y === newY);
        
        validPosition = !inTextZone && !onSnake && !onFruit;
      }
      
      if (!validPosition) {
        const corners: Point[] = [
          {x: 2, y: rows - 2},
          {x: cols - 2, y: rows - 2},
          {x: 2, y: 2},
          {x: cols - 2, y: 2}
        ];
        
        for (const corner of corners) {
          if (!snake.some(s => s.x === corner.x && s.y === corner.y) &&
              !fruits.some(f => f.x === corner.x && f.y === corner.y)) {
            newX = corner.x;
            newY = corner.y;
            validPosition = true;
            break;
          }
        }
      }
      
      if (validPosition) {
        const newFruit: Fruit = {
          x: newX,
          y: newY,
          color: fruitColors[colorIndex]
        };
        
        fruits.push(newFruit);
        console.log("New fruit placed at:", newX, newY, "with color:", fruitColors[colorIndex]);
      }
    };
    
    // Initialize first fruits
    const initFruits = () => {
      fruits = [];
      for (let i = 0; i < maxFruits; i++) {
        placeFruit();
      }
    };
    
    initFruits();
    
    // First, let's define our direction relationships more clearly
    const oppositeDirections: DirectionMap = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };

    // Helper function to check if a turn is valid (90 degrees only)
    const isValidTurn = (currentDir: Direction, newDir: Direction): boolean => {
      // If it's the same direction, it's valid
      if (currentDir === newDir) return true;
      
      // If it's the opposite direction, it's invalid (180-degree turn)
      if (oppositeDirections[currentDir] === newDir) return false;
      
      // Otherwise it's a 90-degree turn, which is valid
      return true;
    };

    // Update the setDirection function
    const setDirection = (newDirection: Direction) => {
      if (isValidTurn(direction, newDirection)) {
        direction = newDirection;
      }
    };

    // Update the calculateBestMove function to prevent 180-degree turns
    const calculateBestMove = () => {
      if (fruits.length === 0) return;
      
      const head = snake[0];
      
      let closestFruit: Fruit | null = null;
      let minDistance = Infinity;
      
      // Find closest fruit
      for (const fruit of fruits) {
        let dx = Math.abs(fruit.x - head.x);
        let dy = Math.abs(fruit.y - head.y);
        
        dx = Math.min(dx, cols - dx);
        dy = Math.min(dy, rows - dy);
        
        const distance = dx + dy;
        
        if (distance < minDistance) {
          minDistance = distance;
          closestFruit = fruit;
        }
      }
      
      if (!closestFruit) return;
      
      const horizontalDiff = closestFruit.x - head.x;
      const verticalDiff = closestFruit.y - head.y;
      
      const wrapHorizontal = Math.abs(horizontalDiff) > cols / 2;
      const wrapVertical = Math.abs(verticalDiff) > rows / 2;
      
      // Get current movement axis ('horizontal' or 'vertical')
      const currentAxis = (direction === 'left' || direction === 'right') ? 'horizontal' : 'vertical';
      
      // Determine preferred direction based on distance and current axis
      if (currentAxis === 'horizontal') {
        // If moving horizontally, first try vertical movement
        if (Math.abs(verticalDiff) > 0) {
          if (verticalDiff > 0) {
            setDirection('down');
          } else {
            setDirection('up');
          }
        } else {
          // If no vertical difference, continue horizontal movement
          if (horizontalDiff > 0) {
            setDirection(wrapHorizontal ? 'left' : 'right');
          } else {
            setDirection(wrapHorizontal ? 'right' : 'left');
          }
        }
      } else {
        // If moving vertically, first try horizontal movement
        if (Math.abs(horizontalDiff) > 0) {
          if (horizontalDiff > 0) {
            setDirection(wrapHorizontal ? 'left' : 'right');
          } else {
            setDirection(wrapHorizontal ? 'right' : 'left');
          }
        } else {
          // If no horizontal difference, continue vertical movement
          if (verticalDiff > 0) {
            setDirection(wrapVertical ? 'up' : 'down');
          } else {
            setDirection(wrapVertical ? 'down' : 'up');
          }
        }
      }
    };

    // Update the random direction change logic to respect 90-degree turns
    const changeRandomDirection = () => {
      const currentAxis = (direction === 'left' || direction === 'right') ? 'horizontal' : 'vertical';
      
      // Choose only valid 90-degree turns based on current axis
      const validDirections: Direction[] = currentAxis === 'horizontal' 
        ? ['up', 'down']
        : ['left', 'right'];
      
      // Pick a random valid direction
      const newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
      setDirection(newDirection);
    };

    // Move snake function
    const moveSnake = () => {
      // Calculate best move toward fruit
      calculateBestMove();
      
      // Create new head based on current direction
      const head = {x: snake[0].x, y: snake[0].y};
      
      switch(direction) {
        case 'right': head.x++; break;
        case 'left': head.x--; break;
        case 'up': head.y--; break;
        case 'down': head.y++; break;
      }
      
      // Wrap around the screen if needed
      if (head.x >= cols) head.x = 0;
      if (head.x < 0) head.x = cols - 1;
      if (head.y >= rows) head.y = 0;
      if (head.y < 0) head.y = rows - 1;
      
      // Add new head
      snake.unshift(head);
      
      // Check if fruit is eaten
      let fruitEaten = false;
      for (let i = 0; i < fruits.length; i++) {
        if (head.x === fruits[i].x && head.y === fruits[i].y) {
          // Change snake color to match the fruit
          snakeColor = fruits[i].color;
          scoreColor = fruits[i].color; // Update score color
          
          // Increment score
          score += 10;
          
          // Remove eaten fruit
          fruits.splice(i, 1);
          
          // Add a new fruit
          placeFruit();
          
          fruitEaten = true;
          console.log("Snake ate fruit! New color:", snakeColor, "Score:", score);
          break;
        }
      }
      
      if (!fruitEaten) {
        // Remove tail if no fruit eaten
        snake.pop();
      }
      
      // Occasionally add random movement for visual interest (lower probability)
      if (Math.random() < 0.01) {
        changeRandomDirection();
      }
    };
    
    // Draw function
    const draw = () => {
      // Clear canvas with very transparent black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw snake with consistent size
      snake.forEach((segment, index) => {
        // Shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 5;
        
        // Create a subtle gradient effect for the snake body
        if (index === 0) {
          // Head color (brighter)
          ctx.fillStyle = snakeColor;
        } else {
          // Body color (slightly darker)
          const r = parseInt(snakeColor.slice(1, 3), 16);
          const g = parseInt(snakeColor.slice(3, 5), 16);
          const b = parseInt(snakeColor.slice(5, 7), 16);
          const darkenFactor = 0.9 - (index * 0.02); // Gradual darkening
          ctx.fillStyle = `rgb(${Math.floor(r * darkenFactor)}, ${Math.floor(g * darkenFactor)}, ${Math.floor(b * darkenFactor)})`;
        }
        
        // Draw snake segment with consistent size
        ctx.fillRect(
          segment.x * gridSize, 
          segment.y * gridSize, 
          gridSize - 1, // Leave 1px gap for visual separation
          gridSize - 1
        );
        
        // Add white eyes to the head
        if (index === 0) {
          ctx.fillStyle = 'white';
          
          // Left eye
          ctx.beginPath();
          ctx.arc(
            segment.x * gridSize + gridSize * 0.3, 
            segment.y * gridSize + gridSize * 0.3, 
            gridSize * 0.15, 0, Math.PI * 2
          );
          ctx.fill();
          
          // Right eye
          ctx.beginPath();
          ctx.arc(
            segment.x * gridSize + gridSize * 0.7, 
            segment.y * gridSize + gridSize * 0.3, 
            gridSize * 0.15, 0, Math.PI * 2
          );
          ctx.fill();
        }
      });
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Draw fruits with the same size as snake segments
      fruits.forEach(fruit => {
        ctx.shadowColor = fruit.color;
        ctx.shadowBlur = 15;
        ctx.fillStyle = fruit.color;
        
        // Draw fruit with exact same dimensions as snake segments
        ctx.fillRect(
          fruit.x * gridSize,
          fruit.y * gridSize,
          gridSize - 1, // Match snake segment size
          gridSize - 1
        );
      });
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Draw score with proper styling
      ctx.font = '20px "Press Start 2P"';
      ctx.fillStyle = scoreColor;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.fillText(`SCORE: ${score}`, canvas.width - 20, 20);
      
      // Final shadow reset
      ctx.shadowBlur = 0;
      
      // Debug: visualize the text zone (uncomment for debugging)
      // ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      // ctx.strokeRect(
      //   textZone.left * gridSize,
      //   textZone.top * gridSize,
      //   (textZone.right - textZone.left) * gridSize,
      //   (textZone.bottom - textZone.top) * gridSize
      // );
    };
    
    // Animation loop
    let animationId: number;
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      // Calculate time passed since last frame
      if (lastTime === 0) {
        lastTime = currentTime;
      }
      
      const deltaTime = currentTime - lastTime;
      
      // Only update game state if enough time has passed (speed controls how often we update)
      if (deltaTime > speed) {
        moveSnake();
        lastTime = currentTime;
      }
      
      // Always draw (for smooth rendering)
      draw();
      
      // Request next frame
      animationId = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    console.log("Snake animation started with speed:", speed);
    
    // Cleanup function
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
      console.log("Snake animation cleaned up");
    };
  }, [gridSize, speed]);
  
  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0" 
        style={{ 
          width: '100%', 
          height: '100%',
          zIndex: 0,
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
} 