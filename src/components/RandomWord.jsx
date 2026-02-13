import React, { useState, useEffect, useRef, useCallback } from "react";
import "../App.css";

// フィールドをデカルト平面と見立てた移動ベクトルの定義
const moveMap = {
  "→": { axis: "x", val: 1 },  // 右方向へのステップ
  "←": { axis: "x", val: -1 }, // 左方向へのステップ
  Go: { axis: "y", val: 1 },    // 前方（スクラップ/フィル）への進出
  Pass: { axis: "y", val: -1 }, // 後方（ドロップ）へのセット
  Stay: { axis: "none", val: 0 }, // その場でのパワーポジション維持（FFP）
};
const words = Object.keys(moveMap);
const colors = ["black", "red"];

const RandomWord = ({ count, isBlackNormal, onFinish }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [currentColor, setCurrentColor] = useState("black");
  const [step, setStep] = useState(0);

  // position: 自分のフィールド上の位置。再描画を起こさず値を保持し、境界判定に利用
  const position = useRef({ x: 0, y: 0 });
  // lastDirection: 前回の「結果としての移動方向」。連続した同じ方向への移動を封じる
  const lastDirection = useRef("");

  /**
   * 次に提示すべき「正しい選択肢」を計算する脳内ロジック
   */
  const getNextState = useCallback(
    (excludeStay = false) => {
      let validOptions = [];

      words.forEach((word) => {
        // スナップ直後（1回目）にStayが出る「リアクションの遅れ」を排除
        if (excludeStay && word === "Stay") return;

        colors.forEach((color) => {
          const move = moveMap[word];
          let delta = 0;

          if (move.axis !== "none") {
            // カウントダウンで決まったルール（isBlackNormal）に基づき、
            // 「色」を「方向の反転係数」に変換するアルゴリズム
            let multiplier = isBlackNormal
              ? color === "black"
                ? 1
                : -1
              : color === "black"
                ? -1
                : 1;
            delta = move.val * multiplier;
          }

          const nextX = position.current.x + (move.axis === "x" ? delta : 0);
          const nextY = position.current.y + (move.axis === "y" ? delta : 0);

          // 境界条件チェック：自分の守備範囲（アサイメント）を逸脱しないか
          const isInside = nextX > -3 && nextX < 3 && nextY > -3 && nextY < 3;

          // 連続移動防止：常に「切り返し」を発生させ、ACLを保護するステップワークを強いる
          const directionKey =
            move.axis === "none" ? "stay" : `${move.axis}${delta}`;
          const isNotSameDir = directionKey !== lastDirection.current;

          if (isInside && isNotSameDir) {
            validOptions.push({ word, color, nextX, nextY, directionKey });
          }
        });
      });

      // 条件を満たす候補からランダムに1つを抽出（予測不可能性の担保）
      return validOptions.length > 0
        ? validOptions[Math.floor(Math.random() * validOptions.length)]
        : null;
    },
    [isBlackNormal],
  );

  useEffect(() => {
    // 【初動訓練】「Start」の直後に、待機時間なしで1歩目のリアクションを要求
    if (step === 0) {
      const nextState = getNextState(true); // 最初の1回は必ず「移動」を伴う
      if (nextState) {
        setCurrentWord(nextState.word);
        setCurrentColor(nextState.color);
        position.current = { x: nextState.nextX, y: nextState.nextY };
        lastDirection.current = nextState.directionKey;
        setStep(1);
      }
      return;
    }

    // 【連続リアクション訓練】
    if (step < count) {
      // Stay（0.8秒）は短時間の集中維持、移動（0.8〜1.7秒）は動作の完遂と次への備えを意識
      const isStay = currentWord === "Stay";
      const showTime = isStay
        ? 1000
        : Math.floor(Math.random() * (1400 - 900 + 1)) + 900;

      const timer = setTimeout(() => {
        const nextState = getNextState(false); // 2回目以降は「Stay」による揺さぶりを解禁
        if (nextState) {
          setCurrentWord(nextState.word);
          setCurrentColor(nextState.color);
          position.current = { x: nextState.nextX, y: nextState.nextY };
          lastDirection.current = nextState.directionKey;
          setStep((prev) => prev + 1); // 次のサイクルへ
        } else {
          onFinish(); // 動ける場所がなくなれば終了（バグ回避）
        }
      }, showTime);

      return () => clearTimeout(timer); // アンマウント時のメモリリーク防止
    } else {
      // 全ての指示を終えた後の余韻（最後の動作を確実に止めさせる）
      const finalTimer = setTimeout(onFinish, 1200);
      return () => clearTimeout(finalTimer);
    }
    // step, currentWord が変わるたびにタイマーを再セットし、ラグのない連続性を生む
  }, [step, count, onFinish, currentWord, getNextState]);

  return (
    <div className="fullscreen-text" style={{ color: currentColor }}>
      {/* 画面中央に色付けされたワードを表示。周辺視野での判別を促す */}
      {currentWord}
    </div>
  );
};

export default RandomWord;