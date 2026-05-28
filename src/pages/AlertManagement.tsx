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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { format } from 'date-fns'
import {
  Notifications,
  CheckCircle,
  Warning,
  Info,
  Send,
} from '@mui/icons-material'
import { alertService } from '../services/alertService'

const AlertManagement: React.FC = () => {
  const [alerts, setAlerts] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [newAlert, setNewAlert] = React.useState({
    studentId: '',
    riskLevel: 'medio',
    alertType: 'academic_risk',
    message: '',
  })

  React.useEffect(() => {
    alertService.getAlerts()
      .then(setAlerts)
      .catch(() => setError('No se pudieron cargar las alertas'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleAcknowledge = async (alertId: string) => {
    try {
      await alertService.acknowledge(alertId)
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
      await alertService.resolve(alertId)
      setAlerts(alerts.map(alert =>
        alert.id === alertId
          ? { ...alert, resolved: true, status: 'resolved' }
          : alert
      ))
    } catch {
      setError('No se pudo resolver la alerta')
    }
  }

  const handleSendNotification = (alertId: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === alertId
        ? { ...alert, notificationSent: true }
        : alert
    ))
  }

  const handleCreateAlert = () => {
    const newAlertObj = {
      id: `alert-${Date.now()}`,
      studentId: newAlert.studentId,
      studentName: 'Nuevo Estudiante',
      institution: 'Universidad Nacional',
      riskScore: 0.5,
      riskLevel: newAlert.riskLevel,
      alertType: newAlert.alertType,
      message: newAlert.message,
      timestamp: new Date().toISOString(),
      status: 'active',
      acknowledged: false,
      resolved: false,
      notificationSent: false,
      createdBy: 'manual',
    }
    
    setAlerts([newAlertObj, ...alerts])
    setCreateDialogOpen(false)
    setNewAlert({
      studentId: '',
      riskLevel: 'medio',
      alertType: 'academic_risk',
      message: '',
    })
  }

  const handleViewDetails = (alert: any) => {
    console.log('Viewing alert details:', alert)
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
      case 'active': return <Notifications color="error" />
      case 'acknowledged': return <Info color="info" />
      case 'resolved': return <CheckCircle color="success" />
      default: return <Warning color="error" />
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
  const notificationsSent = alerts.filter(alert => alert.notificationSent).length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Alertas
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: '100%', maxWidth: '300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Notifications color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Activas
                  </Typography>
                  <Typography variant="h5" component="h2" color="error">
                    {activeAlerts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: '100%', maxWidth: '300px' }}>
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
        
        <Grid sx={{ width: '100%', maxWidth: '300px' }}>
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
        
        <Grid sx={{ width: '100%', maxWidth: '300px' }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Send color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Notificaciones Enviadas
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {notificationsSent}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<Notifications />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Crear Nueva Alerta
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Alertas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Estudiante</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Nivel Riesgo</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Notificación</TableCell>
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
                      <Chip
                        label={alert.alertType.replace('_', ' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={alert.riskLevel === 'alto' ? 'Alto' : alert.riskLevel === 'medio' ? 'Medio' : 'Bajo'}
                        color={getRiskColor(alert.riskLevel) as any}
                        size="small"
                      />
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
                      {alert.notificationSent ? (
                        <Chip
                          label="Enviada"
                          color="success"
                          size="small"
                          icon={<Send />}
                        />
                      ) : (
                        <Chip
                          label="Pendiente"
                          color="default"
                          size="small"
                        />
                      )}
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
                            sx={{ mr: 1 }}
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
                            sx={{ mr: 1 }}
                          >
                            Resolver
                          </Button>
                        )}
                        {!alert.notificationSent && (
                          <Button 
                            size="small" 
                            variant="outlined" 
                            color="secondary"
                            onClick={() => handleSendNotification(alert.id)}
                            startIcon={<Send />}
                          >
                            Notificar
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

      {/* Dialogo de creación de alerta */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          Crear Nueva Alerta
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Estudiante ID</InputLabel>
              <TextField
                label="Estudiante ID"
                value={newAlert.studentId}
                onChange={(e) => setNewAlert({...newAlert, studentId: e.target.value})}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Nivel de Riesgo</InputLabel>
              <Select
                value={newAlert.riskLevel}
                onChange={(e) => setNewAlert({...newAlert, riskLevel: e.target.value})}
              >
                <MenuItem value="bajo">Bajo</MenuItem>
                <MenuItem value="medio">Medio</MenuItem>
                <MenuItem value="alto">Alto</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo de Alerta</InputLabel>
              <Select
                value={newAlert.alertType}
                onChange={(e) => setNewAlert({...newAlert, alertType: e.target.value})}
              >
                <MenuItem value="academic_risk">Riesgo Académico</MenuItem>
                <MenuItem value="performance_warning">Advertencia de Rendimiento</MenuItem>
                <MenuItem value="attendance_issue">Problemas de Asistencia</MenuItem>
                <MenuItem value="technical_issue">Problemas Técnicos</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Mensaje"
              multiline
              rows={3}
              value={newAlert.message}
              onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateAlert} variant="contained">
            Crear Alerta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AlertManagement