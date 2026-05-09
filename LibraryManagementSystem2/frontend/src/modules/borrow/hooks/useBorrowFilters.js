import { useState } from 'react';

export function useBorrowFilters(requests) {
  const [statusFilter, setStatusFilter] = useState('');
  const filtered = statusFilter
    ? requests.filter((r) => r.status === statusFilter)
    : requests;
  return { filtered, statusFilter, setStatusFilter };
}
