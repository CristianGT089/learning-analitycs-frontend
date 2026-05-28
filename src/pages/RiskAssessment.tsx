import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { format } from 'date-fns'
import {
  Warning,
  CheckCircle,
  Error,
  Info,
} from '@mui/icons-material'
import { riskService } from '../services/riskService'

const RiskAssessment: React.FC = () => {
  const [alerts, setAlerts] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selectedAlert, setSelectedAlert] = React.useState<any>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)

  React.useEffect(() => {
    riskService.getAlerts()
      .then(setAlerts)
      .catch(() => setError('No se pudieron cargar las alertas de riesgo'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleAcknowledge = async (alertId: string) => {
    try {
      await riskService.acknowledge(alertId)
      setAlerts(alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, acknowledged: true, status: 'acknowledged' }
          : alert
      ))
    } catch {
      setError('No se pudo reconocer la alerta')
    }
  }

  const handleResolve = async (alertId: string) => {
    try {
      await riskService.resolve(alertId)
      setAlerts(alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, resolved: true, status: 'resolved' }
          : alert
      ))
    } catch {
      setError('No se pudo resolver la alerta')
    }
  }

  const handleViewDetails = (alert: any) => {
    setSelectedAlert(alert)
    setDialogOpen(true)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'alto': return 'error'
      case 'medio': return 'warning'
      case 'bajo': return 'info'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Warning color="error" />
      case 'acknowledged': return <Info color="info" />
      case 'resolved': return <CheckCircle color="success" />
      default: return <Error color="error" />
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )
  }

  const activeAlerts = alerts.filter(alert => alert.status === 'active').length
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged').length
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved').length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Evaluación de Riesgo Académico
      </Typography>

      {/* Alerta si hay alertas activas */}
      {activeAlerts > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          ⚠️ Se detectaron {activeAlerts} alertas de riesgo activas que requieren atención inmediata.
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Alertas Activas
                  </Typography>
                  <Typography variant="h5" component="h2" color="error">
                    {activeAlerts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Info color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Reconocidas
                  </Typography>
                  <Typography variant="h5" component="h2" color="info">
                    {acknowledgedAlerts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Resueltas
                  </Typography>
                  <Typography variant="h5" component="h2" color="success">
                    {resolvedAlerts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Alertas de Riesgo
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Institución</TableCell>
                  <TableCell>Nivel Riesgo</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {alert.studentName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {alert.studentId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {alert.institution}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.riskLevel === 'alto' ? 'Alto' : alert.riskLevel === 'medio' ? 'Medio' : 'Bajo'}
                        color={getRiskColor(alert.riskLevel) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {(alert.riskScore * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(alert.status)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {alert.status === 'active' ? 'Activa' : 
                           alert.status === 'acknowledged' ? 'Reconocida' : 'Resuelta'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(alert.timestamp), 'dd/MM HH:mm')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleViewDetails(alert)}
                          sx={{ mr: 1 }}
                        >
                          Detalles
                        </Button>
                        {alert.status === 'active' && !alert.acknowledged && (
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="primary"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            Reconocer
                          </Button>
                        )}
                        {alert.status === 'acknowledged' && !alert.resolved && (
                          <Button 
                            size="small" 
                            variant="contained" 
                            color="success"
                            onClick={() => handleResolve(alert.id)}
                          >
                            Resolver
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogo de detalles de alerta */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          Detalles de Alerta - {selectedAlert?.studentName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              <strong>Mensaje:</strong> {selectedAlert?.message}
            </Typography>
            
            <Typography variant="body1" gutterBottom>
              <strong>Nivel de Riesgo:</strong>{' '}
              <Chip
                label={selectedAlert?.riskLevel === 'alto' ? 'Alto' : selectedAlert?.riskLevel === 'medio' ? 'Medio' : 'Bajo'}
                color={getRiskColor(selectedAlert?.riskLevel) as any}
                size="small"
              />
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Score de Riesgo:</strong> {(selectedAlert?.riskScore * 100).toFixed(1)}%
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Factores Identificados:</strong>
              <Box sx={{ mt: 1, ml: 2 }}>
                {selectedAlert?.factors.map((factor: string, index: number) => (
                  <Chip
                    key={index}
                    label={factor.replace('_', ' ')}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Recomendaciones:</strong>
              <Box sx={{ mt: 1, ml: 2 }}>
                {selectedAlert?.recommendations.map((recommendation: string, index: number) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    • {recommendation}
                  </Typography>
                ))}
              </Box>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RiskAssessment