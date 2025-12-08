import type { MockMethod } from 'vite-plugin-mock'
import user from './user'
import permission from './permission'

export default [...user, ...permission] as MockMethod[]
