import React from "react";
import { Box, Badge, Typography } from "@strapi/design-system";

const ContentStatusIndicator = ({ entry }) => {
  const getStatusInfo = () => {
    if (!entry) return { status: 'unknown', color: 'neutral', icon: '⚠️' };

    const isPublished = entry.publishedAt;
    const isDraft = !isPublished;
    const isScheduled = entry.publishedAt && new Date(entry.publishedAt) > new Date();
    
    if (isScheduled) {
      return {
        status: 'programado',
        color: 'secondary',
        icon: '⏰',
        message: `Publicación programada: ${new Date(entry.publishedAt).toLocaleDateString()}`
      };
    }
    
    if (isPublished) {
      return {
        status: 'publicado',
        color: 'success',
        icon: '✅',
        message: `Publicado: ${new Date(entry.publishedAt).toLocaleDateString()}`
      };
    }
    
    if (isDraft) {
      return {
        status: 'borrador',
        color: 'warning',
        icon: '📝',
        message: 'Contenido en borrador'
      };
    }

    return {
      status: 'desconocido',
      color: 'neutral',
      icon: '⚠️',
      message: 'Estado desconocido'
    };
  };

  const statusInfo = getStatusInfo();

  return (
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
      
      {entry?.updatedAt && (
        <Typography variant="pi" textColor="neutral500" marginTop={1}>
          Última modificación: {new Date(entry.updatedAt).toLocaleString()}
        </Typography>
      )}
    </Box>
  );
};

export default ContentStatusIndicator;
