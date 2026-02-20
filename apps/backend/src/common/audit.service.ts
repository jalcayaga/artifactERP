import { Injectable, Logger } from '@nestjs/common';

export enum AuditAction {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    DTE_ISSUED = 'DTE_ISSUED',
    DTE_SENT = 'DTE_SENT',
    USER_UPDATED = 'USER_UPDATED',
    USER_DELETED = 'USER_DELETED',
    CERTIFICATE_UPLOADED = 'CERTIFICATE_UPLOADED',
    CAF_REGISTERED = 'CAF_REGISTERED',
}

@Injectable()
export class AuditService {
    private readonly logger = new Logger('AuditService');

    log(tenantId: string, userId: string | undefined, action: AuditAction, metadata: any = {}) {
        const auditEntry = {
            timestamp: new Date().toISOString(),
            tenantId,
            userId: userId || 'SYSTEM',
            action,
            ...metadata,
        };

        // For now, we log to stdout in a structured way
        // In a real production environment, this would also write to an 'audit_logs' table
        this.logger.log(`[AUDIT] ${JSON.stringify(auditEntry)}`);
    }
}
