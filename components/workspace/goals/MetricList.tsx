import { KeyResult, KeyResultsTimeline } from '@/types/goal';
import MetricForm from './MetricForm';
import MetricPreview from './MetricPreview';

const MetricList = async ({ keyResult, timeLine:{data:timelines, error} }: 
  { keyResult: KeyResult, timeLine: { data: KeyResultsTimeline[] | null; error: string | null }; }) => {

  const getInitials = (name: string) => {
    const words = name.split(' ');
    return words.length > 1
      ? words[0][0] + words[1][0]
      : words[0][0] + (words[0][1] || ''); // Handle single-character names gracefully
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

      {timelines && timelines.length > 0 ? (
        <div>
          <h4 className="text-lg font-bold pb-4">Timeline</h4>

          <div className="overflow-auto no-scrollbar">
            <table className="w-full border text-sm text-left">
              <thead className="bg-baseBg">
                <tr>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Value</th>
                  <th className="border px-4 py-2">Created By</th>
                  <th className="border px-4 py-2">Note</th>
                  <th className="border px-4 py-2">Attachments</th>
                  <th className="border px-4 py-2">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {timelines.map((timeline, index) => (
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
                        <div className="flex flex-wra gap-2 max-h-40 overflow-auto no-scrollbar">
                          {timeline.attachments.slice(0, 2).map(({ url, type }:{ url:string, type:string }, idx:number) => (
                            <div
                              key={idx}
                              className="size-16 rounded-lg overflow-hidden"
                            >
                              {renderAttachment(url, type)}
                            </div>
                          ))}
                          {timeline.attachments.length > 2 && (
                            <div className="size-16 rounded-lg flex text-sm items-center justify-center">
                              +{timeline.attachments.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-2 flax gap-2 items-center">
                    <MetricPreview 
                      metric={timeline}
                    />
                      
                    </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center border px-4 py-6 w-full">
          No timeline data available.
        </div>
      )}
    </div>
  );
};

export default MetricList;

export  const renderAttachment = (url: string, type: string) => {
  if (type.startsWith('image')) {
    return <img src={url} alt="Image Preview" className="object-cover w-full h-full" />;
  } else if (type.startsWith('video')) {
    return (
      <video controls className="w-full h-full">
        <source src={url} type={type} />
      </video>
    );
  } else if (type === 'application/pdf') {
    return (
      <iframe
        src={url}
        title="PDF Preview"
        className="w-full h-full no-scrollbar border"
      ></iframe>
    );
  } else {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-xs w-full h-full flex justify-center items-center underline"
      >
        View File
      </a>
    );
  }
};
