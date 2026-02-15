export const CONFIG_COMERCIAL = {
  RETENCION_FUENTE: 0.11,
  RETE_ICA: 0.008,
  SEGURIDAD_SOCIAL_BASE: 0.40,
  SEGURIDAD_SOCIAL_TARIFA: 0.29,
  GASTOS_FIJOS_MES: 1900000,
  BASICO_MANUELA_MES: 1000000,
  HONORARIOS_FUNDADORES_MES: 2000000,
};

export const TABLA_DESCUENTOS = [
  { min: 61, descuento: 0.20, label: '20% (>60 usuarios)' },
  { min: 31, descuento: 0.15, label: '15% (31-60 usuarios)' },
  { min: 11, descuento: 0.12, label: '12% (11-30 usuarios)' },
  { min: 1, descuento: 0.10, label: '10% (1-10 usuarios)' },
];

export const TABLA_COMISIONES = [
  { min: 30000000, comision: 0.12, label: '12% (>$30M)' },
  { min: 10000000, comision: 0.10, label: '10% ($10M-$30M)' },
  { min: 0, comision: 0.07, label: '7% (<$10M)' },
];

export const BONOS_META = [
  { min: 35000000, bono: 700000, label: '$700k (≥$35M)' },
  { min: 20000000, bono: 400000, label: '$400k ($20M-$35M)' },
  { min: 10000000, bono: 200000, label: '$200k ($10M-$20M)' },
  { min: 0, bono: 0, label: '$0 (<$10M)' },
];

export const PLANES = [
  {
    id: 'basico',
    nombre: 'Plan Básico',
    tarifaBase: 25000,
    descripcion: 'Acceso a cursos fundamentales',
  },
  {
    id: 'completo',
    nombre: 'Plan Completo',
    tarifaBase: 50000,
    descripcion: 'Acceso total a todos los cursos',
  },
  {
    id: 'empresa',
    nombre: 'Plan Empresarial',
    tarifaBase: 160000,
    descripcion: 'Para equipos corporativos',
  },
];
