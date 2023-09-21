/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsdoc/require-returns */
'use client'

import React, {useEffect} from 'react'
import {useZustand} from '@/lib/store/use-zustand'
import {getAllData} from '@/lib/mongodb/mongodb-client'
import TeamKey from './team-key'


/**
 *
 */
export default function ApiKeyAssign() {
  const {apiKeyArr, setApiKeyArr, status, setStatus} = useZustand()

  const onAddTeam = () => {
    setApiKeyArr([
      ...apiKeyArr,
      {
        name: '',
        apiKey: '',
        emailArr: [],
      },
    ])
  }

  useEffect(() => {
    (async () => {
      if (status) {
        return
      }

      setStatus('Loading...')
      const newApiKeyArr = await getAllData()
      setApiKeyArr(newApiKeyArr)
      setStatus('')
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center w-full gap-2 p-4 border border-gray-900 rounded">
      <div className="flex items-center justify-center gap-4">
        <div className="text-xl">API Key Assignment</div>
        {status ?
          <div className='text-xl text-blue-500'>{status}</div> :
          <div
            className='px-4 py-2 text-white bg-green-500 rounded-full cursor-pointer hover:text-black'
            onClick={onAddTeam}
          >
            Add Team
          </div>
        }
      </div>
      {!status && apiKeyArr?.map((apiKeyObj, index) =>
        <TeamKey
          key={index}
          apiKeyIndex={index}
          data={apiKeyObj}
        />,
      )}
    </div>
  )
}
