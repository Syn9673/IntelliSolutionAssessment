interface JSONObject {
	[key: string]: any
}

class Parser {
	public static sortChar(char: string) {
		if (char >= 'a' && char <= 'z') return 1
    if (char >= 'A' && char <= 'Z') return 2
		if (char >= '0' && char <= '9') return 3
		return 4
	}

	public static sortStr(char: string) {
		return char.split('')
			.sort(
				(a, b) => {
					const comparison = Parser.sortChar(a) - Parser.sortChar(b)
					if (comparison !== 0) return comparison

					return b.localeCompare(a)
				}
			)
			.join('')
	}

	// We can just pass the json object directly as a js object
	// and modify the object directly due to it being passed on
	// in a recursive function
	// We don't need to return the object as well due to it
	// being modified directly
	public static countJSONProperties(obj: JSONObject) {
		if (!obj) return

		if (Array.isArray(obj)) {
			for (const value of obj)
				Parser.countJSONProperties(value)
		} else {
			const keys = Object.keys(obj) // get all keys of the object
			for (const key of keys) {
				// use this same function for the current object
				const value = obj[key],
					reversedKey = key.split('')
						.sort((a, b) => b.localeCompare(a))
						.join('')

				obj[reversedKey] = value
				if (reversedKey !== key) delete obj[key]

				if (typeof value !== 'object' || !value) continue
				Parser.countJSONProperties(value)
			}

			obj.objectCount = keys.length
		}
	}

	// this method does the same as above, except it does not modify
	// the object provided.
	// instead it makes new copies or new objects or arrays then places new elements there instead
	// making it much faster
	public static count(obj: JSONObject | any[]) {
		if (!obj) return null

		if (Array.isArray(obj)) {
			const newObj: any[] = []
			for (const item of obj)
				newObj.push(
					Parser.count(item)
				)

			return newObj
		}

		const keys = Object.keys(obj),
			newObj: JSONObject = {} 

		for (const key of keys) {
			const reversedKey = Parser.sortStr(key)

			if (typeof obj[key] === 'object')
				newObj[reversedKey] = Parser.count(obj[key])
			else newObj[reversedKey] = typeof obj[key] === 'string' ? Parser.sortStr(obj[key]) : obj[key]
		}

		newObj.objectCount = keys.length
		return newObj
	}
}

export default Parser