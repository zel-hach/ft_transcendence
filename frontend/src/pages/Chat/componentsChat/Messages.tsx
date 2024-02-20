import React from 'react'

import Head from './Head'

import Message from './message'
import Input from './Input'

export default function Messages(props: any) {

  return (
    <div className='conversation'>
      <div className='messages'>
        <Head status={props.status} avatar = {props.avatar} name={props.name} ischannel={props.ischannel} myid={props.login} friendid={props.friendid} conversationid={props.conversationid} ></Head>
        <Message conversationid={props.conversationid} login={props.login} messages={props.messages} setData={props.setData} ischannel={props.ischannel}></Message>
        <Input conversationid={props.conversationid} login={props.login} reciveId={props.friendid} messages={props.messages} setData={props.setData}></Input>
      </div>
    </div>
  )
}
