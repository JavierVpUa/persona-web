/* eslint-disable jsdoc/require-returns */
'use client'

import {getAllData, saveData} from '@/lib/mongodb/mongodb-client'
import {getLLMSArr, getPersonaArr} from '@/lib/persona'
import React, {useEffect} from 'react'

import {useApiKey} from '@/lib/hooks/use-api-key'
import {useZustand} from '@/lib/store/use-zustand'
import {getTranscriptArr} from '../../lib/persona'
import {Dashboard} from './dashboard'
import Setting from './setting/setting'
import {Transcripts} from './transcripts/transcripts'
import VoiceChat from './voice-chat/voice-chat'


let isFirst = true


/**
 *
 */
export default function SignHome({session}: {session: any}) {
  const {selMenu, setCurEmail, status, setStatus, setApiKeyArr, isUser, setIsUser, setSelMenu, setPersonaAction, setPersonaClient, setPersonaArr, setLLMSArray, setTranscriptArr} = useZustand()
  const apiKey = useApiKey()

  useEffect(() => {
    (async () => {
      const newCurEmail = session?.user?.email

      if (!newCurEmail || status || !isFirst) {
        return
      }

      isFirst = false
      setStatus('Loading...')
      console.log('SignHome#useEffect')
      setCurEmail(newCurEmail)
      const newApiKeyArr = await getAllData()
      const isRealUser = !!newApiKeyArr.find((apiKeyObj: any) => apiKeyObj.emailArr.find((emailObj: any) => emailObj.name === newCurEmail))

      if (!isRealUser) {
        const newTeam = {
          name: newCurEmail,
          emailArr: [{
            name: newCurEmail,
          }],
          manager: newCurEmail,
        }

        const res = await saveData(newTeam)

        if (res?.data?.insertedId) {
          newApiKeyArr.push({...newTeam, _id: res.data.insertedId})
        }
      }

      console.log('SignHome#useEffect: newApiKeyArr: ', newApiKeyArr)
      setApiKeyArr(newApiKeyArr)
      setSelMenu('transcripts')

      console.log('SignHome#useEffect: apiKey: ', apiKey)
      const script = document.createElement('script')
      script.src = `https://api.sindarin.tech/PersonaClientPublic?apikey=${apiKey}`
      document.head.appendChild(script)

      script.addEventListener('load', () => {
        if (window.PersonaClient) {
          const newPersonaClient = new window.PersonaClient(apiKey)
          newPersonaClient.on('json', ({detail}: any) => {
            console.log('persona action is ', detail)

            if (Object.keys(detail).length > 0 && !detail.transcription) {
              setPersonaAction(detail)
            }
          })

          console.log('SignHome#useEffect#script#load: newPersonaClient: ', newPersonaClient)
          setPersonaClient(newPersonaClient)
        }
      })

      const newPersonaArr = await getPersonaArr(apiKey)
      console.log('SignHome#useEffect: newPersonaArr: ', newPersonaArr)
      const llmsArr = await getLLMSArr(apiKey)
      console.log('SignHome#useEffect: llmsArr: ', llmsArr)

      if (Array.isArray(newPersonaArr)) {
        setPersonaArr(newPersonaArr)
        const newTranscriptArr: Array<any> = []

        // eslint-disable-next-line guard-for-in
        for (const i in newPersonaArr) {
          const personaId = newPersonaArr[i]._id
          const personaName = newPersonaArr[i].name

          if (personaId && personaName) {
            const additionalTranscriptArr = await getTranscriptArr(apiKey, personaId)
            console.log('SignHome#useEffect: additionalTranscriptArr: ', additionalTranscriptArr)
            newTranscriptArr.push(...additionalTranscriptArr.map((t: any) => ({...t, personaId, personaName})))
          }
        }

        setTranscriptArr(newTranscriptArr)
        setStatus('')
      } else {
        setStatus('API key seems to be incorrect.')
      }

      if (Array.isArray(llmsArr)) {
        console.log('GOT LLMS', llmsArr)
        setLLMSArray(llmsArr)
      }

      setIsUser(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  console.log('SignHome: status: ', status)

  return isUser ? (
    <>
      {selMenu === 'setting' && <Setting/>}
      {selMenu === 'voiceChat' && <VoiceChat/>}
      {selMenu === 'transcripts' && <Transcripts/>}
      {selMenu === 'dashboard' && <Dashboard/>}
    </>
  ) : (
    <div className='z-10 w-full p-6 text-center text-text-gray'>{status || 'Loading...'}</div>
  )
}
