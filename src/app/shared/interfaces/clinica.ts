import { Especialista, Paciente } from "../services/clinica-usuarios.service";

export type NumeroConsultorio = 1 | 2 | 3 | 4 | 5 | 6;

export interface FranjaHoraria {
  inicio: number;
  fin: number;
}

export interface Ocupacion {
  especialistaId: string; // ID del especialista
  franjaHoraria: FranjaHoraria;
  dia: claveDia;
}

export interface Consultorio {
  numero: NumeroConsultorio;
  ocupaciones: Ocupacion[];
}

export type valorDia = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type claveDia = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';


export const recordDia: Record<claveDia, string> = {
  'lunes': 'Lunes',
  'martes': 'Martes',
  'miercoles': 'Miércoles',
  'jueves': 'Jueves',
  'viernes': 'Viernes',
  'sabado': 'Sábado',
  'domingo': 'Domingo'
};
export const diaValorClave: Record<valorDia, claveDia> = {
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
  7: 'domingo'
};

export const HORARIO_CLINICA = {
  lunes: { inicio: 8, fin: 19 },
  martes: { inicio: 8, fin: 19 },
  miercoles: { inicio: 8, fin: 19 },
  jueves: { inicio: 8, fin: 19 },
  viernes: { inicio: 8, fin: 19 },
  sabado: { inicio: 8, fin: 14 },
  domingo: null,
};

export interface PosibleTurno {
  fecha: Date,
  minutosDuracion: number,
  especialistaId: string,
  especialidad: string,
  consultorio: number,
  especialistaNombre: string,
}
export interface Turno {
  fecha: Date,
  minutosDuracion: number,
  especialistaId: string,
  especialidad: string,
  consultorio: number,
  pacienteId: string,
  estado: 'pendiente' | 'confirmado' | 'cancelado';
}

export const especialidadesNombres: Record<string, string> = {
  'cardiologia': 'Cardiología',
  'neurologia': 'Neurología',
  'dermatologia': 'Dermatología',
  'pediatria': 'Pediatría',
};
