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
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material'
import { format } from 'date-fns'
import {
  Person,
  School,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material'

import { eventService, EventItem } from '../services/eventService'

const StudentAnalytics: React.FC = () => {
  const [events, setEvents] = React.useState<EventItem[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    eventService.getEvents({ limit: 50 })
      .then(setEvents)
      .catch(() => setError('No se pudieron cargar los eventos'))
      .finally(() => setIsLoading(false))
  }, [])

  const uniqueUsers = new Set(events.map(e => e.userId)).size

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Análisis de Estudiantes
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Usuarios Únicos
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {uniqueUsers}
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
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Eventos
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {events.length}
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
                <School color="info" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Cursos Activos
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {new Set(events.filter(e => e.courseId).map(e => e.courseId)).size}
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
            Eventos Recientes
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Tipo de Evento</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingDown sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {event.userId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.eventType.replace(/_/g, ' ')}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.courseId ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(event.timestamp), 'dd/MM HH:mm')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default StudentAnalytics