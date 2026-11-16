import React, { useContext, useMemo } from 'react';
import { Activity, CalendarDays, Clock, Pill } from 'lucide-react';
import type { Crisis } from '../types';
import { AuthContext } from '../context/AuthContext';
import { fetchCrisis, fetchMedicamentos, fetchContactos, apiObtenerPlanSeguridad, apiListarTomas, apiRegistrarToma } from '../services/api';
import { useAsync } from '../hooks/useAsync';
import { resumenCrisis, textoHace, textoDuracion } from '../utils/crisisStats';
import { estadoMedicacionHoy, estaActivo } from '../utils/medicacion';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SafetyPlanCard } from '../components/dashboard/SafetyPlanCard';
import { EmergencyContactCard } from '../components/dashboard/EmergencyContactCard';
import { StatCard } from '../components/dashboard/StatCard';
import { NextMedicationCard } from '../components/dashboard/NextMedicationCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { WellnessTips } from '../components/dashboard/WellnessTips';
import { CrisisTrendChart } from '../components/dashboard/CrisisTrendChart';
import { CrisisTypesChart } from '../components/dashboard/CrisisTypesChart';

const inicioDeHoy = (): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

// fetchCrisis no valida res.ok: si el backend devuelve un error (objeto), lo tratamos como fallo.
const cargarCrisis = async (): Promise<Crisis[]> => {
    const datos = await fetchCrisis();
    if (!Array.isArray(datos)) throw new Error('Respuesta inválida');
    return datos;
};

export const Dashboard = () => {
    const { usuario } = useContext(AuthContext);

    const crisis = useAsync(cargarCrisis);
    const medicamentos = useAsync(fetchMedicamentos);
    const tomas = useAsync(() => apiListarTomas(inicioDeHoy()));
    const contactos = useAsync(fetchContactos);
    const plan = useAsync(apiObtenerPlanSeguridad);

    // Solo se ejecuta cuando el usuario pulsa "Marcar como tomada".
    const marcarToma = async (medicamentoId: number) => {
        await apiRegistrarToma(medicamentoId);
        tomas.reload();
    };

    const resumen = useMemo(() => (crisis.data ? resumenCrisis(crisis.data) : null), [crisis.data]);

    const medsActivos = useMemo(() => (medicamentos.data ?? []).filter(estaActivo), [medicamentos.data]);
    const estadoMeds = useMemo(
        () => (medicamentos.data && tomas.data ? estadoMedicacionHoy(medicamentos.data, tomas.data) : null),
        [medicamentos.data, tomas.data]
    );

    // Indicador 1: crisis este mes (comparado con el mes anterior)
    let detalleMes = '';
    if (resumen) {
        const dif = resumen.totalMes - resumen.totalMesAnterior;
        detalleMes = dif === 0 ? 'Igual que el mes pasado' : dif > 0 ? `+${dif} más que el mes pasado` : `${Math.abs(dif)} menos que el mes pasado`;
    }

    // Indicador 2: última crisis
    let valorUltima = 'Sin registros';
    let detalleUltima = 'Aún no has registrado crisis';
    if (resumen?.ultima && resumen.diasDesdeUltima !== null) {
        valorUltima = textoHace(resumen.diasDesdeUltima);
        detalleUltima = new Date(resumen.ultima.fecha_hora).toLocaleDateString('es-BO', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Indicador 3: duración promedio
    const valorDuracion = resumen?.duracionPromedio != null ? textoDuracion(resumen.duracionPromedio) : 'Sin datos';
    const detalleDuracion = resumen?.duracionPromedio != null ? `En ${crisis.data?.length ?? 0} crisis registradas` : 'Se calcula al registrar crisis';

    // Indicador 4: medicamentos de hoy
    const medCargando = (medicamentos.loading && !medicamentos.data) || (tomas.loading && !tomas.data);
    const medError = medicamentos.error || tomas.error;
    let valorMeds = 'Sin medicamentos';
    let detalleMeds = 'No tienes medicamentos activos';
    if (estadoMeds && medsActivos.length > 0) {
        valorMeds = `${estadoMeds.tomadas} de ${estadoMeds.programadas}`;
        detalleMeds =
            estadoMeds.pendientes === 0
                ? 'Tomas de hoy completas'
                : `${estadoMeds.pendientes} ${estadoMeds.pendientes === 1 ? 'toma pendiente' : 'tomas pendientes'} hoy`;
    }

    return (
        <div className="dashboard">
            <DashboardHeader nombre={usuario?.nombre} />

            <div className="dash-row dash-row-top">
                <SafetyPlanCard plan={plan.data} cargando={plan.loading} error={plan.error} />
                <EmergencyContactCard contactos={contactos.data} cargando={contactos.loading} error={contactos.error} />
            </div>

            <div className="dash-row dash-row-stats">
                <StatCard
                    icon={<Activity size={26} />}
                    titulo="Crisis este mes"
                    cargando={crisis.loading}
                    error={crisis.error}
                    valor={String(resumen?.totalMes ?? 0)}
                    detalle={detalleMes}
                />
                <StatCard
                    icon={<CalendarDays size={26} />}
                    titulo="Última crisis"
                    cargando={crisis.loading}
                    error={crisis.error}
                    valor={valorUltima}
                    detalle={detalleUltima}
                />
                <StatCard
                    icon={<Clock size={26} />}
                    titulo="Duración promedio"
                    cargando={crisis.loading}
                    error={crisis.error}
                    valor={valorDuracion}
                    detalle={detalleDuracion}
                />
                <StatCard
                    icon={<Pill size={26} />}
                    titulo="Medicamentos de hoy"
                    cargando={medCargando}
                    error={medError}
                    valor={valorMeds}
                    detalle={detalleMeds}
                    variante="verde"
                />
            </div>

            <div className="dash-row dash-row-charts">
                <CrisisTrendChart crisis={crisis.data} cargando={crisis.loading} error={crisis.error} />
                <CrisisTypesChart crisis={crisis.data} cargando={crisis.loading} error={crisis.error} />
            </div>

            <div className="dash-row dash-row-meds">
                <NextMedicationCard
                    medicamentos={medicamentos.data}
                    tomas={tomas.data}
                    cargando={(medicamentos.loading && !medicamentos.data) || (tomas.loading && !tomas.data)}
                    error={medicamentos.error || tomas.error}
                    onMarcar={marcarToma}
                />
                <RecentActivity crisis={crisis.data} cargando={crisis.loading} error={crisis.error} />
            </div>

            <div className="dash-row dash-row-tips">
                <WellnessTips />
            </div>
        </div>
    );
};
