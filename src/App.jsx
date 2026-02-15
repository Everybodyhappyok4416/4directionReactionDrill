import React, { useState } from "react";
import Countdown from "./components/Countdown";
import RandomWord from "./components/RandomWord";
import Finish from "./components/Finish";
import "./App.css";
const App = () => {
  const [stage, setStage] = useState("start");
  // isBlackNormal: true なら黒が順方向、false なら赤が順方向
  const [isBlackNormal, setIsBlackNormal] = useState(true);

  // ... (EscapeキーのuseEffectなどはそのまま)

  return (
    <div className="app-container">
      {stage === "start" && (
        <div className="start-container">
          <button
            className="start-button"
            onClick={() => setStage("countdown")}
          >
            4 reaction
          </button>
        </div>
      )}
      {stage === "countdown" && (
        <Countdown
          onFinish={(rule) => {
            setIsBlackNormal(rule);
            setStage("random");
          }}
        />
      )}
      {stage === "random" && (
        <RandomWord
          count={9}
          isBlackNormal={isBlackNormal} // ルールを渡す
          onFinish={() => setStage("finish")}
        />
      )}
      {stage === "finish" && <Finish onRestart={() => setStage("start")} />}
    </div>
  );
};

export default App;

// import React, { useState, useEffect } from "react";
// import Countdown from "./components/Countdown";
// import RandomWord from "./components/RandomWord";
// import Finish from "./components/Finish";
// import "./App.css";

// const App = () => {
//   const [stage, setStage] = useState("start");

//   // ESCキーで強制リセット
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") {
//         setStage("start"); // スタート画面に戻す
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   return (
//     <div className="app-container">
//       {stage === "start" && (
//         <div className="start-container">
//           <button className="start-button" onClick={() => setStage("countdown")}>
//             Start
//           </button>
//         </div>
//       )}
//       {stage === "countdown" && (
//         <Countdown onFinish={() => setStage("random")} />
//       )}
//       {stage === "random" && (
//         <RandomWord count={8} onFinish={() => setStage("finish")} />
//       )}
//       {stage === "finish" && <Finish onRestart={() => setStage("start")} />}
//     </div>
//   );
// };

// export default App;
