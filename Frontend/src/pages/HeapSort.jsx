"use client"
//repo -- > 
import { useState, useEffect, useCallback } from "react"
import "./HeapSort.css"

const TreeNode = ({ node, x, y, level, isRoot = false }) => {
  if (!node) return null

  const nodeRadius = 25
  const nodeClass = `tree-node ${node.isComparing ? "comparing" : ""} ${node.isSwapping ? "swapping" : ""} ${node.isSorted ? "sorted" : ""}`

  return (
    <g>
      <circle cx={x} cy={y} r={nodeRadius} className={nodeClass} />
      <text x={x} y={y + 5} textAnchor="middle" className="tree-node-text">
        {node.value}
      </text>
      <text x={x} y={y + nodeRadius + 15} textAnchor="middle" className="tree-node-index">
        {node.index}
      </text>
    </g>
  )
}

const HeapTree = ({ nodes }) => {
  if (nodes.length === 0) return null

  const svgWidth = 800
  const svgHeight = 400
  const levelHeight = 80
  const startY = 50

  // Calculate positions for each node
  const getNodePosition = (index) => {
    const level = Math.floor(Math.log2(index + 1))
    const nodesInLevel = Math.pow(2, level)
    const positionInLevel = index - (Math.pow(2, level) - 1)

    const levelWidth = svgWidth / (nodesInLevel + 1)
    const x = levelWidth * (positionInLevel + 1)
    const y = startY + level * levelHeight

    return { x, y, level }
  }

  // Draw connections between parent and children
  const renderConnections = () => {
    const connections = []

    for (let i = 0; i < nodes.length; i++) {
      const leftChild = 2 * i + 1
      const rightChild = 2 * i + 2

      if (leftChild < nodes.length) {
        const parent = getNodePosition(i)
        const child = getNodePosition(leftChild)
        connections.push(
          <line
            key={`${i}-${leftChild}`}
            x1={parent.x}
            y1={parent.y + 25}
            x2={child.x}
            y2={child.y - 25}
            className="tree-connection"
          />,
        )
      }

      if (rightChild < nodes.length) {
        const parent = getNodePosition(i)
        const child = getNodePosition(rightChild)
        connections.push(
          <line
            key={`${i}-${rightChild}`}
            x1={parent.x}
            y1={parent.y + 25}
            x2={child.x}
            y2={child.y - 25}
            className="tree-connection"
          />,
        )
      }
    }

    return connections
  }

  return (
    <div className="heap-tree-container">
      <h3 className="tree-title">Heap Tree Structure</h3>
      <svg width={svgWidth} height={svgHeight} className="heap-tree-svg">
        {renderConnections()}
        {nodes.map((node, index) => {
          const { x, y, level } = getNodePosition(index)
          return <TreeNode key={index} node={node} x={x} y={y} level={level} isRoot={index === 0} />
        })}
      </svg>
    </div>
  )
}

export default function HeapSortVisualizer() {
  const [array, setArray] = useState([])
  const [heapArray, setHeapArray] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(500)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationSteps, setAnimationSteps] = useState([])
  const [description, setDescription] = useState('Click "Randomize Array" to generate a new array')

  // Generate random array
  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 900) + 100)
    setArray(newArray)
    setHeapArray(newArray.map((value, index) => ({ value, index })))
    setCurrentStep(0)
    setAnimationSteps([])
    setDescription('Array generated. Click "Heap Sort" to start sorting.')
  }, [])

  // Initialize with random array
  useEffect(() => {
    generateRandomArray()
  }, [generateRandomArray])

  // Heap sort algorithm with animation steps
  const generateHeapSortSteps = (arr) => {
    const steps = []
    const workingArray = [...arr]
    const n = workingArray.length

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapifySteps(workingArray, n, i, steps)
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      steps.push({
        type: "swap",
        indices: [0, i],
        description: `Swap root ${workingArray[0]} with last element ${workingArray[i]}`,
      })
      ;[workingArray[0], workingArray[i]] = [workingArray[i], workingArray[0]]

      steps.push({
        type: "sorted",
        indices: [i],
        description: `Element ${workingArray[i]} is now in its final position`,
      })

      // Call heapify on the reduced heap
      heapifySteps(workingArray, i, 0, steps)
    }

    steps.push({
      type: "sorted",
      indices: [0],
      description: "Sorting complete! All elements are in their final positions.",
    })

    return steps
  }

  const heapifySteps = (arr, n, i, steps) => {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    // Compare with left child
    if (left < n) {
      steps.push({
        type: "compare",
        indices: [largest, left],
        description: `Comparing ${arr[largest]} with left child ${arr[left]}`,
      })
      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    // Compare with right child
    if (right < n) {
      steps.push({
        type: "compare",
        indices: [largest, right],
        description: `Comparing ${arr[largest]} with right child ${arr[right]}`,
      })
      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    // If largest is not root
    if (largest !== i) {
      steps.push({
        type: "swap",
        indices: [i, largest],
        description: `Swap ${arr[i]} with ${arr[largest]} to maintain heap property`,
      })
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]

      // Recursively heapify the affected sub-tree
      heapifySteps(arr, n, largest, steps)
    }
  }

  // Start heap sort animation
  const startHeapSort = () => {
    if (isAnimating) return

    const steps = generateHeapSortSteps(array)
    setAnimationSteps(steps)
    setCurrentStep(0)
    setIsAnimating(true)
    setDescription("Starting heap sort...")
  }

  // Animation effect
  useEffect(() => {
    if (!isAnimating || currentStep >= animationSteps.length) {
      if (currentStep >= animationSteps.length && animationSteps.length > 0) {
        setIsAnimating(false)
        setDescription("Heap sort completed!")
      }
      return
    }

    const timer = setTimeout(() => {
      const step = animationSteps[currentStep]
      setDescription(step.description)

      setHeapArray((prev) => {
        const newArray = [...prev]

        // Reset all highlighting
        newArray.forEach((node) => {
          node.isComparing = false
          node.isSwapping = false
        })

        if (step.type === "compare") {
          step.indices.forEach((index) => {
            if (newArray[index]) newArray[index].isComparing = true
          })
        } else if (step.type === "swap") {
          step.indices.forEach((index) => {
            if (newArray[index]) newArray[index].isSwapping = true
          })

          // Perform the swap
          if (step.indices.length === 2) {
            const [i, j] = step.indices
            if (newArray[i] && newArray[j]) {
              const temp = newArray[i].value
              newArray[i].value = newArray[j].value
              newArray[j].value = temp
            }
          }
        } else if (step.type === "sorted") {
          step.indices.forEach((index) => {
            if (newArray[index]) newArray[index].isSorted = true
          })
        }

        return newArray
      })

      setCurrentStep((prev) => prev + 1)
    }, animationSpeed)

    return () => clearTimeout(timer)
  }, [currentStep, animationSteps, isAnimating, animationSpeed])

  // Reset animation
  const resetAnimation = () => {
    setIsAnimating(false)
    setCurrentStep(0)
    setHeapArray(array.map((value, index) => ({ value, index })))
    setDescription('Animation reset. Click "Heap Sort" to start again.')
  }

  // Pause/Resume animation
  const toggleAnimation = () => {
    setIsAnimating(!isAnimating)
    setDescription(isAnimating ? "Animation paused" : "Animation resumed")
  }

  // Step controls
  const stepForward = () => {
    if (currentStep < animationSteps.length) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      // Rebuild array state up to current step
      const newArray = array.map((value, index) => ({ value, index }))

      for (let i = 0; i < currentStep - 1; i++) {
        const step = animationSteps[i]
        if (step.type === "swap" && step.indices.length === 2) {
          const [idx1, idx2] = step.indices
          const temp = newArray[idx1].value
          newArray[idx1].value = newArray[idx2].value
          newArray[idx2].value = temp
        } else if (step.type === "sorted") {
          step.indices.forEach((index) => {
            newArray[index].isSorted = true
          })
        }
      }

      setHeapArray(newArray)
    }
  }

  return (
    <div className="heap-sort-container">
      <div
        className="header"
        style={{
          background: "linear-gradient(135deg, #2d5a27, #4a7c59)",
          backgroundColor: "#2d5a27",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: "0 0 15px 0",
            color: "#000000",
            textShadow: "none",
            background: "transparent",
          }}
        >
          Heap Sort Visualization
        </h1>
        <div className="controls">
          <button onClick={generateRandomArray} disabled={isAnimating}>
            Randomize Array
          </button>
          <button onClick={startHeapSort} disabled={isAnimating}>
            Heap Sort
          </button>
        </div>
      </div>

      <HeapTree nodes={heapArray} />

      <div className="array-container">
        <div className="array-display">
          {heapArray.map((node, index) => (
            <div key={index} className="array-item-container">
              <div
                className={`array-item ${node.isComparing ? "comparing" : ""} ${node.isSwapping ? "swapping" : ""} ${
                  node.isSorted ? "sorted" : ""
                }`}
              >
                {node.value}
              </div>
              <div className="array-index">{index}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="description-container">
        <p className="description">{description}</p>
      </div>

      <div className="animation-controls">
        <div className="step-controls">
          <button onClick={stepBackward} disabled={isAnimating || currentStep === 0}>
            Step Back
          </button>
          <button onClick={toggleAnimation} disabled={animationSteps.length === 0}>
            {isAnimating ? "Pause" : "Resume"}
          </button>
          <button onClick={stepForward} disabled={isAnimating || currentStep >= animationSteps.length}>
            Step Forward
          </button>
          <button onClick={resetAnimation}>Reset</button>
        </div>

        <div className="speed-control">
          <label htmlFor="speed-slider" className="speed-label">
            Animation Speed: {animationSpeed}ms
          </label>
          <input
            id="speed-slider"
            type="range"
            min={100}
            max={2000}
            step={100}
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            className="speed-slider"
          />
        </div>
      </div>

      <div className="progress-info">
        <p>
          Step: {currentStep} / {animationSteps.length}
        </p>
      </div>
    </div>
  )
}
