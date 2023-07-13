import { loadAsync, selectData, selectStatus } from './redux/load'

import { loadsAsync, selectsData, selectsStatus } from './redux/loads'

import { useAppDispatch, useAppSelector } from './hooks'
import { useCallback, useEffect, useRef, useState } from 'react'
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

  const [, updateState] = useState<Object>()
  const forceUpdate = useCallback(() => updateState({}), [])
  const perPage = 10
  const page = useRef(0)
  const max = useRef(0)
  const cols = { name: 'Obchodní jméno', addr: 'Adresa' }
  const rows = {
    ICO: 'Ičo',
    DIC: 'Dič',
    OF: 'Obchodní jméno',
    DV: 'Datum vložení',
    NPF: 'Typ',
    UC: 'Ulice',
    PB: 'Město',
    OC: 'Obor činnosti',
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
    max.current = Math.ceil(loadsNameRedux.length / perPage) - 1
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

  const list = (pageChange?: number) => {
    page.current = pageChange ? page.current + pageChange : pageChange === 0 ? 0 : max.current
    if (page.current > max.current) page.current = max.current
    if (page.current < 0) page.current = 0
    forceUpdate()
  }

  const pagination = () => (
    <div className='pagination'>
      <button type='button' onClick={() => list(0)}>
        ⇦
      </button>
      <button type='button' onClick={() => list(-1)}>
        ⬅
      </button>
      {page.current + 1}
      <button type='button' onClick={() => list(1)}>
        ➡
      </button>
      <button type='button' onClick={() => list()}>
        ⇨
      </button>
    </div>
  )

  const resetPage = () => {
    page.current = 0
    forceUpdate()
  }

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
                      {key === 'OC'
                        ? load[key as keyof typeof load].split('*').map(line => {
                            return (
                              <>
                                {line} <br />
                              </>
                            )
                          })
                        : load[key as keyof typeof load]}
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
            resetPage()
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
              <>
                <table>
                  <thead>
                    {max.current > 1 && (
                      <tr>
                        <th colSpan={Object.keys(cols).length}>{pagination()}</th>
                      </tr>
                    )}
                    <tr>
                      {Object.keys(cols).map((key: string, index: number) => (
                        <th
                          key={index}
                          onClick={e => {
                            setSortBy(key)
                            resetPage()
                          }}
                        >
                          {cols[key as keyof typeof cols]}
                        </th>
                      ))}
                    </tr>
                  </thead>
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
                    )
                      .slice(page.current * perPage, (page.current + 1) * perPage)
                      .map((name, index) => (
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
                  {max.current > 1 && (
                    <tfoot>
                      <tr>
                        <th colSpan={Object.keys(cols).length}>{pagination()}</th>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </>
            )}
      </div>
    </div>
  )
}
export default Ares
