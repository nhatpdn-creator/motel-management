import { userMessages } from "src/users/users.utils";

export const PRISMA_ERRORS = {
    P2002: userMessages.ERROR.ALREADY_EXISTS,
    P2025: userMessages.ERROR.NOT_FOUND,
    DEFAULT: 'Database error occured',
};