<template>
  <div>
    <h1>Life Game</h1>

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

    <!-- 操作ボタン -->
    <button @click="step">Step</button>
    <button @click="randomize">Randomize</button>
  </div>
</template>

<script setup>
// Vue の Composition API を使って記述
import { ref } from 'vue'

// ---------------------------
// ゲームの初期設定
// ---------------------------

// 行数と列数（20x20 のグリッド）
const rows = 20
const cols = 20

// 二次元配列でグリッドを初期化（全て死）
const grid = ref(
  Array.from({ length: rows }, () => Array(cols).fill(false))
)

// ---------------------------
// セルの生死をトグルする関数（クリック時）
// ---------------------------
function toggleCell(x, y) {
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
    Array.from({ length: cols }, () => Math.random() < 0.3) // 30% の確率で alive
  )
}
</script>

<style scoped>
/* グリッド全体（行を縦に並べる） */
.grid {
  display: grid;
  grid-template-rows: repeat(20, 20px);
  gap: 1px;
}

/* 各行（セルを横に並べる） */
.row {
  display: grid;
  grid-template-columns: repeat(20, 20px);
}

/* 各セルのスタイル */
.cell {
  width: 20px;
  height: 20px;
  background: #eee;
  border: 1px solid #ccc;
  cursor: pointer;
}

/* 生きているセルのスタイル */
.cell.alive {
  background: black;
}
</style>
