import type { MockMethod } from 'vite-plugin-mock'
import user from './user'

export default [...user] as MockMethod[]

