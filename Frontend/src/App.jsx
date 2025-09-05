import React from 'react'
import './App.css' ; 
import { Route , Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SelectionSort from './pages/SelectionSort';
import BubbleSort from './pages/BubbleSort';
import MergeSort from './pages/MergeSort';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/selection-sort" element={<SelectionSort/>} />
      <Route path = "/bubble-sort" element = {<BubbleSort/>}/>
      <Route path = "/merge-sort" element = {<MergeSort/>}/>
    </Routes>
  )
}
