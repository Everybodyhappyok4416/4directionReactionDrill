import React, { useState, useEffect } from "react";
import "../App.css";

const Countdown = ({ onFinish }) => {
  const [count, setCount] = useState(3);
  const [rule, setRule] = useState(true); // true: 黒順, false: 赤順

  useEffect(() => {
    // コンポーネント生成時にランダムでルールを決定
    setRule(Math.random() > 0.5);
  }, []);

  useEffect(() => {
    if (count >= 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
        if (count === 0) {
          onFinish(rule);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onFinish, rule]);

  return (
    <div
      className="fullscreen-text"
      style={{ flexDirection: "column", display: "flex" }}
    >
      <div style={{ fontSize: "0.4em", marginBottom: "20px" }}>
        {rule ? (
          <span>
            <b style={{ color: "black" }}>黒:順</b> /{" "}
            <b style={{ color: "red" }}>赤:逆</b>
          </span>
        ) : (
          <span>
            <b style={{ color: "black" }}>黒:逆</b> /{" "}
            <b style={{ color: "red" }}>赤:順</b>
          </span>
        )}
      </div>
      <div>{count === 0 ? "Go!" : count}</div>
    </div>
  );
};

export default Countdown;

// import React, { useState, useEffect } from "react";
// import "../App.css";

// const Countdown = ({ onFinish }) => {
//   const [count, setCount] = useState(2);
//   const [text, setText] = useState(2);

//   useEffect(() => {
//     if (count >= 0) {
//       const timer = setTimeout(() => {
//         if (count === 0) {
//           setText("Start!");
//           setTimeout(onFinish, 1000); // 1秒表示して次へ
//         } else {
//           setText(count);
//         }
//         setCount((prev) => prev - 1);
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [count, onFinish]);

//   return <div className="fullscreen-text">{text}</div>;
// };

// export default Countdown;
