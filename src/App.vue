<template>
  <div class="wrapper">
    <h1>Life Game</h1>

    <div class="container">
      <!-- セルのグリッドを表示 -->
      <div class="grid">
        <div
          v-for="(row, y) in grid"
          :key="y"
          class="row"
        >
          <div
            v-for="(cell, x) in row"
            :key="x"
            class="cell"
            :class="{ alive: cell }"
            @click="toggleCell(x, y)"
          ></div>
        </div>
      </div>
    </div>

    <!-- 操作ボタン -->
    <div class="buttons">
      <button @click="step" :disabled="isRunning">1step進める</button>
      <button @click="isRunning = !isRunning">{{ isRunning ? '停止' : '再生' }}</button>
      <button @click="randomize" :disabled="isRunning">ランダムに配置</button>
      <button @click="clearGrid" :disabled="isRunning">初期化</button>
    </div>
  </div>
</template>

<script setup>
// Vue の Composition API を使って記述
import { ref, watch } from 'vue'

// ---------------------------
// ゲームの初期設定
// ---------------------------

// 行数と列数（20x20 のグリッド）
const rows = 20
const cols = 20

// スタートフラグ
const isRunning = ref(false);

// インターバル時間（500ミリ秒）
const intervalTime = 500

// インターバルID
let intervalId = null;

// ランダムなグリッド生成時の生存確率（30%）
const randomAliveProbability = 0.3

// 二次元配列でグリッドを初期化（全て死）
const grid = ref(
  Array.from({ length: rows }, () => Array(cols).fill(false))
)

// ---------------------------
// グリッドの初期化
// ---------------------------
function clearGrid() {
  grid.value = Array.from({ length: rows }, () =>
    Array(cols).fill(false)
  );
}

// ---------------------------
// セルの生死をトグルする関数（クリック時）
// x: 横（列番号）
// y: 縦（行番号）
// ---------------------------
function toggleCell(x, y) {
  if (isRunning.value) return ;
  grid.value[y][x] = !grid.value[y][x]
}

// ---------------------------
// 次の世代に進める関数
// ---------------------------
function step() {
  // 各セルの新しい状態を計算して新しいグリッドを作成
  const newGrid = grid.value.map((row, y) =>
    row.map((cell, x) => {
      const neighbors = getNeighbors(x, y)
      const aliveCount = neighbors.filter(Boolean).length

      if (cell) {
        // 生きているセル：2か3個の隣接セルで生存、それ以外で死
        return aliveCount === 2 || aliveCount === 3
      } else {
        // 死んでいるセル：3個の隣接セルで誕生
        return aliveCount === 3
      }
    })
  )

  // グリッドを更新
  grid.value = newGrid
}

// ---------------------------
// 再生/停止
// ---------------------------
watch(isRunning, (newVal) => {
  if (newVal) {
    // true になったとき：一定時間ごとに step 実行
    intervalId = setInterval(step, intervalTime);
  } else {
    // false になったとき：停止
    clearInterval(intervalId);
    intervalId = null;
  }
});

// ---------------------------
// 指定位置の隣接8セルの状態を返す
// ---------------------------
function getNeighbors(x, y) {
  const deltas = [-1, 0, 1]
  return deltas.flatMap(dy =>
    deltas.map(dx => {
      if (dx === 0 && dy === 0) return false // 自分自身は無視
      const nx = x + dx
      const ny = y + dy
      // 配列外アクセス対策に optional chaining を使用
      return grid.value[ny]?.[nx] || false
    })
  )
}

// ---------------------------
// ランダムなグリッドを生成
// ---------------------------
function randomize() {
  grid.value = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.random() < randomAliveProbability)
  )
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  text-align: center;
}

/* 👇 このcontainerでグリッドとボタンを縦にまとめて中央揃え */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.grid {
  display: grid;
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
}

.row {
  display: grid;
  grid-template-columns: repeat(20, 20px);
}

.cell {
  width: 20px;
  height: 20px;
  background: #eee;
  border: 1px solid #ccc;
  cursor: pointer;
}

.cell.alive {
  background: black;
}

.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 8px;
  margin-top: 10px;
}

.buttons button {
  white-space: nowrap;
}

</style>
