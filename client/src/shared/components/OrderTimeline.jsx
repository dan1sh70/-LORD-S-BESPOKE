import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock } from 'lucide-react';

const OrderTimeline = ({ history }) => {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {history.map((event, eventIdx) => (
          <li key={eventIdx}>
            <div className="relative pb-8">
              {eventIdx !== history.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                    <CheckCircle2 className="h-5 w-5 text-primary-600" aria-hidden="true" />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-slate-500">
                      Status changed to <span className="font-semibold text-slate-900">{event.status.replace(/_/g, ' ')}</span>
                    </p>
                    {event.note && (
                      <p className="mt-1 text-sm text-slate-600 bg-slate-50 p-2 rounded-md border border-slate-100">
                        "{event.note}"
                      </p>
                    )}
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-slate-500 flex flex-col items-end">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {format(new Date(event.timestamp), 'MMM d, h:mm a')}</span>
                    <span className="text-xs font-medium text-slate-400 mt-1">{event.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderTimeline;
