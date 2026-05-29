interface ConsultantBase {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  approval_status?: string;
  account_status?: string;
  status?: string;
  [key: string]: unknown;
}

export const getConsultantApprovalStatus = (consultant: ConsultantBase): string => {
  const status = consultant?.approval_status ?? consultant?.account_status ?? consultant?.status;

  if (typeof status !== 'string') {
    return '';
  }

  return status.trim().toLowerCase();
};

export const isConsultantApproved = (consultant: ConsultantBase): boolean => {
  const approvalStatus = getConsultantApprovalStatus(consultant);

  return approvalStatus === '' || approvalStatus === 'approved';
};

export const normalizeConsultantApproval = <T extends ConsultantBase>(consultant: T): T & { approval_status: string; account_status: string } => {
  const approvalStatus = getConsultantApprovalStatus(consultant) || 'pending';

  return {
    ...consultant,
    approval_status: consultant.approval_status ?? approvalStatus,
    account_status: consultant.account_status ?? approvalStatus,
  };
};