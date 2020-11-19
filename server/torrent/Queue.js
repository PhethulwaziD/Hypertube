
// pieceBlocks =  (torrent, index) => {
//     const pieceLen = Math.floor(torrent.length/torrent.pieceLength);
//     if (torrent.lastPieceLength === index) {
//         return (Math.ceil(torrent.lastPieceLength/ Math.pow(2, 14)));
//     } else {
//         return (Math.ceil(pieceLen/ Math.pow(2, 14)));
//     }
// }

// module.exports = class {
//     constructor (torrent) {
//         this.torrent = torrent;
//         this.queue = [];
//         this.choked = true;
//     }
    
//     addQueue(index) {
//         for (let i = 0; i < this.torrent.pieceLength; i++) {
//             const piece = {
//                 index: index,
//                 begin: i * Math.pow(2, 14),
//                 length: this.torrent.lastPieceLength
//             };
//             this.queue.push(piece);
//         }
//     }

//     deQueue () {
//         return this.queue.shift();
//     }

//     peek () {
//         return this.queue[0];
//     }

//     length () {
//         return this.queue.length;
//     }
// }
const tp = require('./torrent-parser');

module.exports = class {
  constructor(torrent) {
    this._torrent = torrent;
    this._queue = [];
    this.choked = true;
  }

  addQueue(pieceIndex) {
    const nBlocks = tp.blocksPerPiece(this._torrent, pieceIndex);
    for (let i = 0; i < nBlocks; i++) {
      const pieceBlock = {
        index: pieceIndex,
        begin: i * tp.BLOCK_LEN,
        length: tp.blockLen(this._torrent, pieceIndex, i)
      };
      this._queue.push(pieceBlock);
    }
  }
  
  len() { 
    return this._queue.length; 
  }

  deQue() { return this._queue.shift(); }

  peek() { return this._queue[0]; }

 
};