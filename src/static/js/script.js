const hash = (data) => {
  return CryptoJS.SHA256(data).toString();
};

const to_binary_32 = (int32) => {
  var s = int32.toString(2);
  console.assert(s.length > 0 && s.length <= 32, "integer must be a 32 bit integer");
  return String(0).repeat(32).substring(0, 32 - s.length) + s;
};

class Block {
  constructor (block_number, nonce, data, previous_block_hash) {
    this.block_number = block_number;
    this.nonce = nonce;
    this.data = data;
    this.previous_block_hash = previous_block_hash;
  }

  toString () {
    return to_binary_32(this.block_number) + to_binary_32(this.nonce) + to_binary_32(this.data.length) + this.data + this.previous_block_hash;
  }

  toHash () {
    return hash(this.toString());
  }

  clone () {
    return new Block(this.block_number, this.nonce, this.data, this.previous_block_hash);
  }

  mine (difficulty) {
    let search = String(0).repeat(difficulty);
    this.nonce = 0;

    while (true) {
      if (this.toHash().startsWith(search))
        break;
      this.nonce += 1;
    }
  }
};

class BlockChain {
  constructor () {
    this.blockchain = []
  }

  push (data) {
    let previous_block = this.blockchain.empty() ? String(0).repeat(32) : this.blockchain[this.blockchain.length - 1];
    let block = new Block(this.blockchain.length + 1, 0, data, previous_block.toHash());
    this.blockchain.push(block);
  }
}


