import { useEffect, useState, useCallback } from 'react'
import Fetcher from '@/components/Fetcher'
import Parser from '@/components/Parser'
import Styles from '@/styles/Main.module.css'

type ParserData = any[] | { [key: string]: any }

export default function Home() {
  const [url, setUrl] = useState(''),
    [response, setResponse] = useState<ParserData>(null),
    [result, setResult] = useState<ParserData>(null),
    [
      [error, message],
      setError
    ] = useState([false, '']),
    [isLoading, setLoading] = useState(false)

  const handleFetchButton = useCallback(
    async () => {
      setLoading(true)
      setError([false, ''])

      const res = await Fetcher.getJSONData(url)
      if (res.error) {
        setError([true, res.message])
        return setLoading(false)
      }

      setResponse(res.data)
      setResult(Parser.count(res.data))

      setLoading(false)
    },
    [url]
  )

  useEffect(
    () => {
      if (url) return

      const localUrl = localStorage.getItem('url')
      setUrl(localUrl ?? '')
    },
    []
  )

  return (
    <div className={Styles.mainDiv}>
      <div className={Styles.queryDiv}>
        <input
          placeholder='https://example.com'
          value={url}
          onChange={
            (event) => {
              setUrl(event.target.value)
              localStorage.setItem('url', typeof event.target.value !== 'string' ? '' : event.target.value)
            }
          }
        />

        <button
          className={Styles.queryBtn}
          onClick={handleFetchButton}
        >
          Query
        </button>
      </div>

      {
        isLoading || error ? (
          isLoading ? (
            <p
              style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '12px' }}
            >
              Fetching data...
            </p>
          ) : (
            error ? (
              <p
                style={{ fontWeight: 'bold', color: '#fc413a', textAlign: 'center', fontSize: '12px' }}
              >
                {message ?? 'No error message provided.'}
              </p>
            ) : null
          )
        ) : (
          <div className={Styles.resultsDiv}>
            <div className={Styles.resultContainerDiv}>
              <p>URL Response</p>

              <pre className={Styles.resultBoxDiv}>
                {
                  response ?
                    JSON.stringify(response, null, 2) :
                    (
                      <div style={{ fontStyle: 'italic' }}>
                        Empty
                      </div>
                    )
                }
              </pre>
            </div>

            <div className={Styles.resultContainerDiv}>
              <p>Processed URL Response</p>

              <pre className={Styles.resultBoxDiv}>
                {
                  result ?
                    JSON.stringify(result, null, 2) :
                    (
                      <div style={{ fontStyle: 'italic' }}>
                        Empty
                      </div>
                    )
                }
              </pre>
            </div>
          </div>
        )
      }
    </div>
  )
}