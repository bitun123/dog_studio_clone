import React from "react";
import Dog from "./components/Dog";
import { Canvas } from "@react-three/fiber";

import "./App.css";

function App() {
  return (
    <div>
      <Canvas  style={{ width: "100vw", height: "100vh" }}>
        <Dog />
      </Canvas>
    </div>
  );
}

export default App;
