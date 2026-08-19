import { listContactMessages } from '@/lib/db/queries'
import { StatusSelect } from '../_components/status-select'
import { EmptyState, PageHeading } from '../_components/ui'

export const dynamic = 'force-dynamic'

/**
 * The contact inbox. Rendered as cards rather than a table: the message body is
 * the point, and it does not fit in a table cell.
 */
export default async function AdminMessagesPage() {
  const messages = await listContactMessages()

  return (
    <div className="space-y-6">
      <PageHeading
        title="Messages"
        subtitle={`${messages.length} ${messages.length === 1 ? 'message' : 'messages'} from the contact form.`}
      />

      {messages.length === 0 ? (
        <EmptyState
          title="No messages"
          body="Enquiries sent through the contact form arrive here, newest first."
        />
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className="rounded-xl border border-border bg-card p-5"
              // Unread messages are the ones that need attention.
              data-unread={message.status === 'new' ? '' : undefined}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium">
                    {message.name}{' '}
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-normal capitalize text-muted-foreground">
                      {message.subject}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <a href={`mailto:${message.email}`} className="underline underline-offset-2">
                      {message.email}
                    </a>
                    <a href={`tel:+91${message.phone}`} className="underline underline-offset-2">
                      {message.phone}
                    </a>
                    <span>
                      {message.createdAt.toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <StatusSelect
                  kind="message"
                  id={message.id}
                  value={message.status}
                  label={`Status for message from ${message.name}`}
                />
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
                {message.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
