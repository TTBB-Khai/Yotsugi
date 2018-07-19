'use strict';

class Utils {
	
	constructor (client) {
		this.client = client
	}

	static numSuffix(num) {
		let x = num % 10;
		let y = num % 100;
		
		if (x == 1 && y != 11)
			return num + 'st';
		else if (x == 2 && y != 12)
			return num + 'nd';
		else if (x == 3 && y != 13)
			return num + 'rd';
		else
			return num + 'th';
	}
}

module.exports = Utils