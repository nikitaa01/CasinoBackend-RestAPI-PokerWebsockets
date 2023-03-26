import { Decimal } from "@prisma/client/runtime/binary"

export default interface User {
    id: string
    email: string
    password: string
    coin_balance: Decimal
    first_name: string
    last_name: string
    avatar_url: string
    oauth_provider: string | null
    oauth_provider_id: string | null
    created_at: Date
    updated_at: Date
}
