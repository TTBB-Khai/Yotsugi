'use strict';

class Utils {
	
	constructor (client) {
		this.client = client
	}
	
	static responder(replacements, input) {
		const entries = Object.entries(replacements);
		const result = entries.reduce( (output, entry) => {
			const [key, value] = entry;
			const regex = new RegExp( `\\$\{${key}\}`, 'g');
			return output.replace( regex, value )
		}, input )
		return result
	} 
}

module.exports = Utils;