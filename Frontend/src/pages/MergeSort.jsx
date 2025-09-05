import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import "./SelectionSort.css";

export default function MergeSort() {
  const [arr, setArr] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("java"); // default tab

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const merge = (left, right) => {
    let result = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
  };

  const mergeSort = (array) => {
    if (array.length <= 1) return array;
    const mid = Math.floor(array.length / 2);
    const left = mergeSort(array.slice(0, mid));
    const right = mergeSort(array.slice(mid));
    return merge(left, right);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numbers = inputValue
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
    let sorted = mergeSort(numbers);
    setArr(sorted);
  };

  const codeSnippets = {
    java: `
public class MergeSort {
  public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
      int m = (l + r) / 2;
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }
  }

  public static void merge(int[] arr, int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int[] L = new int[n1];
    int[] R = new int[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
      if (L[i] <= R[j]) arr[k++] = L[i++];
      else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
  }
}
`,
    python: `
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
`,
    cpp: `
#include <iostream>
using namespace std;

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) arr[k++] = L[i++];
        else arr[k++] = R[j++];
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
`
  };

  return (
    <div className="merge-sort">
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
            Merge Sort was invented by John von Neumann in 1945. It was one of the first 
            sorting algorithms to use the divide-and-conquer paradigm.
          </p>
        </div>

        <div className="info-card">
          <h2>🧩 Explanation</h2>
          <p>
            Merge Sort works by dividing the array into halves, recursively sorting them,
            and then merging the sorted halves together.
          </p>
          <ul>
            <li><strong>Time Complexity:</strong> O(n log n)</li>
            <li><strong>Space Complexity:</strong> O(n)</li>
            <li><strong>Best Use:</strong> Works well for large datasets where stable sorting is required.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
