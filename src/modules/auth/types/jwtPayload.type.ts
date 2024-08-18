import { UUID } from "crypto";

export type JwtPayload = {
    user_id: string|UUID;
    full_name: string;
    email: string;
    google_id: string;
}