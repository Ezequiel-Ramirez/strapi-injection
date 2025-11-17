import React, { useState } from "react";
import { 
  Button, 
  Typography,
  TextInput,
  Textarea,
  Flex,
  Box
} from "@strapi/design-system";
import { Download, User } from "@strapi/icons";
import { useNotification } from '@strapi/helper-plugin';

const CustomActionButton = () => {
  const toggleNotification = useNotification();
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExport = async () => {
    try {
      // Simular número aleatorio de entradas exportadas (entre 1 y 50)
      const randomCount = Math.floor(Math.random() * 50) + 1;
      
      // Simular datos de exportación
      const exportData = Array.from({ length: randomCount }, (_, index) => ({
        id: index + 1,
        title: `Entrada ${index + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Crear y descargar archivo JSON
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toggleNotification({
        type: 'success',
        message: `${randomCount} elementos exportados exitosamente`
      });
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: 'Error al exportar los datos'
      });
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitForm = () => {
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
      toggleNotification({
        type: 'warning',
        message: 'Por favor completa todos los campos'
      });
      return;
    }

    // Mostrar dialog de confirmación
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    try {
      // Simular envío de datos (delay de 2 segundos)
      await new Promise(resolve => setTimeout(resolve, 2000));

      toggleNotification({
        type: 'success',
        message: `Datos enviados exitosamente para ${formData.nombre}`
      });

      handleCloseModal();
    } catch (error) {
      toggleNotification({
        type: 'warning',
        message: 'Error al enviar los datos'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          variant="secondary"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Exportar Datos
        </Button>
        
        <Button
          variant="tertiary"
          startIcon={<User />}
          onClick={handleOpenModal}
        >
          Enviar Datos
        </Button>
      </div>

      {/* Modal using Design System */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <Box
            background="neutral0"
            padding={6}
            borderRadius="4px"
            style={{
              width: '400px',
              maxWidth: '90vw'
            }}
            shadow="tableShadow"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Typography variant="beta" fontWeight="bold">
                Enviar Datos de Usuario
              </Typography>
              
              <Box spacing={3}>
                <TextInput
                  label="Nombre"
                  placeholder="Ingresa tu nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                />

                <TextInput
                  label="Email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />

                <Textarea
                  name=""
                  label="Mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.mensaje}
                  onChange={(e) => handleInputChange('mensaje', e.target.value)}
                />
              </Box>

              <Flex justifyContent="flex-end" gap={2}>
                <Button
                  variant="tertiary"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmitForm}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </Button>
              </Flex>
            </div>
          </Box>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}
        >
          <Box
            background="neutral0"
            padding={6}
            borderRadius="4px"
            style={{
              width: '350px',
              maxWidth: '90vw'
            }}
            shadow="tableShadow"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Typography variant="beta" fontWeight="bold">
                Confirmar Envío
              </Typography>
              
              <Typography>
                ¿Estás seguro de que deseas enviar estos datos?
              </Typography>

              <Flex justifyContent="flex-end" gap={2}>
                <Button
                  variant="tertiary"
                  onClick={handleCancelSubmit}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirmSubmit}
                >
                  Confirmar
                </Button>
              </Flex>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default CustomActionButton;
