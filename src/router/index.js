
import Login from '../components/Login'
import Home from '../components/Home'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  } ,
  {
    path: '/home',
    component: Home,
    children: [
      // { path: '/refresh', component: refresh, name: 'refresh' }
    ]
  },
]
export default routes
