enum FetcherErrorCodes {
	ERR_UNKNOWN_ERROR 	 = 1000,
	ERR_NOT_SUPPORT_JSON = 1001,
	ERR_CORS_ISSUE			 = 1002
}

class FetcherError extends Error {
	constructor(
		public message: string,
		public code: FetcherErrorCodes = FetcherErrorCodes.ERR_UNKNOWN_ERROR
	) {
		super(message)
	}

	public toObject() {
		return {
			code: this.code,
			message: this.message
		}
	}
}

export default FetcherError
export { FetcherErrorCodes }