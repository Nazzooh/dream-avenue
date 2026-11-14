import { FormEvent, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { Modal } from '../Modal';
import {
  Partner,
  PartnerCategory,
  PartnerContact,
  partnerCategories,
} from '@/api/adminWorkspace';

export const blankContact = (): PartnerContact => ({
  name: '',
  role_title: '',
  phone: '',
  email: '',
  is_primary: true,
});

export const blankPartner = () => ({
  name: '',
  categories: [] as PartnerCategory[],
  tags: '',
  service_area: '',
  website: '',
  social_url: '',
  notes: '',
  is_preferred: false,
  is_active: true,
  contacts: [blankContact()],
});

export function PartnerEditor({
  partner,
  onClose,
  onSave,
  saving,
}: {
  partner?: Partner;
  onClose(): void;
  onSave(input: ReturnType<typeof blankPartner>): void;
  saving: boolean;
}) {
  const [form, setForm] = useState(() =>
    partner
      ? {
          name: partner.name,
          categories: partner.categories,
          tags: partner.tags.join(', '),
          service_area: partner.service_area || '',
          website: partner.website || '',
          social_url: partner.social_url || '',
          notes: partner.notes || '',
          is_preferred: partner.is_preferred,
          is_active: partner.is_active,
          contacts: partner.partner_contacts?.length
            ? partner.partner_contacts
            : [blankContact()],
        }
      : blankPartner()
  );

  const setContact = (index: number, patch: Partial<PartnerContact>) =>
    setForm((current) => ({
      ...current,
      contacts: current.contacts.map((contact, itemIndex) =>
        itemIndex === index ? { ...contact, ...patch } : contact
      ),
    }));

  const toggleCategory = (item: PartnerCategory) =>
    setForm((current) => ({
      ...current,
      categories: current.categories.includes(item)
        ? current.categories.filter((category) => category !== item)
        : [...current.categories, item],
    }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.categories.length) return;
    onSave({
      ...form,
      tags: form.tags
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean) as any,
      contacts: form.contacts,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      variant="drawer"
      title={partner ? 'Edit partner' : 'Add a partner'}
      description="Commercial partner profile and contact information"
      footer={
        <div className="admin-modal-actions">
          <button type="button" className="workspace-button" onClick={onClose}>
            Cancel
          </button>
          <button
            disabled={saving}
            form="partner-editor-form"
            className="workspace-button workspace-button-primary"
            type="submit"
          >
            <Check size={17} className="inline mr-1" />
            {saving ? 'Saving…' : 'Save partner'}
          </button>
        </div>
      }
    >
      <form id="partner-editor-form" onSubmit={submit} className="workspace-form">
        <label>
          Business or person name
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <fieldset>
          <legend>Services</legend>
          <div className="workspace-check-grid">
            {partnerCategories.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={form.categories.includes(item)}
                  onChange={() => toggleCategory(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="workspace-form-grid">
          <label>
            Service area
            <input
              value={form.service_area}
              onChange={(event) => setForm({ ...form, service_area: event.target.value })}
            />
          </label>
          <label>
            Tags
            <input
              value={form.tags}
              placeholder="wedding, corporate"
              onChange={(event) => setForm({ ...form, tags: event.target.value })}
            />
          </label>
        </div>
        <div className="workspace-form-grid">
          <label>
            Website
            <input
              type="url"
              value={form.website}
              onChange={(event) => setForm({ ...form, website: event.target.value })}
            />
          </label>
          <label>
            Social link
            <input
              type="url"
              value={form.social_url}
              onChange={(event) => setForm({ ...form, social_url: event.target.value })}
            />
          </label>
        </div>
        <label>
          Internal notes
          <textarea
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
          />
        </label>
        <div className="workspace-switch-row">
          <label>
            <input
              type="checkbox"
              checked={form.is_preferred}
              onChange={(event) => setForm({ ...form, is_preferred: event.target.checked })}
            />{' '}
            Preferred partner
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
            />{' '}
            Active
          </label>
        </div>
        <div className="workspace-section-heading">
          <h3>Contacts</h3>
          <button
            type="button"
            className="workspace-text-button"
            onClick={() => setForm({ ...form, contacts: [...form.contacts, blankContact()] })}
          >
            <Plus size={15} /> Add contact
          </button>
        </div>
        {form.contacts.map((contact, index) => (
          <div className="workspace-contact-form" key={index}>
            <div className="workspace-form-grid">
              <label>
                Name
                <input
                  required
                  value={contact.name}
                  onChange={(event) => setContact(index, { name: event.target.value })}
                />
              </label>
              <label>
                Role
                <input
                  value={contact.role_title || ''}
                  onChange={(event) => setContact(index, { role_title: event.target.value })}
                />
              </label>
            </div>
            <div className="workspace-form-grid">
              <label>
                Phone
                <input
                  value={contact.phone || ''}
                  onChange={(event) => setContact(index, { phone: event.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={contact.email || ''}
                  onChange={(event) => setContact(index, { email: event.target.value })}
                />
              </label>
            </div>
            {form.contacts.length > 1 && (
              <button
                type="button"
                className="workspace-danger-link"
                onClick={() =>
                  setForm({
                    ...form,
                    contacts: form.contacts.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
              >
                Remove contact
              </button>
            )}
          </div>
        ))}
      </form>
    </Modal>
  );
}
