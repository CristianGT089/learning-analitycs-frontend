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
  Badge,
  Avatar,
} from '@mui/material'
import { format } from 'date-fns'
import {
  Person,
  AdminPanelSettings,
  School,
  MenuBook,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material'
import { authService } from '../services/authService'

const UserManagement: React.FC = () => {
  const [users, setUsers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [selectedUser, setSelectedUser] = React.useState<any>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [newUser, setNewUser] = React.useState({
    name: '',
    email: '',
    role: 'student',
    institution: 'Universidad Nacional',
    department: 'Ingeniería',
    status: 'active',
  })
  const [editUser, setEditUser] = React.useState({
    id: '',
    name: '',
    email: '',
    role: '',
    institution: '',
    department: '',
    status: '',
  })

  React.useEffect(() => {
    authService.getUsers()
      .then(data => setUsers(data.map((u: any) => ({
        id: u.id,
        name: u.name ?? u.username,
        email: u.email,
        role: u.role,
        institution: u.institution ?? '—',
        department: u.department ?? '—',
        status: 'active',
        lastLogin: u.updatedAt,
        createdAt: u.createdAt,
      }))))
      .catch(() => setError('No se pudieron cargar los usuarios'))
      .finally(() => setIsLoading(false))
  }, [])

  const handleCreateUser = () => {
    // Simulate API call
    const newUserObj = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      institution: newUser.institution,
      department: newUser.department,
      status: newUser.status,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...(newUser.role === 'student' && { 
        coursesEnrolled: 0, 
        riskLevel: 'bajo' 
      }),
      ...(newUser.role === 'teacher' && { 
        coursesTaught: 0, 
        studentsAssigned: 0 
      }),
      ...(newUser.role === 'admin' && { 
        institutionsManaged: 0, 
        usersManaged: 0 
      }),
    }
    
    setUsers([newUserObj, ...users])
    setCreateDialogOpen(false)
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      institution: 'Universidad Nacional',
      department: 'Ingeniería',
      status: 'active',
    })
  }

  const handleEditUser = () => {
    setUsers(users.map(user => 
      user.id === editUser.id 
        ? { ...user, ...editUser }
        : user
    ))
    setEditDialogOpen(false)
    setEditUser({
      id: '',
      name: '',
      email: '',
      role: '',
      institution: '',
      department: '',
      status: '',
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
    setDialogOpen(false)
    setSelectedUser(null)
  }

  const handleViewDetails = (user: any) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleEditClick = (user: any) => {
    setEditUser(user)
    setEditDialogOpen(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <AdminPanelSettings color="secondary" />
      case 'teacher':
      case 'professor': return <School color="primary" />
      case 'student': return <MenuBook color="success" />
      default: return <Person />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'teacher':
      case 'professor': return 'Docente'
      case 'student': return 'Estudiante'
      default: return 'Usuario'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'error'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'pending': return 'Pendiente'
      default: return 'Desconocido'
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

  const activeUsers = users.filter(user => user.status === 'active').length
  const adminUsers = users.filter(user => user.role === 'admin').length
  const teacherUsers = users.filter(user => user.role === 'teacher').length
  const studentUsers = users.filter(user => user.role === 'student').length

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid sx={{ width: { xs: '100%', md: '25%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge badgeContent={activeUsers} color="primary" sx={{ mr: 2 }}>
                  <Person />
                </Badge>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Usuarios Activos
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {activeUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: { xs: '100%', md: '25%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AdminPanelSettings color="secondary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Administradores
                  </Typography>
                  <Typography variant="h5" component="h2" color="secondary">
                    {adminUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: { xs: '100%', md: '25%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <School color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Docentes
                  </Typography>
                  <Typography variant="h5" component="h2" color="primary">
                    {teacherUsers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid sx={{ width: { xs: '100%', md: '25%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MenuBook color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Estudiantes
                  </Typography>
                  <Typography variant="h5" component="h2" color="success">
                    {studentUsers}
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
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Crear Nuevo Usuario
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Lista de Usuarios
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Institución</TableCell>
                  <TableCell>Departamento</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Último Login</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getRoleIcon(user.role)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {getRoleLabel(user.role)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.institution}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.department}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(user.status)}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.lastLogin ? format(new Date(user.lastLogin), 'dd/MM HH:mm') : 'Nunca'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleViewDetails(user)}
                          sx={{ mr: 1 }}
                        >
                          Detalles
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleEditClick(user)}
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error"
                          onClick={() => {
                            setSelectedUser(user)
                            setDialogOpen(true)
                          }}
                        >
                          <Delete />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialogo de creación de usuario */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          Crear Nuevo Usuario
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre Completo"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <MenuItem value="student">Estudiante</MenuItem>
                <MenuItem value="teacher">Docente</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Institución</InputLabel>
              <Select
                value={newUser.institution}
                onChange={(e) => setNewUser({...newUser, institution: e.target.value})}
              >
                <MenuItem value="Universidad Nacional">Universidad Nacional</MenuItem>
                <MenuItem value="Universidad Privada">Universidad Privada</MenuItem>
                <MenuItem value="Instituto Tecnológico">Instituto Tecnológico</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Departamento"
              value={newUser.department}
              onChange={(e) => setNewUser({...newUser, department: e.target.value})}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreateUser} variant="contained">
            Crear Usuario
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de edición de usuario */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          Editar Usuario
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre Completo"
              value={editUser.name}
              onChange={(e) => setEditUser({...editUser, name: e.target.value})}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({...editUser, email: e.target.value})}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={editUser.role}
                onChange={(e) => setEditUser({...editUser, role: e.target.value})}
              >
                <MenuItem value="student">Estudiante</MenuItem>
                <MenuItem value="teacher">Docente</MenuItem>
                <MenuItem value="admin">Administrador</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Institución</InputLabel>
              <Select
                value={editUser.institution}
                onChange={(e) => setEditUser({...editUser, institution: e.target.value})}
              >
                <MenuItem value="Universidad Nacional">Universidad Nacional</MenuItem>
                <MenuItem value="Universidad Privada">Universidad Privada</MenuItem>
                <MenuItem value="Instituto Tecnológico">Instituto Tecnológico</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Departamento"
              value={editUser.department}
              onChange={(e) => setEditUser({...editUser, department: e.target.value})}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={editUser.status}
                onChange={(e) => setEditUser({...editUser, status: e.target.value})}
              >
                <MenuItem value="active">Activo</MenuItem>
                <MenuItem value="inactive">Inactivo</MenuItem>
                <MenuItem value="pending">Pendiente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleEditUser} variant="contained">
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de detalles de usuario */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          Detalles del Usuario - {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
                {selectedUser?.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {selectedUser?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedUser?.email}
                </Typography>
              </Box>
            </Box>

            <Typography variant="body1" gutterBottom>
              <strong>Rol:</strong> {getRoleLabel(selectedUser?.role)}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Institución:</strong> {selectedUser?.institution}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Departamento:</strong> {selectedUser?.department}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Estado:</strong>{' '}
              <Chip
                label={getStatusLabel(selectedUser?.status)}
                color={getStatusColor(selectedUser?.status) as any}
                size="small"
              />
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Último Login:</strong>{' '}
              {selectedUser?.lastLogin ? format(new Date(selectedUser?.lastLogin), 'dd/MM/yyyy HH:mm') : 'Nunca'}
            </Typography>

            <Typography variant="body1" gutterBottom>
              <strong>Fecha de Creación:</strong>{' '}
              {selectedUser?.createdAt ? format(new Date(selectedUser?.createdAt), 'dd/MM/yyyy HH:mm') : 'Desconocida'}
            </Typography>

            {selectedUser?.role === 'student' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Cursos Inscritos:</strong> {selectedUser?.coursesEnrolled}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Nivel de Riesgo:</strong>{' '}
                  <Chip
                    label={selectedUser?.riskLevel === 'alto' ? 'Alto' : selectedUser?.riskLevel === 'medio' ? 'Medio' : 'Bajo'}
                    color={selectedUser?.riskLevel === 'alto' ? 'error' : selectedUser?.riskLevel === 'medio' ? 'warning' : 'info'}
                    size="small"
                  />
                </Typography>
              </Box>
            )}

            {selectedUser?.role === 'teacher' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Cursos Impartidos:</strong> {selectedUser?.coursesTaught}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Estudiantes Asignados:</strong> {selectedUser?.studentsAssigned}
                </Typography>
              </Box>
            )}

            {selectedUser?.role === 'admin' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Instituciones Administradas:</strong> {selectedUser?.institutionsManaged}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Usuarios Administrados:</strong> {selectedUser?.usersManaged}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cerrar
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => handleDeleteUser(selectedUser?.id)}
          >
            Eliminar Usuario
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserManagement
