import { useState } from 'react'
import dayjs from 'dayjs'
import { Button, ConfirmDialog, Spinner, toast } from '../../../components'
import {
  useAddCustomerNoteMutation,
  useDeleteCustomerNoteMutation,
  useGetCustomerNotesQuery,
  useUpdateCustomerNoteMutation,
} from '../../../services'
import type { CustomerNote } from '../../../types/customer'
import { getFormErrorMessage } from './customerFormShared'

const DATETIME_FORMAT = 'MMM D, YYYY h:mm A'

const textareaClass =
  'w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'

export const NotesSection = ({ customerId }: { customerId: string }) => {
  const { data: notes, isLoading } = useGetCustomerNotesQuery(customerId)
  const [addNote, { isLoading: adding }] = useAddCustomerNoteMutation()
  const [body, setBody] = useState('')

  const submit = async () => {
    const trimmed = body.trim()
    if (!trimmed) return
    try {
      await addNote({ customerId, body: { body: trimmed } }).unwrap()
      setBody('')
    } catch (err) {
      toast.error(getFormErrorMessage(err))
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">Notes</h2>

      <div className="mb-4 flex flex-col gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              void submit()
            }
          }}
          rows={3}
          placeholder="Add a note…"
          className={textareaClass}
        />
        <div className="flex justify-end">
          <Button size="sm" onPress={submit} isPending={adding} isDisabled={!body.trim()}>
            Add note
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : !notes || notes.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400 dark:text-slate-500">No notes yet.</p>
      ) : (
        <ul className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
          {notes.map((note) => (
            <NoteItem key={note.id} customerId={customerId} note={note} />
          ))}
        </ul>
      )}
    </section>
  )
}

const NoteItem = ({ customerId, note }: { customerId: string; note: CustomerNote }) => {
  const [updateNote, { isLoading: saving }] = useUpdateCustomerNoteMutation()
  const [deleteNote, { isLoading: deleting }] = useDeleteCustomerNoteMutation()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note.body)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const save = async () => {
    const trimmed = draft.trim()
    if (!trimmed || trimmed === note.body) {
      setEditing(false)
      return
    }
    try {
      await updateNote({ customerId, noteId: note.id, body: { body: trimmed } }).unwrap()
      setEditing(false)
    } catch (err) {
      toast.error(getFormErrorMessage(err))
    }
  }

  const remove = async () => {
    try {
      await deleteNote({ customerId, noteId: note.id }).unwrap()
    } catch (err) {
      toast.error(getFormErrorMessage(err))
      setConfirmingDelete(false)
    }
  }

  return (
    <li className="group rounded-lg border border-slate-200 p-3 dark:border-slate-800">
      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            autoFocus
            className={textareaClass}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onPress={() => {
                setDraft(note.body)
                setEditing(false)
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onPress={save} isPending={saving}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="whitespace-pre-wrap text-sm text-slate-800 dark:text-slate-200">{note.body}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {dayjs(note.createdAtUtc).format(DATETIME_FORMAT)}
              {note.updatedAtUtc ? ' · edited' : ''}
            </p>
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => {
                  setDraft(note.body)
                  setEditing(true)
                }}
                aria-label="Edit note"
                className="flex size-6 items-center justify-center rounded text-slate-400 transition hover:cursor-pointer hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <i className="fa-solid fa-pen text-xs" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                aria-label="Delete note"
                className="flex size-6 items-center justify-center rounded text-slate-400 transition hover:cursor-pointer hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
              >
                <i className="fa-solid fa-trash text-xs" aria-hidden />
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Delete note"
        description="Delete this note? This can't be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        isPending={deleting}
        onConfirm={remove}
      />
    </li>
  )
}
