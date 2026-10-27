import { Link } from 'react-router';
import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import { Page, buttonClass } from '../Components/ui';

export default function NotFoundPage() {
  useDocumentTitle('Not found');

  return (
    <Page>
      <div className="ds-frame px-5 py-14 text-center">
        <p className="t-display text-pk-navy">404</p>
        <p className="mt-2 t-body text-pk-muted">
          That page wandered off into the tall grass.
        </p>
        <Link to="/" className={buttonClass('accent', 'lg', 'mt-7')}>
          Back to the Pokédex
        </Link>
      </div>
    </Page>
  );
}
