import { useDocumentTitle } from '../Hooks/useDocumentTitle';
import PageHeader from '../Components/PageHeader';
import TileLink from '../Components/TileLink';
import { Page, Panel } from '../Components/ui';
import { GUIDE_GROUPS, GUIDE_TOOLS } from '../Utils/guide';

export default function GuidePage() {
  useDocumentTitle('Guide');

  return (
    <Page wide>
      <PageHeader
        title="Guide"
        subtitle="Tools and everything else the games keep track of"
      />

      <ul className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {GUIDE_TOOLS.map((tool) => (
          <li key={tool.to}>
            <TileLink compact to={tool.to} title={tool.title}>
              {tool.blurb}
            </TileLink>
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        {GUIDE_GROUPS.map((group) => (
          <Panel key={group.title} title={group.title}>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              {group.resources.map((resource) => (
                <li key={resource.id}>
                  <TileLink
                    compact
                    to={`/guide/${resource.id}`}
                    title={resource.title}
                  >
                    {resource.blurb}
                  </TileLink>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </Page>
  );
}
