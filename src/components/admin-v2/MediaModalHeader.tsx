// src/components/admin-v2/MediaModalHeader.tsx
import React from 'react';
import { X, Image as ImageIcon, Upload } from 'lucide-react';

interface MediaModalHeaderProps {
  title: string;
  totalImages: number;
  activeTab: 'library' | 'upload';
  onTabChange: (tab: 'library' | 'upload') => void;
  onClose: () => void;
}

export function MediaModalHeader({
  title,
  totalImages,
  activeTab,
  onTabChange,
  onClose,
}: MediaModalHeaderProps) {
  return (
    <div
      className="admin-modal-header"
      style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(182, 245, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--admin-text-primary, #2A2A2A)',
          }}
        >
          <ImageIcon size={20} />
        </div>
        <div>
          <h3 className="admin-modal-title" style={{ fontSize: '1.1rem', margin: 0 }}>
            {title}
          </h3>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-secondary, #666)' }}>
            {totalImages} total images
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--admin-bg-hover, #F5F5F2)',
          padding: '3px',
          borderRadius: '10px',
          gap: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => onTabChange('library')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 600,
            background: activeTab === 'library' ? 'var(--admin-bg-card, #FFFFFF)' : 'transparent',
            color: 'var(--admin-text-primary, #2A2A2A)',
            boxShadow: activeTab === 'library' ? 'var(--admin-shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <ImageIcon size={14} />
          Browse
        </button>
        <button
          type="button"
          onClick={() => onTabChange('upload')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            fontWeight: 600,
            background: activeTab === 'upload' ? 'var(--admin-bg-card, #FFFFFF)' : 'transparent',
            color: 'var(--admin-text-primary, #2A2A2A)',
            boxShadow: activeTab === 'upload' ? 'var(--admin-shadow-sm)' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Upload size={14} />
          Upload New
        </button>
      </div>

      <button onClick={onClose} className="admin-modal-close" type="button">
        <X size={20} />
      </button>
    </div>
  );
}
