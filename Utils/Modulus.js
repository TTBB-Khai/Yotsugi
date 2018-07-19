'use strict';

class Utils {
	
	constructor (client) {
		this.client = client
	}
	
	static modulus(n, m) {
		return ((n % m) + m) % m;
	}
	
}

module.exports = Utils;

