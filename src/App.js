import './App.scss'
import ApolloProvider from './ApolloProvider'
import { AuthProvider } from './context/auth'
import { MessageProvider } from './context/message'
import { BrowserRouter, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Home } from './pages/Home'
import AuthRouteComponent from './components/AuthRouteComponent'
import { Chatroom } from './pages/Chatroom'

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <AuthRouteComponent exact path="/" component={Home} authenticated />
                <AuthRouteComponent path="/chat" component={Chatroom} authenticated />
                <AuthRouteComponent path="/register" component={Register} guest />
                <AuthRouteComponent path="/login" component={Login} guest />
              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App