import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PRISMA_ERRORS } from '../constants/prisma-errors';

@Catch() 
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let status = 
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        
        let message = 
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal server error';
        
        // Convert simple string messages
        if (typeof message === 'string') {
            message = { message };
        }

        /**
         * Database failure handling
         */
        if (exception instanceof Prisma.PrismaClientInitializationError) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = {
                message: 'Database is unavailabe at the moment. Please try again later.',
            };
        }

        /**
         * Prisma known errors handling
         */
        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            const friendlyMessage = 
                PRISMA_ERRORS[exception.code as keyof typeof PRISMA_ERRORS] ||
                PRISMA_ERRORS.DEFAULT;
            
            message= { message: friendlyMessage };

            if (exception.code === 'P2002' || exception.code === 'P2025') {
                status = HttpStatus.BAD_REQUEST;
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }
        /**
         * Centralized logging
         */
        console.error('Exception caught', {
            time: new Date().toISOString(),
            path: request.url,
            method: request.method,
            status,
            message,
            stack:
                exception instanceof Error && exception.stack
                    ? exception.stack
                    : 'No stack trace',
        });

        // Send response to client
        response.status(status).json({
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
            ...message,
        });
    }
}