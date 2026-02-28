import React from 'react';
import { useLocation } from 'react-router-dom';
import { MatchboxPage, type Shot } from 'cafai-matchbox';

const Matchbox: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId') || 'm1';

  const initialShot = React.useMemo<Shot>(() => {
    const now = new Date().toISOString();
    return {
      id: `shot-${projectId}`,
      code: `PJ-${projectId}`,
      description: 'Matchbox',
      versions: [
        {
          id: 'v-a',
          name: 'Version A',
          status: 'in_progress',
          author: 'AI',
          timestamp: now,
          thumbnail: 'https://picsum.photos/id/237/320/180',
          description: 'Mock Version A',
          timeList: [
            { id: 'seg-1', name: 'Segment 1', startFrame: 0, endFrame: 79 },
            { id: 'seg-2', name: 'Segment 2', startFrame: 80, endFrame: 159 },
            { id: 'seg-3', name: 'Segment 3', startFrame: 160, endFrame: 239 },
          ],
          annotations: []
        },
        {
          id: 'v-b',
          name: 'Version B',
          status: 'pending',
          author: 'Expert',
          timestamp: now,
          thumbnail: 'https://picsum.photos/id/238/320/180',
          description: 'Mock Version B',
          timeList: [
            { id: 'seg-1', name: 'Segment 1', startFrame: 0, endFrame: 79 },
            { id: 'seg-2', name: 'Segment 2', startFrame: 80, endFrame: 159 },
            { id: 'seg-3', name: 'Segment 3', startFrame: 160, endFrame: 239 },
          ],
          annotations: []
        }
      ],
      differences: []
    };
  }, [projectId]);

  return (
    <MatchboxPage
      initialShot={initialShot}
      projectCode={`PJ-${projectId}`}
      totalFrames={240}
      persistVersionUpdate={() => {}}
    />
  );
};

export default Matchbox;
