import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./SelectionSort.css";

export default function SelectionSort() {
  const [arr, setArr] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("java"); 
  const [barStates, setBarStates] = useState({}); // track bar status for animations

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const sort = (array) => {
    let sortedArr = [...array];
    let delay = 800; // ms
    let steps = [];

    for (let i = 0; i < sortedArr.length; i++) {
      let min = i;
      for (let j = i + 1; j < sortedArr.length; j++) {
        steps.push({ type: "compare", indices: [i, j] });
        if (sortedArr[j] < sortedArr[min]) {
          min = j;
        }
      }
      if (min !== i) {
        steps.push({ type: "swap", indices: [i, min] });
        [sortedArr[i], sortedArr[min]] = [sortedArr[min], sortedArr[i]];
      }
      steps.push({ type: "sorted", index: i });
    }

    // Animate steps
    
    steps.forEach((step, idx) => {
      setTimeout(() => {
        if (step.type === "compare") {
          setBarStates((prev) => ({
            ...prev, //spred [1,2,4 , ...arr2] , arr2 = [5 , 6 , 7]
            [step.indices[0]]: "comparing",
            [step.indices[1]]: "comparing",
          }));
        } else if (step.type === "swap") {
          setBarStates((prev) => ({
            ...prev,
            [step.indices[0]]: "swapping",
            [step.indices[1]]: "swapping",
          }));
          setArr((arr) => {
            let newArr = [...arr];
            [newArr[step.indices[0]], newArr[step.indices[1]]] = [
              newArr[step.indices[1]],
              newArr[step.indices[0]],
            ];
            return newArr;
          });
        } else if (step.type === "sorted") {
          setBarStates((prev) => ({
            ...prev,
            [step.index]: "sorted",
          }));
        }
      }, idx * delay);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numbers = inputValue
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));

    setArr(numbers);
    setBarStates({});

    setTimeout(() => {
      sort(numbers);
    }, 1000);
  };

  // Code Snippets
  const codeSnippets = {
    java: `
public class SelectionSort {
  public static void selectionSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
      int min = i;
      for (int j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) {
          min = j;
        }
      }
      int temp = arr[min];
      arr[min] = arr[i];
      arr[i] = temp;
    }
  }
}`,
    python: `
def selection_sort(arr):
    for i in range(len(arr)):
        min_index = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_index]:
                min_index = j
        arr[i], arr[min_index] = arr[min_index], arr[i]
    return arr`,
    cpp: `
#include <iostream>
using namespace std;

void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        swap(arr[min], arr[i]);
    }
}`
  };

  return (
    <div className="selection-sort">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="form-section">
        <input
          type="text"
          value={inputValue}
          placeholder="Enter numbers separated by commas"
          onChange={handleChange}
        />
        <button type="submit">Sort</button>
      </form>

      {/* Array Display */}
      {arr.length > 0 && (
        <div className="array-card">
          <h3>Array Visualization:</h3>
          <div className="array-display">
            {arr.map((num, idx) => (
              <span
                key={idx}
                style={{ height: 20 + num * 20 }}
                className={`array-element ${barStates[idx] || ""}`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Code Section */}
      <div className="code-section">
        <div className="tabs">
          <button
            className={activeTab === "java" ? "active" : ""}
            onClick={() => setActiveTab("java")}
          >
            Java
          </button>
          <button
            className={activeTab === "python" ? "active" : ""}
            onClick={() => setActiveTab("python")}
          >
            Python
          </button>
          <button
            className={activeTab === "cpp" ? "active" : ""}
            onClick={() => setActiveTab("cpp")}
          >
            C++
          </button>
        </div>

        <div className="editor-container">
          <Editor
            height="300px"
            defaultLanguage={activeTab}
            value={codeSnippets[activeTab]}
            theme="vs-dark"
            options={{ readOnly: true, minimap: { enabled: false } }}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <div className="info-card">
          <h2>📜 History</h2>
          <p>
            Selection Sort is one of the simplest sorting algorithms, first
            introduced in the 1950s. It is often taught as an introductory
            algorithm because of its easy-to-understand logic, even though it's
            not efficient for large datasets.
          </p>
        </div>

        <div className="info-card">
          <h2>🧩 Explanation</h2>
          <p>
            The algorithm works by dividing the array into two parts: a sorted
            part and an unsorted part. It repeatedly selects the smallest (or
            largest) element from the unsorted part and swaps it with the first
            unsorted element, growing the sorted part step by step.
          </p>
          <ul>
            <li><strong>Time Complexity:</strong> O(n²)</li>
            <li><strong>Space Complexity:</strong> O(1) (in-place)</li>
            <li><strong>Best Use:</strong> Small arrays or when memory is a concern.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
