export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    [key: string]: unknown;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
}

export interface RegistroPayload {
    nombre: string;
    email: string;
    password: string;
}

export interface Crisis {
    id: number;
    fecha_hora: string;
    duracion_minutos: number;
    tipo_crisis: string;
    sintomas?: string;
    desencadenantes?: string;
    observaciones?: string;
}

export interface CrisisPayload {
    fecha_hora: string;
    duracion_minutos: number | string;
    tipo_crisis: string;
    sintomas: string;
    desencadenantes: string;
    observaciones: string;
}

export interface Medicamento {
    id: number;
    nombre: string;
    dosis?: string;
    frecuencia?: string;
    horarios?: string;
    indicaciones?: string;
    activo?: boolean | number;
}

export interface RegistroToma {
    id: number;
    medicamento_id: number;
    fecha_hora: string;
    tomado?: boolean | number;
}

export type MedicamentoPayload = Omit<Medicamento, 'id'>;

export interface Contacto {
    id: number;
    nombre: string;
    parentesco?: string;
    telefono: string;
    es_principal?: boolean | number;
}

export type ContactoPayload = Omit<Contacto, 'id'>;

export interface PlanSeguridad {
    pasos_crisis: string;
    cuando_llamar: string;
    desencadenantes: string;
    medico_nombre: string;
    medico_telefono: string;
    hospital_referencia: string;
    notas: string;
}
