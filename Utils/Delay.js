'use strict';

class Utils {
	
	constructor (client) {
		this.client = client
	}

	static delay (time) {
		return new Promise((resolve) => setTimeout(() => resolve(), time))
	}
}

module.exports = Utils