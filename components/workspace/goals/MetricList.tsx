import { Button } from '@/components/ui/button';
import { fetchMetricsByKeyResultId } from '@/lib/server/goals';
import { KeyResult, KeyResultsTimeline } from '@/types/goal';
import React from 'react';
import MetricForm from './MetricForm';
import Image from 'next/image';

const MetricList = async ({ keyResult }: { keyResult: KeyResult }) => {
  const { data: timelines, error } = await fetchMetricsByKeyResultId(keyResult?.id!);

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1
      ? words[0][0] + words[1][0]
      : words[0][0] + (words[0][1] || ''); // Handle single-character names gracefully
  };

  const renderAttachment = (url: string, type: string) => {
    if (type.startsWith('image')) {
      return <img src={url} alt="Image Preview" className="object-cover w-full h-full  " />;
    } else if (type.startsWith('video')) {
      return (
        <video controls className="w-full h-full ">
          <source src={url} type={type} />
        </video>
      );
    } else if (type === 'application/pdf') {
      return (
        <iframe
          src={url}
          title="PDF Preview"
          className="w-full h-full  no-scrollbar border"
        ></iframe>
      );
    } else {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-xs w-full h-full flex justify-center text-wrap items-center underline"
        >
          View File
        </a>
      );
    }
  };
  

  if (error) {
    return <div className="text-red-500">Failed to load timelines. Please try again later.</div>;
  }

  return (
    <div className="w-full space-y-4">
      <MetricForm keyResult={keyResult!} />

      <div className="flex items-center gap-2">
        <div className="rounded-full h-10 w-10 flex justify-center items-center font-bold bg-baseLight uppercase">
          {getInitials(String(keyResult?.keyResultOwner) || '')}
        </div>
        <small className="truncate text-sm">{keyResult?.keyResultOwner}</small>
      </div>

      <div>
        <h4 className="text-lg font-bold pb-4">Timeline</h4>

        <div className="overflow-auto no-scrollbar">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-baseBg">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Value</th>
                <th className="border px-4 py-2">Created By</th>
                <th className="border px-4 py-2">Note</th>
                <th className="border px-4 py-2">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {timelines && timelines?.length > 0 ? (
                timelines.map((timeline: KeyResultsTimeline, index: number) => (
                  <tr key={index} className="odd:bg-white even:bg-baseBg">
                    <td className="px-4 py-2">
                      {new Date(timeline?.created_at || '').toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">{timeline?.value || '-'}</td>
                    <td className="px-4 py-2">{timeline?.createdBy || '—'}</td>
                    <td className="px-4 py-2">
                      {timeline.Note ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: timeline.Note }}
                          className="prose max-w-96 text-xs max-h-24 overflow-hidden"
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {timeline.attachments?.length ? (
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-auto no-scrollbar">
                          {timeline.attachments.map(
                            ({ url, type }: { url: string; type: string }, idx: number) => (
                              <div key={idx} className="size-20 rounded-lg overflow-hidden">
                                {renderAttachment(url, type)}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center border px-4 py-2">
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
