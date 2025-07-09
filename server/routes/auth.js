const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validate, schemas } = require('../middleware/validation');
const { authMiddleware } = require('../middleware/auth');
const memoryDB = require('../data/memoryDB');
const bcrypt = require('bcryptjs');

// Generar JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret_key_temporal', {
    expiresIn: '30d' // Extender a 30 días para mejor UX
  });
};

// Verificar validez del token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_temporal');
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// POST /api/auth/register - Registro de usuario  
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Nombre, email y contraseña son requeridos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Contraseña muy corta',
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (global.USE_MEMORY_DB) {
      // Verificar si el usuario ya existe
      const existingUser = await memoryDB.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          error: 'Usuario ya existe',
          message: 'Ya existe una cuenta con este email'
        });
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Crear nuevo usuario
      const user = await memoryDB.createUser({
        name,
        email,
        password: hashedPassword
      });

      // Generar token
      const token = generateToken(user._id);

      // Eliminar password del objeto response
      const { password: _, ...userResponse } = user;

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: userResponse
      });
    } else {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: 'Usuario ya existe',
          message: 'Ya existe una cuenta con este email'
        });
      }

      // Crear nuevo usuario
      const user = new User({
        name,
        email,
        password
      });

      await user.save();

      // Generar token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: user.toJSON()
      });
    }

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al registrar usuario'
    });
  }
});

// POST /api/auth/login - Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Email y contraseña son requeridos'
      });
    }

    if (global.USE_MEMORY_DB) {
      // Buscar usuario por email
      const user = await memoryDB.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar que la cuenta esté activa
      if (!user.isActive) {
        return res.status(400).json({
          error: 'Cuenta desactivada',
          message: 'Tu cuenta ha sido desactivada'
        });
      }

      // Actualizar último login
      await memoryDB.updateUser(user._id, { lastLogin: new Date() });

      // Generar token
      const token = generateToken(user._id);

      // Eliminar password del objeto response
      const { password: _, ...userResponse } = user;

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: userResponse
      });
    } else {
      // Buscar usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(400).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos'
        });
      }

      // Verificar que la cuenta esté activa
      if (!user.isActive) {
        return res.status(400).json({
          error: 'Cuenta desactivada',
          message: 'Tu cuenta ha sido desactivada'
        });
      }

      // Actualizar último login
      user.lastLogin = new Date();
      await user.save();

      // Generar token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login exitoso',
        token,
        user: user.toJSON()
      });
    }

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al iniciar sesión'
    });
  }
});

// GET /api/auth/me - Obtener usuario actual
router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al obtener información del usuario'
    });
  }
});

// GET /api/auth/verify-token - Verificar validez del token
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token requerido',
        message: 'No se proporcionó token de autenticación'
      });
    }

    const tokenResult = verifyToken(token);
    
    if (!tokenResult.valid) {
      return res.status(401).json({
        success: false,
        error: 'Token inválido',
        message: 'El token de autenticación no es válido o ha expirado'
      });
    }

    // Verificar que el usuario existe y está activo
    let user;
    if (global.USE_MEMORY_DB) {
      user = await memoryDB.findUserById(tokenResult.decoded.userId);
    } else {
      user = await User.findById(tokenResult.decoded.userId).select('-password');
    }

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no válido',
        message: 'El usuario no existe o ha sido desactivado'
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      user: user,
      tokenInfo: {
        issued: new Date(tokenResult.decoded.iat * 1000),
        expires: new Date(tokenResult.decoded.exp * 1000)
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Error al verificar token'
    });
  }
});

// POST /api/auth/reset-password - Solicitar restablecimiento de contraseña
router.post('/reset-password', validate(schemas.resetPassword), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        message: 'No existe una cuenta con este email'
      });
    }

    // Aquí normalmente enviarías un email con el token de reset
    // Por simplicidad, retornamos un mensaje de éxito
    res.json({
      success: true,
      message: 'Se ha enviado un enlace de restablecimiento a tu correo'
    });

  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al procesar solicitud'
    });
  }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // En un sistema más complejo, podrías invalidar el token
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al cerrar sesión'
    });
  }
});

// PUT /api/auth/update-profile - Actualizar perfil de usuario
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, country, timezone } = req.body;
    const userId = req.user._id;

    // Validación básica
    if (!name || !email) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Nombre y email son requeridos'
      });
    }

    if (global.USE_MEMORY_DB) {
      // Verificar si el email ya existe (excepto el usuario actual)
      const existingUser = await memoryDB.findUserByEmail(email);
      if (existingUser && existingUser._id !== userId) {
        return res.status(400).json({
          error: 'Email ya existe',
          message: 'Ya existe otra cuenta con este email'
        });
      }

      // Actualizar usuario
      const updatedUser = await memoryDB.updateUser(userId, {
        name,
        email,
        phone: phone || '',
        country: country || '',
        timezone: timezone || 'UTC-5'
      });

      if (!updatedUser) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'No se pudo encontrar el usuario'
        });
      }

      // Eliminar password del objeto response
      const { password: _, ...userResponse } = updatedUser;

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: userResponse
      });
    } else {
      // Verificar si el email ya existe (excepto el usuario actual)
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          error: 'Email ya existe',
          message: 'Ya existe otra cuenta con este email'
        });
      }

      // Actualizar usuario
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          phone: phone || '',
          country: country || '',
          timezone: timezone || 'UTC-5'
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'No se pudo encontrar el usuario'
        });
      }

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        user: updatedUser.toJSON()
      });
    }

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al actualizar perfil'
    });
  }
});

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validación básica
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Contraseña muy corta',
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    if (global.USE_MEMORY_DB) {
      // Obtener usuario
      const user = await memoryDB.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'No se pudo encontrar el usuario'
        });
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Contraseña incorrecta',
          message: 'La contraseña actual es incorrecta'
        });
      }

      // Hash de la nueva contraseña
      const salt = await bcrypt.genSalt(12);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      // Actualizar contraseña
      await memoryDB.updateUser(userId, { password: hashedNewPassword });

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    } else {
      // Obtener usuario
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado',
          message: 'No se pudo encontrar el usuario'
        });
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Contraseña incorrecta',
          message: 'La contraseña actual es incorrecta'
        });
      }

      // Actualizar contraseña
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Contraseña actualizada exitosamente'
      });
    }

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'Error al cambiar contraseña'
    });
  }
});

module.exports = router;
