import React, {useState} from 'react'
import { useAuthState } from '../context/auth'
import classNames from 'classnames'
import moment from 'moment'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default function Message({ message }) {
  
  const {user} = useAuthState()
  const sent = message.from === user.username
  const received = !sent
 
  return (
    <div className={classNames('d-flex flex-column my-1', {
      'ms-auto': sent,
      'me-auto': received
    })}>
    {/* <OverlayTrigger
      placement={'top'}
      overlay={
        <Tooltip>
          {moment(message.createdAt).format('MMM DD, YYYY @ h:mm a')}
        </Tooltip>
      }
      transition={false}>
      
      
        
      

      </OverlayTrigger> */}
      <div className={classNames('position-relative pt-3 px-3 rounded-pill', {
        'bg-primary text-end': sent,
        'bg-light text-start': received
      })}>

        <p className={classNames({'text-white': sent})} key={message.id}>{message.content}</p>
      </div>
      <div className={classNames('text-end', {
        'text-end': sent,
        'text-start': received
      })}>
          <p>{message.from}: {moment(message.createdAt).format('DD MMM @ h:mm a')}</p>
      </div>
    </div>
  )
}
