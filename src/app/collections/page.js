import { redirect } from 'next/navigation';

export default function CollectionsBasePage() {
  // Gracefully redirect the base /collections route instantly to /collections/all
  redirect('/collections/all');
}
