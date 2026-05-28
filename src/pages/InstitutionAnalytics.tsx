import React from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts'
import {
  School,
  TrendingUp,
  TrendingDown,
  Person,
  Book,
  CheckCircle,
} from '@mui/icons-material'

const InstitutionAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)

  // Mock data for analytics
  const [analyticsData] = React.useState({
    overview: {
      totalStudents: 1250,
      totalTeachers: 45,
      totalCourses: 32,
      activeInstitutions: 3,
      dropoutRate: 0.08,
      averageGrade: 7.5,
    },
    enrollmentTrend: [
      { month: 'Ene', students: 1100, newEnrollments: 120 },
      { month: 'Feb', students: 1150, newEnrollments: 50 },
      { month: 'Mar', students: 1180, newEnrollments: 30 },
      { month: 'Abr', students: 1220, newEnrollments: 40 },
      { month: 'May', students: 1250, newEnrollments: 30 },
    ],
    coursePerformance: [
      { course: 'Programación I', students: 120, avgGrade: 8.2, dropoutRate: 0.05 },
      { course: 'Programación II', students: 95, avgGrade: 7.8, dropoutRate: 0.12 },
      { course: 'Inteligencia Artificial', students: 45, avgGrade: 7.5, dropoutRate: 0.15 },
      { course: 'Bases de Datos', students: 80, avgGrade: 8.0, dropoutRate: 0.08 },
      { course: 'Redes', students: 65, avgGrade: 7.2, dropoutRate: 0.18 },
    ],
    riskDistribution: [
      { level: 'Bajo', count: 850, percentage: 68 },
      { level: 'Medio', count: 300, percentage: 24 },
      { level: 'Alto', count: 100, percentage: 8 },
    ],
    alertsByType: [
      { type: 'Riesgo Académico', count: 45, resolved: 30 },
      { type: 'Asistencia', count: 25, resolved: 20 },
      { type: 'Rendimiento', count: 35, resolved: 25 },
      { type: 'Técnico', count: 15, resolved: 10 },
    ],
    institutionStats: [
      {
        name: 'Universidad Nacional',
        students: 850,
        teachers: 30,
        courses: 22,
        dropoutRate: 0.09,
        avgGrade: 7.4,
        alerts: 65,
      },
      {
        name: 'Universidad Privada',
        students: 280,
        teachers: 10,
        courses: 7,
        dropoutRate: 0.06,
        avgGrade: 8.1,
        alerts: 25,
      },
      {
        name: 'Instituto Tecnológico',
        students: 120,
        teachers: 5,
        courses: 3,
        dropoutRate: 0.12,
        avgGrade: 6.8,
        alerts: 30,
      },
    ],
  })

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const COLORS = ['#4CAF50', '#FF9800', '#F44336']

  if (isLoading) {
    return (
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  const { overview, enrollmentTrend, coursePerformance, riskDistribution, alertsByType, institutionStats } = analyticsData

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analítica Institucional
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Estudiantes
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {overview.totalStudents}
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
                <School color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Docentes
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {overview.totalTeachers}
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
                <Book color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Cursos
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {overview.totalCourses}
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
                    Tasa de Éxito
                  </Typography>
                  <Typography variant="h5" component="h2" color="success">
                    {((1 - overview.dropoutRate) * 100).toFixed(1)}%
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
                <TrendingDown color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tasa de Abandono
                  </Typography>
                  <Typography variant="h5" component="h2" color="error">
                    {(overview.dropoutRate * 100).toFixed(1)}%
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
                <CheckCircle color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Promedio General
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {overview.averageGrade.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for detailed analytics */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Matrículas y Tendencias" />
          <Tab label="Rendimiento por Curso" />
          <Tab label="Distribución de Riesgo" />
          <Tab label="Alertas por Tipo" />
          <Tab label="Comparación Instituciones" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid sx={{ width: { xs: '100%', md: '66.666%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tendencia de Matrículas
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={enrollmentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="students" stackId="1" stroke="#8884d8" fill="#8884d8" name="Total Estudiantes" />
                    <Area type="monotone" dataKey="newEnrollments" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Nuevas Matrículas" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumen de Matrículas
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="textSecondary">Total Actual</Typography>
                    <Typography variant="h4">{overview.totalStudents}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="textSecondary">Nuevos Este Mes</Typography>
                    <Typography variant="h4" color="success">
                      {enrollmentTrend[enrollmentTrend.length - 1].newEnrollments}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">Cambio Mensual</Typography>
                    <Typography variant="h4" color="success">
                      +{((enrollmentTrend[enrollmentTrend.length - 1].students - enrollmentTrend[enrollmentTrend.length - 2].students) / enrollmentTrend[enrollmentTrend.length - 2].students * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Rendimiento por Curso
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Curso</TableCell>
                    <TableCell>Estudiantes</TableCell>
                    <TableCell>Calificación Promedio</TableCell>
                    <TableCell>Tasa de Abandono</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coursePerformance.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {course.course}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {course.students}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {course.avgGrade.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={course.dropoutRate > 0.1 ? 'error' : course.dropoutRate > 0.05 ? 'warning' : 'success'}>
                          {(course.dropoutRate * 100).toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={course.dropoutRate > 0.15 ? 'Crítico' : course.dropoutRate > 0.1 ? 'Atención' : 'Normal'}
                          color={course.dropoutRate > 0.15 ? 'error' : course.dropoutRate > 0.1 ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribución de Riesgo
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ level, percentage }: any) => `${level}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {riskDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                  Detalle de Riesgo
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {riskDistribution.map((risk, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {risk.level === 'Bajo' ? 'Bajo' : risk.level === 'Medio' ? 'Medio' : 'Alto'}
                        </Typography>
                        <Typography variant="body2">
                          {risk.count} estudiantes ({risk.percentage}%)
                        </Typography>
                      </Box>
                      <Box sx={{ height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                        <Box
                          sx={{
                            height: '100%',
                            borderRadius: 1,
                            bgcolor: risk.level === 'Bajo' ? 'success.main' : risk.level === 'Medio' ? 'warning.main' : 'error.main',
                            width: `${risk.percentage}%`,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alertas por Tipo
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={alertsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Total Alertas" />
                <Bar dataKey="resolved" fill="#82ca9d" name="Resueltas" />
              </BarChart>
            </ResponsiveContainer>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resumen de Alertas
              </Typography>
              <Grid container spacing={2}>
                {alertsByType.map((alert, index) => (
                  <Grid key={index} sx={{ width: { xs: '100%', md: '25%' } }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {alert.type}
                      </Typography>
                      <Typography variant="h6">
                        {alert.count} total
                      </Typography>
                      <Typography variant="body2" color="success">
                        {alert.resolved} resueltas
                      </Typography>
                      <Typography variant="body2" color="error">
                        {alert.count - alert.resolved} pendientes
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {activeTab === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comparación de Instituciones
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={institutionStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="students" fill="#8884d8" name="Estudiantes" />
                <Bar dataKey="teachers" fill="#82ca9d" name="Docentes" />
                <Bar dataKey="courses" fill="#ffc658" name="Cursos" />
              </BarChart>
            </ResponsiveContainer>
            
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Institución</TableCell>
                    <TableCell>Estudiantes</TableCell>
                    <TableCell>Docentes</TableCell>
                    <TableCell>Cursos</TableCell>
                    <TableCell>Tasa Abandono</TableCell>
                    <TableCell>Calificación Prom</TableCell>
                    <TableCell>Alertas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {institutionStats.map((institution, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {institution.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {institution.students}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {institution.teachers}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {institution.courses}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={institution.dropoutRate > 0.1 ? 'error' : institution.dropoutRate > 0.05 ? 'warning' : 'success'}>
                          {(institution.dropoutRate * 100).toFixed(1)}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {institution.avgGrade.toFixed(1)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={institution.alerts}
                          color={institution.alerts > 50 ? 'error' : institution.alerts > 30 ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default InstitutionAnalytics