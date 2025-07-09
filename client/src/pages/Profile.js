import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { 
  FiUser, FiMail, FiLock, FiSave, FiCamera, 
  FiShield, FiBell, FiCreditCard, 
  FiEye, FiEyeOff, FiCheck, FiX 
} from 'react-icons/fi';
import '../styles/Profile.css';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('personal');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Estados para información personal
    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        timezone: ''
    });
    
    // Estados para cambio de contraseña
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    // Estados para configuraciones
    const [settings, setSettings] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotionalEmails: false,
        twoFactorAuth: false,
        language: 'es'
    });

    const tabs = [
        { id: 'personal', label: 'Información Personal', icon: FiUser },
        { id: 'security', label: 'Seguridad', icon: FiShield },
        { id: 'notifications', label: 'Notificaciones', icon: FiBell },
        { id: 'billing', label: 'Facturación', icon: FiCreditCard }
    ];

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                country: user.country || '',
                timezone: user.timezone || 'UTC-5'
            });
        }
    }, [user]);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    };

    const handlePersonalInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await authService.updateProfile(personalInfo);
            if (response.success) {
                updateUser(response.user);
                showMessage('success', 'Información personal actualizada exitosamente');
            } else {
                showMessage('error', response.error);
            }
        } catch (error) {
            showMessage('error', 'Error al actualizar información personal');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'Las contraseñas no coinciden');
            return;
        }
        
        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await authService.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            if (response.success) {
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                showMessage('success', 'Contraseña actualizada exitosamente');
            } else {
                showMessage('error', response.error);
            }
        } catch (error) {
            showMessage('error', 'Error al actualizar contraseña');
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsUpdate = async (settingKey, value) => {
        setSettings(prev => ({ ...prev, [settingKey]: value }));
        
        try {
            // TODO: Integrar con API real
            showMessage('success', 'Configuración actualizada');
        } catch (error) {
            showMessage('error', 'Error al actualizar configuración');
        }
    };

    const renderPersonalInfo = () => (
        <motion.form 
            className="profile-form"
            onSubmit={handlePersonalInfoUpdate}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="form-section">
                <h3>Información Básica</h3>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="name">
                            <FiUser /> Nombre completo
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={personalInfo.name}
                            onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">
                            <FiMail /> Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="phone">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            value={personalInfo.phone}
                            onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="country">País</label>
                        <select
                            id="country"
                            value={personalInfo.country}
                            onChange={(e) => setPersonalInfo({...personalInfo, country: e.target.value})}
                        >
                            <option value="">Seleccionar país</option>
                            <option value="AR">Argentina</option>
                            <option value="CL">Chile</option>
                            <option value="CO">Colombia</option>
                            <option value="MX">México</option>
                            <option value="PE">Perú</option>
                            <option value="ES">España</option>
                            <option value="US">Estados Unidos</option>
                        </select>
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="timezone">Zona horaria</label>
                    <select
                        id="timezone"
                        value={personalInfo.timezone}
                        onChange={(e) => setPersonalInfo({...personalInfo, timezone: e.target.value})}
                    >
                        <option value="UTC-5">UTC-5 (Colombia, Perú)</option>
                        <option value="UTC-4">UTC-4 (Chile, Venezuela)</option>
                        <option value="UTC-3">UTC-3 (Argentina, Brasil)</option>
                        <option value="UTC-6">UTC-6 (México)</option>
                        <option value="UTC+1">UTC+1 (España)</option>
                    </select>
                </div>
            </div>
            
            <button type="submit" className="save-btn" disabled={loading}>
                <FiSave /> {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
        </motion.form>
    );

    const renderSecurity = () => (
        <motion.div 
            className="security-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <form className="profile-form" onSubmit={handlePasswordChange}>
                <div className="form-section">
                    <h3>Cambiar Contraseña</h3>
                    
                    <div className="form-group">
                        <label htmlFor="currentPassword">
                            <FiLock /> Contraseña actual
                        </label>
                        <div className="password-input">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                id="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                required
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            >
                                {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="newPassword">Nueva contraseña</label>
                        <div className="password-input">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                id="newPassword"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                required
                                minLength="6"
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            >
                                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                        <div className="password-input">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                id="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                required
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            >
                                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>
                </div>
                
                <button type="submit" className="save-btn" disabled={loading}>
                    <FiSave /> {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>
            </form>
            
            <div className="security-options">
                <h3>Opciones de Seguridad</h3>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Autenticación de dos factores</h4>
                        <p>Añade una capa extra de seguridad a tu cuenta</p>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleSettingsUpdate('twoFactorAuth', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </motion.div>
    );

    const renderNotifications = () => (
        <motion.div 
            className="notifications-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h3>Preferencias de Notificaciones</h3>
            
            <div className="settings-list">
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Notificaciones por email</h4>
                        <p>Recibe actualizaciones importantes por correo</p>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingsUpdate('emailNotifications', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Actualizaciones de órdenes</h4>
                        <p>Notificaciones sobre el estado de tus pedidos</p>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.orderUpdates}
                            onChange={(e) => handleSettingsUpdate('orderUpdates', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
                
                <div className="setting-item">
                    <div className="setting-info">
                        <h4>Emails promocionales</h4>
                        <p>Ofertas especiales y descuentos</p>
                    </div>
                    <label className="switch">
                        <input 
                            type="checkbox" 
                            checked={settings.promotionalEmails}
                            onChange={(e) => handleSettingsUpdate('promotionalEmails', e.target.checked)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            
            <div className="language-section">
                <h3>Idioma</h3>
                <select 
                    value={settings.language}
                    onChange={(e) => handleSettingsUpdate('language', e.target.value)}
                    className="language-select"
                >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                </select>
            </div>
        </motion.div>
    );

    const renderBilling = () => (
        <motion.div 
            className="billing-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h3>Información de Facturación</h3>
            
            <div className="billing-info">
                <div className="info-card">
                    <h4>Método de pago preferido</h4>
                    <p>No hay métodos de pago guardados</p>
                    <button className="add-payment-btn">
                        <FiCreditCard /> Agregar método de pago
                    </button>
                </div>
                
                <div className="info-card">
                    <h4>Historial de pagos</h4>
                    <p>Aquí aparecerán tus transacciones</p>
                    <button className="view-history-btn">
                        Ver historial completo
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="profile-page">
            {/* Header */}
            <motion.div 
                className="profile-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="header-content">
                    <div className="user-avatar">
                        <div className="avatar-circle">
                            <FiUser size={32} />
                        </div>
                        <button className="change-avatar-btn">
                            <FiCamera size={16} />
                        </button>
                    </div>
                    <div className="user-info">
                        <h1>Mi Perfil</h1>
                        <p>Gestiona tu información personal y configuraciones</p>
                    </div>
                </div>
            </motion.div>

            {/* Mensaje de notificación */}
            {message.text && (
                <motion.div 
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {message.type === 'success' ? <FiCheck /> : <FiX />}
                    {message.text}
                </motion.div>
            )}

            {/* Tabs */}
            <motion.div 
                className="profile-tabs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <Icon size={20} />
                            {tab.label}
                        </button>
                    );
                })}
            </motion.div>

            {/* Contenido de tabs */}
            <div className="tab-content">
                {activeTab === 'personal' && renderPersonalInfo()}
                {activeTab === 'security' && renderSecurity()}
                {activeTab === 'notifications' && renderNotifications()}
                {activeTab === 'billing' && renderBilling()}
            </div>
        </div>
    );
};

export default Profile;
