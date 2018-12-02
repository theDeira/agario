class BinaryReader {
	constructor(buffer) {
		this._offset = 0;
		this._buffer = Buffer.from(buffer);
	}

	readUInt8() {
		const value = this._buffer.readUInt8(this._offset);
		this._offset += 1;
		return value;
	}

	readInt8() {
		const value = this._buffer.readInt8(this._offset);
		this._offset += 1;
		return value;
	}

	readUInt16() {
		const value = this._buffer.readUInt16LE(this._offset);
		this._offset += 2;
		return value;
	}

	readInt16() {
		const value = this._buffer.readInt16LE(this._offset);
		this._offset += 2;
		return value;
	}

	readUInt32() {
		const value = this._buffer.readUInt32LE(this._offset);
		this._offset += 4;
		return value;
	}

	readInt32() {
		const value = this._buffer.readInt32LE(this._offset);
		this._offset += 4;
		return value;
	}

	readFloat() {
		const value = this._buffer.readFloatLE(this._offset);
		this._offset += 4;
		return value;
	}

	readDouble() {
		const value = this._buffer.readDoubleLE(this._offset);
		this._offset += 8;
		return value;
	}

	readBytes(length) {
		const buf = this._buffer.slice(this._offset, this._offset + length);
		this._offset += length;
		return buf;
	}

	skipBytes(length) {
		this._offset += length;
	}

	readStringUtf8(length) {
		if (length == null) length = this._buffer.length - this._offset;
		length = Math.max(0, length);
		const value = this._buffer.toString('utf8', this._offset, this._offset + length);
		this._offset += length;
		return value;
	}

	readStringUnicode(length) {
		if (length == null) length = this._buffer.length - this._offset;
		length = Math.max(0, length);
		let safeLength = length - (length % 2);
		safeLength = Math.max(0, safeLength);
		const value = this._buffer.toString('ucs2', this._offset, this._offset + safeLength);
		this._offset += length;
		return value;
	}

	readStringZeroUtf8() {
		let length = 0;
		let terminatorLength = 0;
		for (let i = this._offset; i < this._buffer.length; i++) {
			if (this._buffer.readUInt8(i) == 0) {
				terminatorLength = 1;
				break;
			}
			length++;
		}
		const value = this.readStringUtf8(length);
		this._offset += terminatorLength;
		return value;
	}

	readStringZeroUnicode() {
		let length = 0;
		let terminatorLength = ((this._buffer.length - this._offset) & 1) != 0 ? 1 : 0;
		for (let i = this._offset; i + 1 < this._buffer.length; i += 2) {
			if (this._buffer.readUInt16LE(i) == 0) {
				terminatorLength = 2;
				break;
			}
			length += 2;
		}
		const value = this.readStringUnicode(length);
		this._offset += terminatorLength;
		return value;
	}

	getLength() {
		return this._buffer.length;
	}

	toBuffer() {
		return this._buffer;
	}
}

module.exports = BinaryReader;