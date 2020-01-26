import React from 'react';
import PropTypes from 'prop-types';
import Cell from './Cell'

export default class Board extends React.Component{
   
        constructor(props){
            super(props)
            this.state = {
            boardData: this.initBoardData(this.props.dimension,this.props.mines),
            gameStatus:false,
            mineCount:this.props.mines
            }
        }
    
    createEmptyBoard(dimension) {
        let data = []
        for(let i=0;i<dimension;i++){
            data.push([])
            for(let j=0;j<dimension;j++){
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                    };
              
                }
               
            }
           
        return data;
        

    }
    plantMines(data){
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < this.props.mines) {
        randomx = this.getRandomNumber(this.props.dimension);
        randomy = this.getRandomNumber(this.props.dimension);
      
        if (!(data[randomx][randomy].isMine)) {
            data[randomx][randomy].isMine = true;
            minesPlanted++;
        }
        }

             return (data);

    }
    traverseBoard(x,y,board){
        const el = [];

    //up
    if (x > 0) {
      el.push(board[x - 1][y]);
    }

    //down
    if (x < this.props.height - 1) {
      el.push(board[x + 1][y]);
    }

    //left
    if (y > 0) {
      el.push(board[x][y - 1]);
    }

    //right
    if (y < this.props.width - 1) {
      el.push(board[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
      el.push(board[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < this.props.width - 1) {
      el.push(board[x - 1][y + 1]);
    }

    // bottom right
    if (x < this.props.height - 1 && y < this.props.width - 1) {
      el.push(board[x + 1][y + 1]);
    }

    // bottom left
    if (x < this.props.height - 1 && y > 0) {
      el.push(board[x + 1][y - 1]);
    }

    return el;
  }
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
      }
      getNeighBours(data,dimension){
        let updatedData = data
       
        for(let i=0;i<dimension;i++){
           
            for(let j=0;j<dimension;j++){
                let  mine = 0
                let surroundingArea = this.traverseBoard(i,j,data)
                surroundingArea.map(value=>{
                    if(value.isMine){
                        mine++
                    }
                })
                if (mine === 0) {
                    updatedData[i][j].isEmpty = true;
                }
                updatedData[i][j].neighbour = mine
            }
      }
      return (updatedData)
    }
    initBoardData(dimension,mines){
        let data = this.createEmptyBoard(dimension)

        data = this.plantMines(data)
        data = this.getNeighBours(data,dimension)
        return data
    }
    revealEmpty(x,y,board){
        let surroundingArea = this.traverseBoard(x,y,board)
        surroundingArea.map(value=>{
            if(!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)){
                board[value.x][value.y].isRevealed = true;
                if(value.isEmpty){
                    this.revealEmpty(value.x, value.y, board);
                }
            }
        })
        return (board)
    }
    revealBoard(){
        let updatedData = this.state.boardData
        updatedData.map(datarow=>{
            datarow.map(dataitem=>{
                dataitem.isRevealed = true
            })
        })
        
        this.setState({
            boardData:updatedData
        }) 
    }
    getHidden(board){
        let minesArray= []
        board.map(datarow=>{
            datarow.map(dataitem=>{
              if(!dataitem.isRevealed){
                minesArray.push(dataitem)
              }
            })
        })
        return minesArray
        
    }
    getFlags(data) {
        let mineArray = [];
    
        data.map(datarow => {
          datarow.map((dataitem) => {
            if (dataitem.isFlagged) {
              mineArray.push(dataitem);
            }
          });
        });
    
        return mineArray;
      }
    handleCellClick(x,y){
        if (this.state.boardData[x][y].isRevealed ||    this.state.boardData[x][y].isFlagged) return null;
        if (this.state.boardData[x][y].isMine) {
            this.setState({gameStatus: "You Lost."});
           this.revealBoard();
            alert("game over");
          }
          let updatedData = this.state.boardData;
          if (!this.state.boardData[x][y].isRevealed)
          {
            updatedData[x][y].isRevealed = true
            if( updatedData[x][y].isEmpty)
            updatedData  = this.revealEmpty(x, y, updatedData);
          }
          if (this.getHidden(updatedData).length === this.props.mines) {
            this.setState({ mineCount: 0, gameStatus: "You Win." });
            this.revealBoard();
            alert("You Win");
          }
      
          this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
          })
    }

    renderBoard(data) {
    
            
        
        
        return data.map((datarow) => {
          return datarow.map((dataitem) => {
            return (
              <div key={dataitem.x * datarow.length + dataitem.y}>
                <Cell
                  onClick={() => this.handleCellClick(dataitem.x, dataitem.y)}
                  cMenu={(e) => this.handleContextMenu(e, dataitem.x, dataitem.y)}
                  value={dataitem}
                />
                {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
              </div>);
          })
        });
    
      }
    
    render(){
        return(
            <div className="board">
      <div className="game-info">
        <span className="info">
          mines: {this.state.mineCount}
        </span>
        <br />
        <span className="info">
         gameStatus: {this.state.gameStatus}
        </span>
      
       
      </div>
      {
          this.renderBoard(this.state.boardData)
        }
      
      </div>
   
  
    );
    }
    
}
Board.propTypes = {
    dimension: PropTypes.number,
    mines: PropTypes.number,
  }

