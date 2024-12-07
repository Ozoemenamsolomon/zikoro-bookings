import { Button } from '@/components/ui/button';
import { fetchMetricsByKeyResultId } from '@/lib/server/goals';
import { KeyResult, KeyResultsTimeline } from '@/types/goal';
import React from 'react';
import MetricForm from './MetricForm';

const MetricList = async ({ keyResult }: { keyResult: KeyResult }) => {
  const { data: timelines, error } = await fetchMetricsByKeyResultId(keyResult?.id!);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1
      ? words[0][0] + words[1][0]
      : words[0][0] + (words[0][1] || ''); // Handle single character names gracefully
  };

  if (error) {
    return <div className="text-red-500">Failed to load timelines. Please try again later.</div>;
  }

  console.log({ timelines });
  return (
    <div className="w-full space-y-4">
      <MetricForm keyResult={keyResult!} />

      <div className="flex-1 min-w-0 truncate flex gap-2 items-center">
        <div className="rounded-full h-10 w-10 flex justify-center items-center font-bold bg-baseLight uppercase">
          {getInitials(String(keyResult?.keyResultOwner) || '')}
        </div>
        <small className="truncate text-sm">{keyResult?.keyResultOwner}</small>
      </div>

      <div>
        <h4 className="text-lg font-bold pb-4">Timeline</h4>

        <div className="overflow-auto no-scrollbar">
          <table className="w-full border-collapse text-[12px] md:text-sm text-left">
            <thead className="bg-baseBg">
              <tr>
                <th className="border- px-4 py-2">Date</th>
                <th className="border- border-gray- px-4 py-2">Value</th>
                <th className="border- border-gray- px-4 py-2">Created By</th>
                <th className="border- border-gray- px-4 py-2">Note</th>
                <th className="border- border-gray- px-4 py-2">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {timelines && timelines?.length > 0 ? (
                timelines?.map((timeline: KeyResultsTimeline, index: number) => (
                  <tr key={index} className="odd:bg-white even:bg-baseBg">
                    <td className="px-4 py-2">
                      {new Date(timeline?.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{timeline?.value || '-'}</td>
                    <td className="px-4 py-2">{timeline?.createdBy}</td>
                    <td className="px-4 py-2">
                      {timeline.Note ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: timeline.Note }}
                          className="prose max-w-none text-xs"
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-2 flex flex-col">
                      {timeline.attachments?.length ? (
                        timeline.attachments.map(({ url, type }:{ url:string, type:string }, idx:number) => (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={idx}
                            className="text-xs w-40 text-blue-500 truncate min-w-0"
                          >
                            {type || 'Attachment'}
                          </a>
                        ))
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center border border-gray-300 px-4 py-2">
                    No timeline data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetricList;
