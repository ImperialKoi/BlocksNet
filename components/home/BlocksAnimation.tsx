import React, { useEffect, useRef } from 'react';

const BlocksAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const blocks = [
      { id: 'input', label: 'Input Layer', color: 'bg-teal-500', type: 'input' },
      { id: 'hidden1', label: 'Hidden Layer', color: 'bg-purple-500', type: 'hidden' },
      { id: 'activation', label: 'ReLU Activation', color: 'bg-orange-500', type: 'activation' },
      { id: 'hidden2', label: 'Dense Layer', color: 'bg-purple-600', type: 'hidden' },
      { id: 'output', label: 'Output', color: 'bg-teal-600', type: 'output' },
    ];
    
    const blocksContainer = canvasRef.current;
    blocksContainer.innerHTML = '';
    
    blocks.forEach((block, index) => {
      const blockElement = document.createElement('div');
      blockElement.className = `absolute ${block.color} text-white px-4 py-3 rounded-lg shadow-lg opacity-0 transform -translate-y-10 transition-all duration-700 ease-out w-64`;
      blockElement.style.top = `${index * 80}px`;
      blockElement.style.left = index % 2 === 0 ? '0px' : '80px';
      blockElement.style.transitionDelay = `${300 + index * 150}ms`;
      blockElement.style.zIndex = `${10 - index}`;
      
      const blockHeader = document.createElement('div');
      blockHeader.className = 'flex items-center justify-between font-medium mb-2';
      blockHeader.innerHTML = `
        <span>${block.label}</span>
        <div class="w-6 h-6 rounded-full ${block.color === 'bg-purple-500' || block.color === 'bg-purple-600' ? 'bg-purple-400' : block.color === 'bg-teal-500' ? 'bg-teal-400' : 'bg-orange-400'} flex items-center justify-center">
          <span class="text-xs">${index + 1}</span>
        </div>
      `;
      
      const blockContent = document.createElement('div');
      blockContent.className = 'text-sm opacity-90';
      
      if (block.type === 'input') {
        blockContent.textContent = 'Features: 4, Batch size: 32';
      } else if (block.type === 'hidden') {
        blockContent.textContent = 'Units: 64, Use bias: true';
      } else if (block.type === 'activation') {
        blockContent.textContent = 'Type: ReLU, Alpha: 0.2';
      } else if (block.type === 'output') {
        blockContent.textContent = 'Units: 10, Activation: softmax';
      }
      
      blockElement.appendChild(blockHeader);
      blockElement.appendChild(blockContent);
      blocksContainer.appendChild(blockElement);
      
      setTimeout(() => {
        blockElement.classList.remove('opacity-0', '-translate-y-10');
        blockElement.classList.add('opacity-100', 'translate-y-0');
      }, 100);

      // Add connector lines between blocks
      if (index > 0) {
        const connectorLine = document.createElement('div');
        connectorLine.className = 'absolute w-1.5 bg-gray-300 opacity-0 transition-all duration-500 ease-out';
        connectorLine.style.height = '30px';
        connectorLine.style.top = `${(index - 1) * 80 + 60}px`;
        connectorLine.style.left = index % 2 === 0 ? '40px' : '120px';
        connectorLine.style.transitionDelay = `${600 + index * 150}ms`;
        connectorLine.style.zIndex = '1';
        blocksContainer.appendChild(connectorLine);
        
        setTimeout(() => {
          connectorLine.classList.remove('opacity-0');
          connectorLine.classList.add('opacity-100');
        }, 500);
      }
    });
    
    // Add neural network visualization
    const networkElement = document.createElement('div');
    networkElement.className = 'absolute top-0 right-0 w-40 h-100 flex-col items-center justify-center opacity-0 transition-all duration-1000 ease-out';
    networkElement.style.transitionDelay = '1200ms';
    
    const networkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    networkSvg.setAttribute('width', '160');
    networkSvg.setAttribute('height', '320');
    networkSvg.setAttribute('viewBox', '0 0 160 320');
    networkSvg.style.overflow = 'visible';
    
    // Define the layers of nodes
    const layers = [
      { nodes: 3, y: 40 },  // Input layer
      { nodes: 4, y: 120 }, // Hidden layer 1
      { nodes: 4, y: 200 }, // Hidden layer 2
      { nodes: 2, y: 280 }, // Output layer
    ];
    
    // Create nodes and connections
    let allNodes = [];
    
    layers.forEach((layer, layerIndex) => {
      let layerNodes = [];
      const xSpacing = 160 / (layer.nodes + 1);
      
      for (let i = 0; i < layer.nodes; i++) {
        const x = xSpacing * (i + 1);
        const y = layer.y;
        
        // Create node
        const node = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        node.setAttribute('cx', String(x));
        node.setAttribute('cy', String(y));
        node.setAttribute('r', '8');
        node.setAttribute('fill', layerIndex === 0 ? '#14B8A6' : layerIndex === layers.length - 1 ? '#0D9488' : '#8B5CF6');
        node.classList.add('node');
        node.style.opacity = '0';
        node.style.transition = 'opacity 0.5s ease-out';
        node.style.transitionDelay = `${1500 + (layerIndex * 100) + (i * 50)}ms`;
        networkSvg.appendChild(node);
        
        layerNodes.push({ x, y });
      }
      
      allNodes.push(layerNodes);
      
      // Connect to previous layer
      if (layerIndex > 0) {
        const prevLayer = allNodes[layerIndex - 1];
        
        layerNodes.forEach(node => {
          prevLayer.forEach(prevNode => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', String(prevNode.x));
            line.setAttribute('y1', String(prevNode.y));
            line.setAttribute('x2', String(node.x));
            line.setAttribute('y2', String(node.y));
            line.setAttribute('stroke', '#E2E8F0');
            line.setAttribute('stroke-width', '1');
            line.classList.add('connection');
            line.style.opacity = '0';
            line.style.transition = 'opacity 0.5s ease-out';
            line.style.transitionDelay = `${1300 + (layerIndex * 100)}ms`;
            networkSvg.appendChild(line);
          });
        });
      }
    });
    
    networkElement.appendChild(networkSvg);
    blocksContainer.appendChild(networkElement);
    
    setTimeout(() => {
      networkElement.classList.remove('opacity-0');
      networkElement.classList.add('opacity-100');
      
      // Animate nodes
      document.querySelectorAll('.node').forEach(node => {
        (node as HTMLElement).style.opacity = '1';
      });
      
      // Animate connections
      document.querySelectorAll('.connection').forEach(conn => {
        (conn as HTMLElement).style.opacity = '0.6';
      });
    }, 500);
  }, []);

  return (
    <div className="relative w-full h-96 lg:h-[450px]">
      <div ref={canvasRef} className="absolute inset-0"></div>
    </div>
  );
};

export default BlocksAnimation;