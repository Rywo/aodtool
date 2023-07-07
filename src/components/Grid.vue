<template>
  <div>
    <button class="my-5 mx-5" @click="generateGrid">Generate Map</button>
    <button @click="addPlayer">Add Player</button>
    
    <div class="table-container">
      <table>
        <tr v-for="row in grid" :key="row.id">
          <td v-for="cell in row" :key="cell.id" :style="{ backgroundColor: cell.dotColor }">
            <span v-if="cell.dotColor">{{ cell.coordinates }}</span>
          </td>
        </tr>
      </table>
    </div>

    <button class="my-5" @click="mapGenerated">Choose faction</button>
  </div>
</template>

<script>
export default {
  name: 'Grid',
  data() {
    return {
      grid: [],
      greenDots: 2,
    }
  },
  methods: {
    generateGrid() {
        const size = 20;
        const blueDots = 5;
        const brownDots = 10;
        let grid = Array(size).fill().map((_, i) => Array(size).fill().map((_, j) => ({ id: i + "_" + j, dotColor: null, coordinates: null })));

        // Function to generate random color
        const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16);
        
        // Function to get random color from an array
        const randomArrayColor = () => {
            const colors = ['yellow', 'red', 'green', 'blue'];
            return colors[Math.floor(Math.random() * colors.length)];
        };

        // Function to check if neighboring cells are empty
        const isNeighborEmpty = (x, y) => {
            const directions = [
            [-1, 0],  // north
            [1, 0],   // south
            [0, -1],  // west
            [0, 1]    // east
            ];
            for (let i = 0; i < directions.length; i++) {
            const newX = x + directions[i][0];
            const newY = y + directions[i][1];
            if (newX >= 0 && newY >= 0 && newX < size && newY < size && grid[newX][newY].dotColor !== null) {
                return false;
            }
            }
            return true;
        };

        // Randomly add dots
        const colors = ['green', 'blue', 'brown'];
        const dotsPerColor = [this.greenDots, blueDots, brownDots];
        for (let c = 0; c < colors.length; c++) {
            for (let i = 0; i < dotsPerColor[c]; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * size);
                y = Math.floor(Math.random() * size);
            } while (grid[x][y].dotColor !== null || !isNeighborEmpty(x, y));
            if (colors[c] === 'green') {
                grid[x][y].dotColor = randomColor();
            } else if (colors[c] === 'blue') {
                grid[x][y].dotColor = randomArrayColor();
            } else {
                grid[x][y].dotColor = colors[c];
            }
            grid[x][y].coordinates = `(${x},${y})`;
            }
        }

        this.grid = grid;
    },
    mapGenerated(){
        this.$emit('map-generated')
    },
    addPlayer() {
      this.greenDots += 1;
      this.generateGrid();
    }
  }
}
</script>

<style scoped>
.table-container {
  max-width: 90vw;
  margin: 0 auto;
}

td {
  width: 2vw;
  height: 2vw;
  min-width: 75px;
  min-height: 75px;
  border: 1px solid black;
  text-align: center;
  font-size: 0.8em;
  color: white;
}
</style>
