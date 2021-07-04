import React, { createContext, useContext, useReducer } from 'react'

const MessageStateContext = createContext()
const MessageDispatchContext = createContext()

const messageReducer = (state, action) => {
  let groupsCopy, groupIndex
  const { groupname, message, messages } = action.payload
  switch (action.type) {
    case 'SET_GROUPS':
      return {
        ...state,
        groups: action.payload
      }
    case 'SET_GROUP_MESSAGES':
      groupsCopy = [...state.groups]
      groupIndex = groupsCopy.findIndex(group => group.groupname === groupname)
      groupsCopy[groupIndex] = {...groupsCopy[groupIndex], messages}
      return {
        ...state,
        groups: groupsCopy
      }
    case 'SET_SELECTED_GROUP':
      groupsCopy = state.groups.map(group => ({
        ...group,
        selected: group.groupname === action.payload
      }))
      return {
        ...state,
        groups: groupsCopy
      }
    case 'ADD_MESSAGE':
      groupsCopy = [...state.groups]
      groupIndex = groupsCopy.findIndex(group => group.groupname === groupname)
      let newGroup = {
        ...groupsCopy[groupIndex],
        messages: groupsCopy[groupIndex].messages
          ? [message, ...groupsCopy[groupIndex].messages]
          : null
      }
      groupsCopy[groupIndex] = newGroup
      console.log('new group : ', newGroup)
      return {
        ...state,
        groups: groupsCopy
      }
  }
}
export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { groups: null })
  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  )
}

export const useMessageState = () => useContext(MessageStateContext)
export const useMessageDispatch = () => useContext(MessageDispatchContext)