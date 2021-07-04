import React, { Fragment, useState, useEffect } from 'react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { useAuthDispatch, useAuthState } from '../context/auth'
import { useMessageState, useMessageDispatch } from '../context/message'
import { Row, Col, Button, Card } from 'react-bootstrap'
import classNames from 'classnames'
import moment from 'moment'
import { Chatroom } from './Chatroom'

const GET_GROUP_COUNT = gql`
  query getGroupCount{
    getGroupCount
  }
`

const GET_GROUPS = gql`
  mutation getGroups($page: Int!){
    getGroups(page: $page){
      groupname groupdesc createdAt
    }
  }
`
export const Home = () => {
  const authDispatch = useAuthDispatch()
  // const { user } = useAuthState()
  const dispatch = useMessageDispatch()
  const { groups } = useMessageState()
  const selectedGroup = groups?.find(group => group.selected === true)?.groupname
  const [clicked, setClicked] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalGroups, setTotalGroups] = useState(0)
  // const [totalPages, setTotalPages] = useState([])
  let pageNumbers = []
  // const [groups, setGroups] = useState([])

  // const [getGroups, { loading, data, error }] = useLazyQuery(GET_GROUPS)
  // const { loading } = useMutation(GET_GROUPS, {
  //   onCompleted: (data) => dispatch({ type: 'SET_GROUPS', payload: data.getGroups }),
  //   onError: (err) => console.log('error in query: ', err)
  // })

  const [getGroupCount] = useLazyQuery(GET_GROUP_COUNT, {
    onError: (err) => console.log('errrrrr', err),
    onCompleted: (data) => {
      console.log('count: ', data)
      setTotalGroups(data.getGroupCount)
    }
  })

  

  const [getGroups, { loading }] = useMutation(GET_GROUPS, {
    onError: (err) => console.log(err),
    onCompleted: (data) => dispatch({ type: 'SET_GROUPS', payload: data.getGroups })
  })

  if (totalGroups > 0) {
    for (let i = 1; i <= Math.ceil(totalGroups / 3); i++){
      pageNumbers.push(i)
    }
  }
  
  
  useEffect(() => {
    getGroupCount()
    console.log('total groups: ', totalGroups)
    getGroups({
      variables: {
        page: currentPage
      }
    })
  }, [currentPage, totalGroups, getGroupCount, getGroups])

  let groupsMarkup
  if (!groups || loading) {
    groupsMarkup = <p>loading..</p>
  } else if (groups.length === 0) {
    groupsMarkup = <p>no groups created yet</p>
  } else if (groups.length > 0) {
    groupsMarkup = groups.map(group => {
      const selected = selectedGroup === group.groupname
      return (
        <Col sm={12} md={6} lg={4} className="my-2 mx-auto" key={group.groupname}>
        <Card className="text-center pt-1">
          {/* <Card.Header>Featured</Card.Header> */}
          <Card.Body>
            <Card.Title className="text-uppercase">
              {group.groupname}
              {/* title */}
            </Card.Title>
            <Card.Text className="text-capitalize">
              {group.groupdesc}
              {/* text */}
            </Card.Text>
            <Button variant="primary"
              className={classNames("mb-3",{ 'btn-warning': selected })}
                onClick={() => {
                  dispatch({ type: 'SET_SELECTED_GROUP', payload: group.groupname })
                  setClicked(true)
                  }
                }>
                Enter group
              </Button>
          </Card.Body>
          <Card.Footer className="text-muted">
            Created: {moment(group.createdAt).format('MMM DD, YYYY @ h:mm a')}
            {/* footer */}
          </Card.Footer>
        </Card></Col>
      )
    })
  }
  
  const logout = () => {
    authDispatch({ type: 'LOGOUT' })
    window.location.href = '/login'
  }

  const paginate = (pageNumber) => {
    console.log('selected page number: ', pageNumber)
    setCurrentPage(pageNumber)
  }
  return (
    <Fragment>
      <Row className="justify-content-end mx-auto mb-3">
        <Col className="text-end">
          <Button variant="link" className="btn-light text-decoration-none"
            onClick={logout}>Logout</Button>
        </Col>
      </Row>
      <Row>
        {clicked === false ? groupsMarkup : <Chatroom />}
      </Row>
      
      <nav>
        {clicked === false ? (
          <ul className="pagination justify-content-end">
        {pageNumbers.map(page => (
          <li className="page-item" key={page}>
            {/* <a onClick={() => paginate(page)} href="#" className="page-link">{page}</a> */}
            <Button variant="link" className="page-link" onClick={() => paginate(page)}>
              {page}
            </Button>
          </li>
        ))}
      </ul>
        ) : ''}
      </nav>
      
    </Fragment>
  )
}
