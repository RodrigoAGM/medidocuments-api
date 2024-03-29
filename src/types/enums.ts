/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */

export enum Role {
    ADMIN,
    DOCTOR,
    PATIENT,
    PHARMACY_ASSISTANT,
    HOSPITAL_CHEMIST,
    DIGEMID_CHEMIST,
}

export enum ClaimStatus {
    PENDING = 'PENDIENTE',
    RESOLVED = 'ATENDIDO',
    REJECTED = 'RECHAZADO'
}

export enum PrescriptionStatus {
    NONE = 'NO ATENDIDO',
    PARTIAL = 'PARCIAL',
    TOTAL = 'TOTAL'
}

export enum ConditionsBase {
    FRIDGE = 'REFRIGERADOR',
    SHELF = 'ESTANTE',
}
