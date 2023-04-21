import menuStatus from "../types/menuStatus"
import turnAction from "../types/turnAction"

export default interface Msg {
    menu?: menuStatus
    uid?: string
    turnAction?: turnAction
    amount?: number
    gid?: string
    reward?: number
}