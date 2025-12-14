import type { MockMethod } from 'vite-plugin-mock'
import user from './user'
import permission from './permission'
import role from './role'

export default [...user, ...permission, ...role] as MockMethod[]
