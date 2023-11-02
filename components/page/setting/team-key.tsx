

/* eslint-disable jsdoc/require-returns */
'use client'

import {removeData, saveData} from '@/lib/mongodb/mongodb-client'
import React, {useState} from 'react'

import {Button} from '@/components/shared/button'
import {InputText} from '@/components/shared/input-text'
import {UserSelect} from '@/components/shared/user-select'
import {ADMIN_EMAIL} from '@/lib/constants'
import {useZustand} from '@/lib/store/use-zustand'
import {AiOutlineCloseCircle} from 'react-icons/ai'

/**
 *
 */
export default function TeamKey({apiKeyIndex, data}: any) {
  const {apiKeyArr, setApiKeyArr, curEmail} = useZustand()
  const [status, setStatus] = useState('')
  const isAdmin = curEmail === ADMIN_EMAIL
  const isManager = isAdmin || curEmail === apiKeyArr.find((apiKeyObj) => apiKeyObj.emailArr.find((emailObj: any) => emailObj.name === curEmail))?.manager

  const onNameChange = (event: any) => {
    const newApiKeyArr = [...apiKeyArr]
    newApiKeyArr[apiKeyIndex].name = event.target.value
    setApiKeyArr(newApiKeyArr)
  }

  const onApiKeyChange = (event: any) => {
    const newApiKeyArr = [...apiKeyArr]
    newApiKeyArr[apiKeyIndex].apiKey = event.target.value
    setApiKeyArr(newApiKeyArr)
  }

  const onManagerChange = (event: any) => {
    const newApiKeyArr = [...apiKeyArr]
    newApiKeyArr[apiKeyIndex].manager = event.target.value
    setApiKeyArr(newApiKeyArr)
  }

  const onAddEmail = () => {
    const newApiKeyArr = [...apiKeyArr]
    newApiKeyArr[apiKeyIndex].emailArr.push({name: ''})
    setApiKeyArr(newApiKeyArr)
  }

  const onSave = async () => {
    setStatus('Saving...')
    const res = await saveData(data)

    if (res?.data?.insertedId) {
      const newApiKeyArr = [...apiKeyArr]
      newApiKeyArr[apiKeyIndex]._id = res.data.insertedId
      setApiKeyArr(newApiKeyArr)
    }

    setStatus('Success')
  }

  const onRemove = async () => {
    if (apiKeyArr[apiKeyIndex]?._id) {
      setStatus('Removing...')
      await removeData(apiKeyArr[apiKeyIndex]._id)
      setStatus('Success')
    }

    setApiKeyArr(apiKeyArr.filter((apiKeyObj, index) => index !== apiKeyIndex))
  }

  const onEmailChange = (emailIndex: number, email: string) => {
    const newApiKeyArr = [...apiKeyArr]
    newApiKeyArr[apiKeyIndex].emailArr[emailIndex].name = email
    setApiKeyArr(newApiKeyArr)
  }

  const onEmailRemove = (emailIndex: number) => {
    const newApiKeyArr = [...apiKeyArr]
    const emailArr = newApiKeyArr[apiKeyIndex].emailArr.filter((emailObj: any, index: number) => index !== emailIndex)
    newApiKeyArr[apiKeyIndex].emailArr = emailArr

    if (newApiKeyArr[apiKeyIndex].manager && !emailArr.find((emailObj: any) => emailObj.name === newApiKeyArr[apiKeyIndex].manager)) {
      newApiKeyArr[apiKeyIndex].manager = ''
    }

    setApiKeyArr(newApiKeyArr)
  }

  return (
    <div className="flex flex-col w-full gap-2 p-2 border border-gray-200">
      {isManager &&
        <div className="flex items-center w-full gap-4">
          <Button onClick={onAddEmail}>Add Email</Button>
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onRemove}>Remove</Button>
          <div className='text-blue-500'>{status}</div>
        </div>
      }
      <div className="flex items-center w-full gap-4">
        <div className='text-sm whitespace-nowrap'>Team Name:</div>
        <InputText
          value={data?.name}
          placeholder="Team Name"
          onChange={onNameChange}
          disabled={!isAdmin && !isManager}
        />
        <div className='text-sm whitespace-nowrap'>API Key:</div>
        <InputText
          value={data?.apiKey}
          placeholder="API Key"
          onChange={onApiKeyChange}
          disabled={!isAdmin && !isManager}
        />
        {isAdmin &&
          <>
            <div className='text-sm whitespace-nowrap'>Manager:</div>
            <UserSelect
              value={data?.manager}
              onChange={onManagerChange}
            >
              <option value=''/>
              {Array.isArray(data?.emailArr) && data.emailArr.map((emailObj: any, index: number) =>
                emailObj.name && <option key={index} value={emailObj.name}>{emailObj.name}</option>,
              )}
            </UserSelect>
          </>
        }
      </div>
      {!!(Array.isArray(data?.emailArr) && data.emailArr.length) &&
        <div className="flex flex-wrap items-center w-full gap-2">
          {data?.emailArr?.map((emailObj: any, index: number) =>
            <div
              key={index}
              className="flex items-center gap-1 p-1 border border-gray-200 rounded"
            >
              <InputText
                // className="text-xs border-none outline-none rounded px-2 py-0.5"
                value={emailObj.name}
                placeholder="Email"
                onChange={(event) => onEmailChange(index, event.target.value)}
                disabled={!isAdmin && (!isManager || curEmail === emailObj.name)}
              />
              {(isAdmin || (isManager && curEmail !== emailObj.name)) &&
                <AiOutlineCloseCircle
                  className="text-xl text-gray-500 cursor-pointer hover:text-black"
                  onClick={() => onEmailRemove(index)}
                />
              }
            </div>,
          )}
        </div>
      }
    </div>
  )
}
