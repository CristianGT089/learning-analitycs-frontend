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
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format } from 'date-fns'
import api from '../services/api'
import { authService } from '../services/authService'
import { eventService } from '../services/eventService'
import { riskService } from '../services/riskService'
import { alertService } from '../services/alertService'

const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState({
    totalStudents: 0,
    atRiskStudents: 0,
    activeAlerts: 0,
    totalEvents: 0,
    institutions: 0,
  })

  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Obtener estadísticas de cada servicio usando el API centralizado
        console.log('Fetching dashboard stats...')
        
        const [authUsers, eventsStats, riskAlerts, riskStats, alertStats] = await Promise.allSettled([
          authService.getUsers(),
          eventService.getStats(),
          riskService.getAlerts(),
          riskService.getStats(),
          alertService.getStats()
        ])

        console.log('API Responses:', {
          authUsers: authUsers.status === 'fulfilled' ? authUsers.value?.length || 0 : 'error',
          eventsStats: eventsStats.status === 'fulfilled' ? eventsStats.value?.total_events || 0 : 'error',
          riskAlerts: riskAlerts.status === 'fulfilled' ? riskAlerts.value?.length || 0 : 'error',
          alertStats: alertStats.status === 'fulfilled' ? alertStats.value?.unacknowledged_alerts || 0 : 'error'
        })

        const errors = []
        if (authUsers.status === 'rejected') errors.push('Servicio de autenticación')
        if (eventsStats.status === 'rejected') errors.push('Estadísticas de eventos')
        if (riskAlerts.status === 'rejected') errors.push('Alertas de riesgo')
        if (riskStats.status === 'rejected') errors.push('Estadísticas de riesgo')
        if (alertStats.status === 'rejected') errors.push('Gestión de alertas')

        const safeAuthUsers = authUsers.status === 'fulfilled' ? authUsers.value : []
        const safeEventsStats = eventsStats.status === 'fulfilled' ? eventsStats.value : { total_events: 0 }
        const safeRiskAlerts = riskAlerts.status === 'fulfilled' ? riskAlerts.value : []
        const safeRiskStats = riskStats.status === 'fulfilled' ? riskStats.value : { users_at_risk: 0, risk_distribution: { high: 0, medium: 0, low: 0 } }
        const safeAlertStats = alertStats.status === 'fulfilled' ? alertStats.value : { unacknowledged_alerts: 0 }

        // Calcular estadísticas combinadas
        const totalStudents = safeAuthUsers?.length || 0
        const atRiskStudents = safeRiskStats?.users_at_risk || 0
        const activeAlerts = safeAlertStats?.unacknowledged_alerts || 0
        const totalEvents = safeEventsStats?.total_events || 0
        const institutions = new Set(safeAuthUsers?.map((user: any) => user.institution).filter(Boolean)).size || 0

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
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
        setError('Algunos servicios no están disponibles. Mostrando datos de ejemplo.')
        // Fallback a datos de prueba en caso de error
        setStats({
          totalStudents: 1250,
          atRiskStudents: 89,
          activeAlerts: 23,
          totalEvents: 45230,
          institutions: 15
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  if (isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        <LinearProgress />
      </Box>
    )
  }

  if (error) {
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

  const riskData = [
    { name: 'Bajo', value: 85, color: '#4caf50' },
    { name: 'Medio', value: 12, color: '#ff9800' },
    { name: 'Alto', value: 3, color: '#f44336' },
  ]

  const eventTypes = [
    { name: 'Login', value: 12000 },
    { name: 'Page View', value: 15000 },
    { name: 'Assignment', value: 8000 },
    { name: 'Quiz', value: 5000 },
    { name: 'Forum', value: 5230 },
  ]

  const trendData = [
    { date: '01/01', events: 5230 },
    { date: '02/01', events: 6120 },
    { date: '03/01', events: 5890 },
    { date: '04/01', events: 6450 },
    { date: '05/01', events: 6780 },
    { date: '06/01', events: 7120 },
    { date: '07/01', events: 6890 },
  ]

  const statCards = [
    { label: 'Total Estudiantes', value: stats.totalStudents.toLocaleString(), color: undefined },
    { label: 'En Riesgo', value: stats.atRiskStudents, color: 'error' as const },
    { label: 'Alertas Activas', value: stats.activeAlerts, color: 'warning.main' },
    { label: 'Eventos Totales', value: stats.totalEvents.toLocaleString(), color: undefined },
    { label: 'Instituciones', value: stats.institutions, color: undefined },
  ]

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
        {statCards.map((card) => (
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
                  <Pie
                    data={riskData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Eventos" />
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
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="events" stroke="#8884d8" name="Eventos" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
