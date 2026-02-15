import { 
  CONFIG_COMERCIAL, 
  TABLA_DESCUENTOS, 
  TABLA_COMISIONES, 
  BONOS_META 
} from './config';

export function obtenerDescuento(usuarios: number): number {
  const rango = TABLA_DESCUENTOS.find(r => usuarios >= r.min);
  return rango ? rango.descuento : 0.10;
}

export function obtenerComisionManuela(ventaNeta: number): number {
  const rango = TABLA_COMISIONES.find(r => ventaNeta >= r.min);
  return rango ? rango.comision : 0.07;
}

export function obtenerBonoMeta(ventaNeta: number): number {
  const rango = BONOS_META.find(r => ventaNeta >= r.min);
  return rango ? rango.bono : 0;
}

export interface ResultadoProyecto {
  tarifaBase: number;
  precioFacturado: number;
  ventaBrutaTotal: number;
  porcentajeDescuento: number;
  valorDescuento: number;
  ventaNetaFacturada: number;
  desglose: {
    reteFuente: number;
    reteIca: number;
    seguridadSocial: number;
    totalDeduccionesLey: number;
    ingresoReal: number;
    porcentajeComision: number;
    comisionVariable: number;
    bonoMeta: number;
    totalComisionVendedor: number;
  };
  alertas: string[];
}

export function calcularProyecto(
  tarifaBase: number,
  usuarios: number,
  meses: number
): ResultadoProyecto {
  // 1. Calcular precio facturado (incluye retención en la fuente)
  const precioFacturado = tarifaBase / (1 - CONFIG_COMERCIAL.RETENCION_FUENTE);
  
  // 2. Venta bruta y descuento
  const ventaBrutaTotal = precioFacturado * usuarios * meses;
  const porcentajeDescuento = obtenerDescuento(usuarios);
  const valorDescuento = ventaBrutaTotal * porcentajeDescuento;
  const ventaNetaFacturada = ventaBrutaTotal - valorDescuento;

  // 3. Deducciones de ley
  const reteFuente = ventaNetaFacturada * CONFIG_COMERCIAL.RETENCION_FUENTE;
  const reteIca = ventaNetaFacturada * CONFIG_COMERCIAL.RETE_ICA;
  
  // Seguridad social sobre la tarifa base (la que realmente reciben)
  const tarifaRealTotal = tarifaBase * usuarios * meses * (1 - porcentajeDescuento);
  const seguridadSocial = 
    (tarifaRealTotal * CONFIG_COMERCIAL.SEGURIDAD_SOCIAL_BASE) * CONFIG_COMERCIAL.SEGURIDAD_SOCIAL_TARIFA;
  
  const totalDeduccionesLey = reteFuente + reteIca + seguridadSocial;

  // 4. Ingreso real después de deducciones
  const ingresoReal = ventaNetaFacturada - totalDeduccionesLey;

  // 5. Comisión vendedor (sobre venta neta facturada)
  const porcentajeComision = obtenerComisionManuela(ventaNetaFacturada);
  const comisionVariable = ventaNetaFacturada * porcentajeComision;
  const bonoMeta = obtenerBonoMeta(ventaNetaFacturada);
  const totalComisionVendedor = comisionVariable + bonoMeta;

  const alertas: string[] = [];
  
  if (usuarios < 10) {
    alertas.push('💡 Considerar negociar mayor volumen para mejor descuento.');
  }

  if (ventaNetaFacturada < 500000) {
    alertas.push('💡 Proyecto de bajo monto. Evaluar esfuerzo comercial.');
  }

  return {
    tarifaBase,
    precioFacturado,
    ventaBrutaTotal,
    porcentajeDescuento,
    valorDescuento,
    ventaNetaFacturada,
    desglose: {
      reteFuente,
      reteIca,
      seguridadSocial,
      totalDeduccionesLey,
      ingresoReal,
      porcentajeComision,
      comisionVariable,
      bonoMeta,
      totalComisionVendedor,
    },
    alertas,
  };
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
