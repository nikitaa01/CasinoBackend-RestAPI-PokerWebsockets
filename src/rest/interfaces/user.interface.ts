export default interface User {
    id: number
    name: string
    email: string
    password: string
    coin_balance: number
    avatar_url: string | null
}