// The API contract does not expose a standalone item endpoint — items live
// inside an auction creation payload. This page is a friendly shortcut that
// hands the user off to the full create-auction flow.

import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { ROUTES } from '../../shared/constants/routes.constant.js';

export default function AddAuctionItemPage() {
  return (
    <div className="max-w-2xl">
      <div className="card p-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600 mx-auto">
          <Package size={26} />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-800">Add an item</h1>
        <p className="mt-1 text-sm text-slate-500">
          In this MVP, items are configured when creating an auction. Continue
          to the auction form to add an item, set pricing, and schedule it.
        </p>
        <Link to={ROUTES.ADMIN_AUCTION_NEW} className="btn-primary mt-6 inline-flex">
          Create auction with item <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
