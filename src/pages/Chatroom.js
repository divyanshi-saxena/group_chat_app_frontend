import React, { useEffect, Fragment, useState } from 'react'
import { Col, Form, Button } from 'react-bootstrap'
import { gql, useLazyQuery, useMutation, useSubscription } from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../context/message'
import Message from './Message'

const GET_MESSAGES = gql`
  query getMessages($to: String!){
    getMessages(to: $to){
      content from to createdAt
    }
  }
`

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String! $content: String!){
    sendMessage(to: $to content: $content){
      id content from to createdAt
    }
  }
`

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage{
      id from content to createdAt
    }
  }
`
export const Chatroom = () => {
  // const { user } = useAuthState()
  const { groups } = useMessageState()
  const dispatch = useMessageDispatch()
  const [content, setContent] = useState('')

  const selectedGroup = groups?.find(group => group.selected === true)
  // console.log('selected group : ', selectedGroup)
  const messages = selectedGroup?.messages
  // console.log('messages: ', messages)

  const { data: messageData, error: messageError } = useSubscription(NEW_MESSAGE)

  const [getMessages, { loading: messagesLoading, data: messagesData }] = useLazyQuery(GET_MESSAGES)

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),  
  })

  useEffect(() => {
    if (messageError) console.log(messageError)
    if (messageData) {
      const message = messageData.newMessage
      dispatch({
        type: 'ADD_MESSAGE', payload: {
          groupname: message.to,
          message
        }
     })
    }
  }, [messageError, messageData])

  useEffect(() => {
    if (selectedGroup && !selectedGroup.messages) {
      getMessages({ variables: { to: selectedGroup.groupname } })
    }
  }, [selectedGroup])

  useEffect(() => {
    if (messagesData) {
      console.log('messages Data : ', messagesData)
      dispatch({
        type: 'SET_GROUP_MESSAGES', payload: {
          groupname: selectedGroup.groupname,
          messages: messagesData.getMessages
      } })
    }
  },[messagesData])

  const submitMessage = (e) => {
    e.preventDefault()
    if (content.trim() === '' || !selectedGroup) return
    console.log('send message: ', content)
    setContent('')
    //mutation for sending a message
    sendMessage({
      variables: {
        to: selectedGroup.groupname,
        content
    }})
  }

  let selectedChatMarkup
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">loading...</p>
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.id}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0"/>
          </div>
        )}
      </Fragment>
    ))
  } else if (messages.length === 0) {
    selectedChatMarkup = <p className="info-text">You are now connected! send your first message</p>
  }

  const home = () => {
    window.location.href = '/'
  }
  return (
    <Col xs={10} md={8} className="chat-box p-2">
      <div className="d-flex justify-content-end m-3">
        <Button variant="outline-danger" className="leave-room"
          onClick={home}>Leave Room</Button>
      </div>

      <div className="messages-box d-flex flex-column-reverse my-3 p-3">
        {selectedChatMarkup}
      </div>
      
      <div className="px-3 py-2 mb-3 mt-2">
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Control type="text" className="message-input rounded-pill p-3 border-0"
              placeholder="Type a message..." value={content}
              onChange={(e) => setContent(e.target.value)} />
            <i className="fas fa-paper-plane fa-2x text-primary ms-2"
              role="button"
              onClick={submitMessage}></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  )
}