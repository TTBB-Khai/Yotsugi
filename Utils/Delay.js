class Utils {
	
	constructor (client) {
		Utils._client = client
	}

	static delay (time) {
		return new Promise((resolve) => setTimeout(() => resolve(), time))
	}
}

module.exports = Utils