import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'active' | 'inactive' | string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusClass = () => {
    const normalized = status.toLowerCase();
    
    switch (normalized) {
      case 'confirmed':
      case 'completed':
      case 'active':
      case 'success':
        return 'admin-badge-success';
      
      case 'pending':
      case 'ongoing':
        return 'admin-badge-warning';
      case 'quotation_in_progress':
        return 'admin-badge-neon';
      
      case 'cancelled':
      case 'declined':
      case 'inactive':
      case 'rejected':
        return 'admin-badge-danger';
      
      case 'scheduled':
      case 'appointment_scheduled':
      case 'info':
        return 'admin-badge-info';
      
      default:
        return 'admin-badge-neon';
    }
  };

  const label = status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <span className={`admin-badge ${getStatusClass()} ${className}`} aria-label={`Status: ${label}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
