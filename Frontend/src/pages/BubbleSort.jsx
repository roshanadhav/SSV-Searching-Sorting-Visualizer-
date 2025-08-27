import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./SelectionSort.css";

export default function BubbleSort() {
  const [arr, setArr] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("java"); // default tab

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const sort = (array) => {
    let sortedArr = [...array];
    for (let i = 0; i < sortedArr.length; i++) {
        let flag = 0;
        for (let j = 0; j < sortedArr.length - i -1; j++) {
            if (sortedArr[j] > sortedArr[j+1]) {
                let temp = sortedArr[j];
                sortedArr[j] = sortedArr[j+1];
                sortedArr[j+1] = temp;
                flag = 1;
            }
        }
        if(flag == 0){
            break;
        }
    }
    return sortedArr;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numbers = inputValue
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    let sorted = sort(numbers);
    setArr(sorted);
  };

  // Code Snippets
  const codeSnippets = {
    java: `
public class BubbleSort {
  public static void bubbleSort(int[] arr) {
    for (int i = 0; i < arr.length - 1; i++) {
        int flag = 0;
        for (int j = 0; j < arr.length -i -1; j++) {
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
                flag = 1;
            }
            if(flag == 0){
                break;
            }
      }
    }
  }
}`,
    python: `
def bubble_sort(arr):
    for i in range(len(arr)):
        flag = 0
        for j in range(0, len(arr)-i-1):
            if arr[j] > arr[j+1]:    
                arr[i], arr[j+1] = arr[j+1], arr[i]
                flag = 1
        if(flag == 0) :
            break
    return arr`,
    cpp: `
#include <iostream>
using namespace std;

void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int flag = 0;
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                swap(arr[j+1], arr[i]);
                flag = 1;
            }
        }
        if(flag == 0){
            break;
        }
    }
}`
  };

  return (
    <div className="bubble-sort">
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

      {/* Sorted Array */}
      {arr.length > 0 && (
        <div className="array-card">
          <h3>Sorted Array:</h3>
          <div className="array-display">
            {arr.map((num, idx) => (
              <span key={idx} className="array-element">{num}</span>
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
            Bubble Sort is one of the earliest and simplest sorting algorithms, dating
            back to the mid-20th century. It became popular in the early days of computer
            science education because of its straightforward approach.
          </p>
        </div>

        <div className="info-card">
          <h2>🧩 Explanation</h2>
          <p>
            The algorithm works by repeatedly comparing adjacent elements and swapping them if they are in the wrong order. With each
            pass, the largest element "bubbles up" to the end of the array, and this
            process continues until the entire array is sorted.
          </p>
          <ul>
            <li><strong>Time Complexity:</strong> O(n²)</li>
            <li><strong>Space Complexity:</strong> O(1) (in-place)</li>
            <li><strong>Best Use:</strong> when the array is nearly sorted (performs well on small, almost-sorted arrays)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
