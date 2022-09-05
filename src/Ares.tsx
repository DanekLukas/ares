import { loadAsync, selectData, selectStatus } from './redux/load'

import { loadsAsync, selectsData, selectsStatus } from './redux/loads'

import { useAppDispatch, useAppSelector } from './hooks'
import { useEffect, useRef, useState } from 'react'
const Ares = () => {
  const { loadIcoRedux } = useAppSelector(selectData)
  const { loadsNameRedux } = useAppSelector(selectsData)
  const [load, setLoad] = useState(loadIcoRedux)
  const [names, setNames] = useState(loadsNameRedux)
  const dispatch = useAppDispatch()
  const icoRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [ico, setIco] = useState('')
  const [res, setRes] = useState<JSX.Element | null>(null)
  const [wait, setWait] = useState<JSX.Element | null>(null)
  const [sortBy, setSortBy] = useState<string | undefined>()
  const { statusRedux } = useAppSelector(selectStatus)
  const { statusRedux: statRedux } = useAppSelector(selectsStatus)
  const [icoInput, setIcoInput] = useState('')
  const [icoInputError, setIcoInputError] = useState(false)

  const cols = { name: 'Obchodní jméno', addr: 'Adresa' }
  const rows = {
    ICO: 'Ičo',
    DIC: 'Dič',
    OF: 'Obchodní jméno',
    DV: 'Datum vložení',
  }

  useEffect(() => {
    setLoad(loadIcoRedux)
  }, [loadIcoRedux])

  useEffect(() => {
    if (ico)
      dispatch(
        loadAsync({
          ico: ico,
        })
      )
  }, [ico, dispatch])

  useEffect(() => {
    const tmp = statusRedux === 'loading' ? <div>Načítám ...</div> : null
    setRes(tmp)
  }, [statusRedux])

  useEffect(() => {
    setNames(loadsNameRedux)
  }, [loadsNameRedux])

  useEffect(() => {
    if (name.length > 2)
      dispatch(
        loadsAsync({
          name: name,
        })
      )
  }, [name, dispatch])

  useEffect(() => {
    if (icoInputError) {
      setTimeout(() => setIcoInputError(false), 1000)
    }
  }, [icoInputError])

  useEffect(() => {
    const tmp = statRedux === 'loading' ? <div>Načítám ...</div> : null
    setWait(tmp)
  }, [statRedux])

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ padding: '2rem' }}>
        <form
          onSubmit={e => {
            e.preventDefault()
            setIco(icoRef.current?.value || '')
          }}
        >
          <label htmlFor='ico' style={{ marginRight: '2rem' }}>
            Ičo:
          </label>
          <input
            id='ico'
            type='text'
            ref={icoRef}
            value={icoInput}
            onChange={({ target: { value } }) => {
              const chcode = value.charCodeAt(value.length - 1)
              const numeric =
                (chcode >= '0'.charCodeAt(0) && chcode <= '9'.charCodeAt(0)) || value === ''
              setIcoInput(numeric ? value : icoInput)
              setIcoInputError(!numeric)
            }}
            maxLength={8}
          />
          <button type='submit'>Odeslat</button>
        </form>
        <div>{icoInputError ? 'Ičo se skládá z číslic' : ''}</div>
        {res
          ? res
          : Object.keys(load).map(
              (key, index) =>
                load[key as keyof typeof load] && (
                  <>
                    <div key={index}>
                      <span style={{ color: 'gray' }}>{rows[key as keyof typeof load]}:</span>
                      <br />
                      {load[key as keyof typeof load]}
                    </div>
                  </>
                )
            )}
      </div>
      <div style={{ padding: '2rem' }}>
        <form
          onSubmit={e => {
            e.preventDefault()
            setName(nameRef.current?.value || '')
          }}
        >
          <label htmlFor='name' style={{ marginRight: '2rem' }}>
            Obchodní jméno:
          </label>
          <input id='name' type='text' ref={nameRef} />
          <button type='submit'>Odeslat</button>
        </form>
        {wait
          ? wait
          : names &&
            names.length > 0 && (
              <table>
                <tr>
                  {Object.keys(cols).map((key: string, index: number) => (
                    <th key={index} onClick={e => setSortBy(key)}>
                      {cols[key as keyof typeof cols]}
                    </th>
                  ))}
                </tr>
                <tbody>
                  {(sortBy
                    ? Object.entries(names)
                        .sort(([key1, value1], [key2, value2]) =>
                          value1[sortBy as keyof typeof value1].localeCompare(
                            value2[sortBy as keyof typeof value2]
                          )
                        )
                        .map(name => name[1] || '')
                    : names
                  ).map((name, index) => (
                    <tr
                      key={index}
                      onClick={e => {
                        setIco(name.ico)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {Object.keys(cols).map((key, index) => (
                        <td key={index}>{name[key as keyof typeof name]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
      </div>
    </div>
  )
}
export default Ares
