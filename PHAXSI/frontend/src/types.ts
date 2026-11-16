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

export interface Perfil {
    id: number;
    nombre: string;
    email: string;
    rol?: string;
    telefono: string | null;
    fecha_nacimiento: string | null;
    tipo_sangre: string | null;
    condiciones_adicionales: string | null;
    alergias: string | null;
    contacto_medico: string | null;
    creado_en?: string;
}

export interface PerfilPayload {
    nombre: string;
    telefono: string;
    fecha_nacimiento: string;
    tipo_sangre: string;
    condiciones_adicionales: string;
    alergias: string;
    contacto_medico: string;
}

export interface PlanSeguridad {
    pasos_crisis: string;
    cuando_llamar: string;
    desencadenantes: string;
    medico_nombre: string;
    medico_telefono: string;
    hospital_referencia: string;
    notas: string;
}
