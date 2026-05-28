import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Alert,
} from '@mui/material'
import { format } from 'date-fns'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts'
import { authService } from '../services/authService'
import { eventService } from '../services/eventService'
import { riskService } from '../services/riskService'
import { alertService } from '../services/alertService'

const Dashboard: React.FC = () => {
  console.log('Dashboard: Componente montado')
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    atRiskStudents: 0,
    activeAlerts: 0,
    totalEvents: 0,
    institutions: 0,
  })

  const [riskDistribution, setRiskDistribution] = React.useState([
    { name: 'Bajo', value: 0, color: '#2e7d32' },
    { name: 'Medio', value: 0, color: '#ed6c02' },
    { name: 'Alto', value: 0, color: '#d32f2f' },
    { name: 'Crítico', value: 0, color: '#9c27b0' },
  ])
  const [eventTypes, setEventTypes] = React.useState<{ type: string; count: number }[]>([])
  const [eventTrend, setEventTrend] = React.useState<{ day: string; events: number }[]>([])

  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadDashboardData = async () => {
      try {
        console.log('Dashboard: Cargando datos...')
        setIsLoading(true)
        setError(null)
        
        // Obtener datos de los endpoints que funcionan
        console.log('Fetching dashboard stats from API...')
        
        const [authUsers, riskStats, alertStats, eventStats, eventList] = await Promise.allSettled([
          authService.getUsers(),
          riskService.getStats(),
          alertService.getStats(),
          eventService.getStats(),
          eventService.getEvents({ limit: 1000 })
        ])

        console.log('API Responses:', {
          authUsers: authUsers.status === 'fulfilled' ? authUsers.value?.length || 0 : 'error',
          riskStats: riskStats.status === 'fulfilled' ? 'success' : 'error',
          alertStats: alertStats.status === 'fulfilled' ? alertStats.value?.unacknowledged_alerts || 0 : 'error',
          eventStats: eventStats.status === 'fulfilled' ? eventStats.value?.total_events || 0 : 'error'
        })

        const errors = []
        if (authUsers.status === 'rejected') errors.push('Servicio de autenticación')
        if (riskStats.status === 'rejected') errors.push('Estadísticas de riesgo')
        if (alertStats.status === 'rejected') errors.push('Gestión de alertas')
        if (eventStats.status === 'rejected') errors.push('Eventos')

        const safeAuthUsers = authUsers.status === 'fulfilled' ? authUsers.value : []
        const safeRiskStats = riskStats.status === 'fulfilled' ? riskStats.value : { total_users: 0, users_at_risk: 0, risk_distribution: { low: 0, medium: 0, high: 0, critical: 0 }, alerts_generated: 0, alerts_acknowledged: 0, alerts_resolved: 0 }
        const safeAlertStats = alertStats.status === 'fulfilled' ? alertStats.value : { unacknowledged_alerts: 0 }
        const safeEventStats = eventStats.status === 'fulfilled' ? eventStats.value : { total_events: 0, event_types: {}, recent_events: [] }
        const safeEventList = eventList.status === 'fulfilled' ? eventList.value : []

        // Calcular estadísticas combinadas
        const totalStudents = safeAuthUsers?.length || 0
        const atRiskStudents = safeRiskStats?.users_at_risk || 0
        const activeAlerts = safeAlertStats?.unacknowledged_alerts || 0
        const totalEvents = safeEventStats?.total_events || 0
        const institutions = new Set(safeAuthUsers?.map((user: any) => user.institution).filter(Boolean)).size || 0

        const dist = safeRiskStats.risk_distribution || { low: 0, medium: 0, high: 0, critical: 0 }
        const totalRisk = Object.values(dist).reduce((sum, n) => sum + Number(n || 0), 0) || 1
        setRiskDistribution([
          { name: 'Bajo', value: Math.round((dist.low / totalRisk) * 100), color: '#2e7d32' },
          { name: 'Medio', value: Math.round((dist.medium / totalRisk) * 100), color: '#ed6c02' },
          { name: 'Alto', value: Math.round((dist.high / totalRisk) * 100), color: '#d32f2f' },
          { name: 'Crítico', value: Math.round((dist.critical / totalRisk) * 100), color: '#9c27b0' },
        ])

        const eventCountByType = safeEventStats.event_types || {}
        setEventTypes(Object.entries(eventCountByType).map(([type, count]) => ({ type, count: Number(count) })))

        const last7Days = Array.from({ length: 7 }, (_, index) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - index))
          const label = format(d, 'dd/MM')
          const dayCount = safeEventList.filter((event: any) => {
            const eventDate = new Date(event.timestamp)
            return format(eventDate, 'dd/MM') === label
          }).length
          return { day: label, events: dayCount }
        })
        setEventTrend(last7Days)

        setStats({
          totalStudents,
          atRiskStudents,
          activeAlerts,
          totalEvents,
          institutions
        })
        
        if (errors.length > 0) {
          setError(`Algunos servicios no están disponibles: ${errors.join(', ')}`)
        } else {
          setError(null)
        }
        
        console.log('Dashboard: Datos cargados:', {
          totalStudents,
          atRiskStudents,
          activeAlerts,
          totalEvents,
          institutions
        })
      } catch (error) {
        console.error('Error Dashboard:', error)
        setError('Error al cargar datos desde la API')
        setStats({
          totalStudents: 2847,
          atRiskStudents: 342,
          activeAlerts: 67,
          totalEvents: 125430,
          institutions: 23
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    loadDashboardData()
  }, [])

  console.log('Dashboard: Renderizando - isLoading:', isLoading, 'error:', error)

  if (isLoading) {
    console.log('Dashboard: Mostrando loader')
    return (
      <Box sx={{ mt: 2 }}>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
    console.log('Dashboard: Mostrando error:', error)
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard Principal
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Typography variant="body1" color="text.secondary">
          Los datos mostrados son de ejemplo. Verifica la conexión con los servicios backend.
        </Typography>
      </Box>
    )
  }

  console.log('Dashboard: Renderizando contenido completo')
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Principal
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Última actualización: {format(new Date(), 'dd/MM/yyyy HH:mm')}
      </Typography>

      {stats.atRiskStudents > 50 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          ⚠️ Se detectaron {stats.atRiskStudents} estudiantes con riesgo académico.
          Se recomienda revisar la sección de Evaluación de Riesgo.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total Estudiantes', value: stats.totalStudents.toLocaleString(), color: undefined },
          { label: 'En Riesgo', value: stats.atRiskStudents, color: 'error' as const },
          { label: 'Alertas Activas', value: stats.activeAlerts, color: 'warning.main' },
          { label: 'Eventos Totales', value: stats.totalEvents.toLocaleString(), color: undefined },
          { label: 'Instituciones', value: stats.institutions, color: undefined },
        ].map((card) => (
          <Grid key={card.label} sx={{ width: { xs: '100%', sm: '50%', md: '20%' } }}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  {card.label}
                </Typography>
                <Typography variant="h5" component="h2" color={card.color}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución de Riesgo Académico
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Eventos por Tipo
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={eventTypes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencia de Eventos (Últimos 7 días)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={eventTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="events" stroke="#6a1b9a" fill="#ce93d8" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
