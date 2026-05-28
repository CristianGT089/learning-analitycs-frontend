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

const Dashboard: React.FC = () => {
  console.log('Dashboard: Componente montado')
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
    const loadDashboardData = async () => {
      try {
        console.log('Dashboard: Cargando datos...')
        setIsLoading(true)
        setError(null)
        
        // Simular carga de datos para evitar problemas de API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Datos de ejemplo para que el dashboard se vea
        const mockStats = {
          totalStudents: 1250,
          atRiskStudents: 89,
          activeAlerts: 23,
          totalEvents: 45230,
          institutions: 15
        }
        
        setStats(mockStats)
        console.log('Dashboard: Datos cargados:', mockStats)
      } catch (error) {
        console.error('Error Dashboard:', error)
        setError('Error al cargar datos')
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
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Gráfico de distribución de riesgo (ejemplo)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Eventos por Tipo
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Gráfico de eventos por tipo (ejemplo)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencia de Eventos (Últimos 7 días)
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Gráfico de tendencia de eventos (ejemplo)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard