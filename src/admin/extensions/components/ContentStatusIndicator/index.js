import React, { useState, useEffect } from "react";
import { Box, Badge, Typography, Button, TextInput, Flex } from "@strapi/design-system";
import { Play } from "@strapi/icons";
import { useNotification } from '@strapi/helper-plugin';
import { useLocation } from 'react-router-dom';

const ContentStatusIndicator = () => {
  const toggleNotification = useNotification();
  const location = useLocation();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPostPage, setIsPostPage] = useState(false);
  // Static demo data to showcase component potential
  const statusInfo = {
    status: 'borrador',
    color: 'warning',
    icon: '📝',
    message: 'Contenido en borrador - Demo'
  };
console.log('Current path:', location.pathname);
   useEffect(() => {
    const isPostPage =
      /^\/content-manager\/collection-types\/api::posts\.post/.test(
        location.pathname
      )
    setIsPostPage(isPostPage)
  }, [location.pathname])

  if (!isPostPage) return null;

  const handleOpenScheduleModal = () => {
    setShowScheduleModal(true);
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduleDate(tomorrow.toISOString().split('T')[0]);
    setScheduleTime('09:00');
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setScheduleDate('');
    setScheduleTime('');
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toggleNotification({
        type: 'warning',
        message: 'Por favor selecciona fecha y hora'
      });
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    toggleNotification({
      type: 'success',
      message: `Publicación programada exitosamente para ${scheduledDateTime.toLocaleString()}`
    });

    handleCloseScheduleModal();
  };

  return (
    <>
      <Box padding={2}>
        <Box marginBottom={2}>
          <Badge 
            backgroundColor={`${statusInfo.color}100`} 
            textColor={`${statusInfo.color}600`}
          >
            {statusInfo.icon} {statusInfo.status.toUpperCase()}
          </Badge>
        </Box>
        
        <Typography variant="pi" textColor="neutral600">
          {statusInfo.message}
        </Typography>
        
        <Typography variant="pi" textColor="neutral500" marginTop={1}>
          Última modificación: {new Date().toLocaleString()}
        </Typography>
        
        {/* Start Button - Only show for drafts */}
        {statusInfo.status === 'borrador' && (
          <Box marginTop={3}>
            <Button
              variant="secondary"
              size="S"
              startIcon={<Play />}
              onClick={handleOpenScheduleModal}
            >
              Start
            </Button>
          </Box>
        )}
      </Box>

      {/* Schedule Modal */}
      {showScheduleModal && (
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
                📅 Programar Publicación
              </Typography>
              
              <Typography variant="omega" textColor="neutral600">
                Selecciona cuándo quieres que se publique este contenido
              </Typography>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <TextInput
                  type="date"
                  label="Fecha de publicación"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />

                <TextInput
                  type="time"
                  label="Hora de publicación"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                />
              </div>

              <Flex justifyContent="flex-end" gap={2}>
                <Button
                  variant="tertiary"
                  onClick={handleCloseScheduleModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  onClick={handleConfirmSchedule}
                >
                  ⏰ Programar
                </Button>
              </Flex>
            </div>
          </Box>
        </div>
      )}
    </>
  );
};

export default ContentStatusIndicator;
