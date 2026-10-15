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
      
      case 'cancelled':
      case 'inactive':
      case 'rejected':
        return 'admin-badge-danger';
      
      case 'scheduled':
      case 'info':
        return 'admin-badge-info';
      
      default:
        return 'admin-badge-neon';
    }
  };

  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span className={`admin-badge ${getStatusClass()} ${className}`} aria-label={`Status: ${label}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
    </span>
  );
}
