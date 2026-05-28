import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Grid,
} from '@mui/material'
import {
  Email,
  School,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    institution: user?.institution || '',
    department: user?.department || '',
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    // Simulate API call
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      institution: user?.institution || '',
      department: user?.department || '',
    })
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        <Grid sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    bgcolor: 'primary.main',
                    mb: 2,
                    fontSize: '2rem'
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {user?.name}
                </Typography>
                <Chip
                  label={user?.role === 'admin' ? 'Administrador' : user?.role === 'teacher' ? 'Docente' : 'Estudiante'}
                  color={user?.role === 'admin' ? 'secondary' : user?.role === 'teacher' ? 'primary' : 'success'}
                  size="small"
                />
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email"
                    secondary={user?.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Institución"
                    secondary={user?.institution}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Edit />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Miembro desde"
                    secondary={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Desconocido'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid sx={{ width: { xs: '100%', md: '66.666%' } }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Información Personal
                </Typography>
                {!isEditing && (
                  <Button 
                    variant="outlined" 
                    startIcon={<Edit />}
                    onClick={handleEdit}
                  >
                    Editar
                  </Button>
                )}
              </Box>

              {isEditing ? (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Institución"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Departamento"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<Save />}
                      onClick={handleSave}
                    >
                      Guardar
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre
                    </Typography>
                    <Typography variant="body1">
                      {user?.name}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {user?.email}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Institución
                    </Typography>
                    <Typography variant="body1">
                      {user?.institution}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Departamento
                    </Typography>
                    <Typography variant="body1">
                      {user?.department}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Profile