import React from 'react';
import Board from './Board'

class Game extends React.Component {
    state = {
        dimension:8,
        mines: 10
    };
  render() {
      const {dimension, mines } = this.state;
      return (
        <div className="game">
          <Board dimension={dimension} mines={mines} />
        </div>
      );
    }
}

export default Game;