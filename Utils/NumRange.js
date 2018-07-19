'use strict';

class Utils {
	
	constructor (client) {
		this.client = client
	}
	
	static numRange (start, end) {
		return new Array(end - start).fill().map((d, i) => i + start);
	}
	
}

module.exports = Utils;