import { FormEvent, useState } from 'react';
import { Modal } from '../Modal';
import { useCreatePartnerReferral, useUpdatePartnerReferral } from '@/hooks/useAdminWorkspace';
import { Partner, PartnerReferral } from '@/api/adminWorkspace';

export function ReferralEditor({
  partners,
  onClose,
}: {
  partners: Partner[];
  onClose(): void;
}) {
  const createReferral = useCreatePartnerReferral();
  const [partnerId, setPartnerId] = useState('');
  const [prospect, setProspect] = useState('');
  const [service, setService] = useState('');
  const [notes, setNotes] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!partnerId || !service.trim()) return;
    createReferral.mutate(
      {
        partner_id: partnerId,
        service_requested: service.trim(),
        prospect_reference: prospect || null,
        referral_direction: 'inbound',
        status: 'introduced',
        referral_value: null,
        commission_value: null,
        commission_status: 'not_applicable',
        outcome_notes: notes || null,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      variant="drawer"
      title="Log referral"
      description="Commercial introduction for partner network"
      footer={
        <div className="admin-modal-actions">
          <button type="button" className="workspace-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="log-referral-form"
            className="workspace-button workspace-button-primary"
            disabled={createReferral.isPending}
          >
            {createReferral.isPending ? 'Saving…' : 'Log referral'}
          </button>
        </div>
      }
    >
      <form id="log-referral-form" className="workspace-form" onSubmit={submit}>
        <label>
          Partner
          <select required value={partnerId} onChange={(event) => setPartnerId(event.target.value)}>
            <option value="">Choose a partner</option>
            {partners
              .filter((partner) => partner.is_active)
              .map((partner) => (
                <option value={partner.id} key={partner.id}>
                  {partner.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Client or prospect reference
          <input
            value={prospect}
            onChange={(event) => setProspect(event.target.value)}
            placeholder="e.g. Afsal wedding enquiry"
          />
        </label>
        <label>
          Service requested
          <input
            required
            value={service}
            onChange={(event) => setService(event.target.value)}
            placeholder="e.g. Stage decor"
          />
        </label>
        <label>
          Internal note
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
      </form>
    </Modal>
  );
}

export function ReferralUpdateDrawer({
  referral,
  onClose,
}: {
  referral: PartnerReferral;
  onClose(): void;
}) {
  const updateReferral = useUpdatePartnerReferral();
  const [status, setStatus] = useState(referral.status);
  const [service, setService] = useState(referral.service_requested);
  const [prospect, setProspect] = useState(referral.prospect_reference || '');
  const [referralValue, setReferralValue] = useState(referral.referral_value?.toString() || '');
  const [commissionValue, setCommissionValue] = useState(referral.commission_value?.toString() || '');
  const [commissionStatus, setCommissionStatus] = useState(referral.commission_status);
  const [notes, setNotes] = useState(referral.outcome_notes || '');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!service.trim()) return;
    updateReferral.mutate(
      {
        id: referral.id,
        input: {
          status,
          service_requested: service.trim(),
          prospect_reference: prospect || null,
          referral_value: referralValue ? Number(referralValue) : null,
          commission_value: commissionValue ? Number(commissionValue) : null,
          commission_status: commissionStatus,
          outcome_notes: notes || null,
        },
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      variant="drawer"
      title="Update introduction"
      description="Update partner referral record and commission status"
      footer={
        <div className="admin-modal-actions">
          <button type="button" className="workspace-button" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            form="update-referral-form"
            className="workspace-button workspace-button-primary"
            disabled={updateReferral.isPending}
          >
            {updateReferral.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      }
    >
      <form id="update-referral-form" className="workspace-form" onSubmit={submit}>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as PartnerReferral['status'])}
          >
            <option value="introduced">Introduced</option>
            <option value="in_discussion">In discussion</option>
            <option value="converted">Converted</option>
            <option value="not_converted">Not converted</option>
          </select>
        </label>
        <label>
          Service requested
          <input required value={service} onChange={(event) => setService(event.target.value)} />
        </label>
        <label>
          Client or prospect reference
          <input value={prospect} onChange={(event) => setProspect(event.target.value)} />
        </label>
        <div className="workspace-form-grid">
          <label>
            Referral value
            <input
              type="number"
              min="0"
              value={referralValue}
              onChange={(event) => setReferralValue(event.target.value)}
            />
          </label>
          <label>
            Commission value
            <input
              type="number"
              min="0"
              value={commissionValue}
              onChange={(event) => setCommissionValue(event.target.value)}
            />
          </label>
        </div>
        <label>
          Commission status
          <select
            value={commissionStatus}
            onChange={(event) =>
              setCommissionStatus(event.target.value as PartnerReferral['commission_status'])
            }
          >
            <option value="not_applicable">Not applicable</option>
            <option value="expected">Expected</option>
            <option value="received">Received</option>
            <option value="waived">Waived</option>
          </select>
        </label>
        <label>
          Outcome notes
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
      </form>
    </Modal>
  );
}
