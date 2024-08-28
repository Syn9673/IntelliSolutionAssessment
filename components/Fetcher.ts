import axios from 'axios'
import FetcherError, { FetcherErrorCodes } from './FetcherError'

interface FetcherResult {
	code?: number
	message?: string
	data?: { [key: string]: any } | any[]
	error?: boolean
}

class Fetcher {
	public static async getJSONData(url: string): Promise<FetcherResult> {
		try {
			const res = await axios.get(url)
			if (typeof res.data !== 'object')
				throw new FetcherError(
					'This url does not support JSON data as a response.',
					FetcherErrorCodes.ERR_NOT_SUPPORT_JSON
				)

			return { data: res.data }
		} catch(err) {
			if (err instanceof FetcherError)
				return (
					{
						...(err.toObject()),
						error: true
					}
				)

			let code: FetcherErrorCodes = FetcherErrorCodes.ERR_UNKNOWN_ERROR
			console.log(err)

			switch (err.code) {
				case 'ERR_NETWORK': {
					code = FetcherErrorCodes.ERR_CORS_ISSUE
					err.message = 'This request is not allowed due to the url not allowing requests from other browsers.'
				} break

				case 'ERR_BAD_REQUEST': {
					code = FetcherErrorCodes.ERR_HTTP_ISSUE

					switch (err.status) {
						case 400: {
							err.message = 'Query failed due to a bad request.'
						} break

						case 401:
						case 403: {
							err.message = 'Client lacks the certain permissions for this request.'
						} break

						case 404: {
							err.message = 'This url does not seem to exist? Please make sure to provided a correct one.'
						} break

					 	case 429: {
					 		err.message = 'Client is being ratelimited by the server. Please try again later.'
					 	} break

						default:
							err.message = 'Unhandled error encountered. HTTP Error code provided: ' + err.status
						} break
				} break
			}

			return (
				{
					code,
					message: err.message ?? err.msg ?? 'Something wen\'t wrong with the request',
					error: true
				}
			)
		}
	}
}

export default Fetcher