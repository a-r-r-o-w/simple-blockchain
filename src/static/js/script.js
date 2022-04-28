const hash = (data) => {
  return CryptoJS.SHA256(data).toString();
};

const to_binary_32 = (int32) => {
  var s = int32.toString(2);
  console.assert(s.length > 0 && s.length <= 32, "integer must be a 32 bit integer");
  return String(0).repeat(32).substring(0, 32 - s.length) + s;
};

class Block {
  constructor (block_number, nonce, data, previous_block_hash, difficulty) {
    this.block_number = block_number;
    this.nonce = nonce;
    this.data = data;
    this.previous_block_hash = previous_block_hash;
    this.difficulty = difficulty;
    this.htmlID = {
      block_number: `blockchain__block-number-${this.block_number}`,
      nonce: `blockchain__nonce-${this.block_number}`,
      data: `blockchain__data-${this.block_number}`,
      previous_block_hash: `blockchain__previous-block-hash-${this.block_number}`,
      block_hash: `blockchain__block-hash-${this.block_number}`,
      difficulty: `blockchain__difficulty-${this.block_number}`,
      mine: `blockchain__mine-${this.block_number}`,
      add_button: `blockchain__add-${this.block_number}`
    };
    this.htmlElement = {
      block_number: null,
      nonce: null,
      data: null,
      previous_block_hash: null,
      block_hash: null,
      difficulty: null,
      mine: null,
      add_button: null
    };
    this.update = this.update.bind(this);
    this.register = this.register.bind(this);
    this.toString = this.toString.bind(this);
    this.toHash = this.toHash.bind(this);
    this.toHTML = this.toHTML.bind(this);
    this.clone = this.clone.bind(this);
    this.mine = this.mine.bind(this);
  }

  toString () {
    return to_binary_32(this.block_number) + to_binary_32(this.nonce) + to_binary_32(this.data.length) + this.data + this.previous_block_hash;
  }

  toHash () {
    return hash(this.toString());
  }

  toHTML (add_button) {
    return `
    <div id="blockchain-block-${this.block_number}" class="blockchain-block">
      <div class="blockchain-block__element">
        <label for="${this.htmlID.block_number}">block number</label>
        <textarea id="${this.htmlID.block_number}" class="blockchain-block__output" rows="1" cols="32" disabled="true">${this.block_number}</textarea>
      </div>
      <div class="blockchain-block__element">
        <label for="${this.htmlID.nonce}">nonce</label>
        <textarea id="${this.htmlID.nonce}" class="blockchain-block__input" rows="1" cols="32" autofocus="true" wrap="soft">${this.nonce}</textarea>
      </div>
      <div class="blockchain-block__element">
        <label for="${this.htmlID.data}">data</label>
        <textarea id="${this.htmlID.data}" class="blockchain-block__input" rows="4" cols="64" wrap="soft">${this.data}</textarea>
      </div>
      <div class="blockchain-block__element">
        <label for="${this.htmlID.previous_block_hash}">previous block hash</label>
        <textarea id="${this.htmlID.previous_block_hash}" class="blockchain-block__output" rows="1" cols="64" disabled="true">${this.previous_block_hash}</textarea>
      </div>
      <div class="blockchain-block__element">
        <label for="${this.htmlID.block_hash}">block hash</label>
        <textarea id="${this.htmlID.block_hash}" class="blockchain-block__output" rows="1" cols="64" disabled="true">${this.toHash()}</textarea>
      </div>
      <div class="blockchain-block__element">
        <label for="${this.htmlID.difficulty}">difficulty</label>
        <textarea id="${this.htmlID.difficulty}" class="blockchain-block__input" rows="1" cols="8" wrap="soft">${this.difficulty}</textarea>
      </div>
      <div class="blockchain-block__buttons">
        <button id="${this.htmlID.mine}" class="blockchain-block__button-mine">mine</button>
        ${add_button ? `<button id="${this.htmlID.add_button}" class="blockchain-block__button-add">add</button>` : ''}
      </div>
    </div>
    `
  }

  clone () {
    return new Block(this.block_number, this.nonce, this.data, this.previous_block_hash);
  }

  mine () {
    let search = String(0).repeat(this.difficulty);
    this.nonce = 0;

    while (true) {
      if (this.toHash().startsWith(search))
        break;
      this.nonce += 1;
    }

    this.htmlElement.nonce.textContent = this.nonce;
    this.htmlElement.block_hash.textContent = this.toHash();
    this.chain_update(this);
  }

  update (event) {
    let value = event.target.value;

    switch (event.target.id) {
      case this.htmlID.block_number:
        this.block_number = Number(value); break;
      case this.htmlID.nonce:
        this.nonce = Number(value); break;
      case this.htmlID.data:
        this.data = value; break;
      case this.htmlID.difficulty:
        this.difficulty = Number(value); break;
    }

    this.htmlElement.block_hash.textContent = this.toHash();
    this.chain_update(this);
  }

  render_update () {
    this.htmlElement.previous_block_hash.textContent = this.previous_block_hash;
    this.htmlElement.block_hash.textContent = this.toHash();
  }

  register (element, add_button) {
    const div = document.createElement('div')
    div.innerHTML = this.toHTML(add_button);
    element.appendChild(div);

    this.htmlElement.block_number = document.getElementById(`blockchain__block-number-${this.block_number}`);
    this.htmlElement.nonce = document.getElementById(`blockchain__nonce-${this.block_number}`);
    this.htmlElement.data = document.getElementById(`blockchain__data-${this.block_number}`);
    this.htmlElement.previous_block_hash = document.getElementById(`blockchain__previous-block-hash-${this.block_number}`);
    this.htmlElement.block_hash = document.getElementById(`blockchain__block-hash-${this.block_number}`);
    this.htmlElement.difficulty = document.getElementById(`blockchain__difficulty-${this.block_number}`);
    this.htmlElement.mine = document.getElementById(`blockchain__mine-${this.block_number}`);
    this.htmlElement.add_block = document.getElementById(`blockchain__add-${this.block_number}`);

    this.htmlElement.block_number.addEventListener('input', this.update);
    this.htmlElement.nonce.addEventListener('input', this.update);
    this.htmlElement.data.addEventListener('input', this.update);
    this.htmlElement.difficulty.addEventListener('input', this.update);
    this.htmlElement.mine.addEventListener('click', this.mine);
    this.htmlElement.add_block.addEventListener('click', this.add_block);
  }
};

class Blockchain {
  constructor () {
    this.chain = []
    this.chain_update = this.chain_update.bind(this);
    this.add = this.add.bind(this);
    this.add_block = this.add_block.bind(this);
  }

  add_block () {
    this.add('', document.getElementById('blockchain-container'), true);
  }

  add (data, container, add_button) {
    if (this.chain.length === 0) {
      const block = new Block(this.chain.length + 1, 0, data, String(0).repeat(64), 4);
      block.chain_update = this.chain_update;
      block.add_block = this.add_block;
      block.register(container, add_button);
      this.chain.push(block);
    }
    else {
      const previous_block = this.chain[this.chain.length - 1];
      const block = new Block(this.chain.length + 1, 0, data, previous_block.toHash(), 4);
      block.chain_update = this.chain_update;
      block.add_block = this.add_block;
      block.register(container, add_button);
      this.chain.push(block);
    }
  }

  chain_update (block) {
    let index = block.block_number;
    while (index < this.chain.length) {
      this.chain[index].previous_block_hash = this.chain[index - 1].toHash();
      this.chain[index].block_hash = this.chain[index].toHash();
      this.chain[index].render_update();
      index += 1;
    }
  }
};
