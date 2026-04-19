import { createMemo, createSignal, For, Show, createEffect } from "solid-js";

export function ReassignTaskModal(props) {
  // props:
  // open() -> boolean
  // onClose() -> void
  // task() -> { item_id, item_name, user_login_id, display_name, due_dtm, priority }
  // users() -> [{ user_login_id, display_name, email_address, active, workload }]
  // currentUser() -> { user_login_id, display_name }
  // showToast(message, type?) -> void
  // onSubmit(payload) -> Promise<{ success, error }>

  const [query, setQuery] = createSignal("");
  const [newAssigneeId, setNewAssigneeId] = createSignal("");
  const [reason, setReason] = createSignal("");
  const [notifyNewAssignee, setNotifyNewAssignee] = createSignal(true);
  const [notifyPreviousAssignee, setNotifyPreviousAssignee] =
    createSignal(true);
  const [saving, setSaving] = createSignal(false);

  const currentAssignee = createMemo(() =>
    props.users().find((u) => u.user_login_id === props.task()?.user_login_id),
  );

  const filteredUsers = createMemo(() => {
    const q = query().trim().toLowerCase();
    return props
      .users()
      .filter((u) => u.active)
      .filter((u) => u.user_login_id !== props.task()?.user_login_id)
      .filter((u) =>
        q.length === 0
          ? true
          : [u.display_name, u.email_address]
              .join(" ")
              .toLowerCase()
              .includes(q),
      )
      .sort((a, b) => (a.workload ?? 0) - (b.workload ?? 0));
  });

  const selectedUser = createMemo(() =>
    props.users().find((u) => u.user_login_id === newAssigneeId()),
  );

  const canSubmit = createMemo(() => {
    return (
      !saving() &&
      !!props.task()?.item_id &&
      !!newAssigneeId() &&
      newAssigneeId() !== props.task()?.user_login_id
    );
  });

  createEffect(() => {
    if (props.open()) {
      setQuery("");
      setNewAssigneeId("");
      setReason("");
      setNotifyNewAssignee(true);
      setNotifyPreviousAssignee(true);
    }
  });

  async function submit() {
    if (!canSubmit()) return;

    setSaving(true);
    try {
      const payload = {
        item_id: props.task().item_id,
        update_type: "reassign",
        from_user_login_id: props.task().user_login_id,
        to_user_login_id: newAssigneeId(),
        reason: reason().trim() || null,
        notify_new_assignee: notifyNewAssignee(),
        notify_previous_assignee: notifyPreviousAssignee(),
        changed_by_user_login_id: props.currentUser().user_login_id,
      };

      const result = await props.onSubmit(payload);

      if (result.success) {
        props.showToast(
          `Task reassigned to ${selectedUser()?.display_name || "new owner"}`,
          "success",
        );
        props.onClose();
      } else {
        props.showToast(result.error || "Task reassignment failed", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Show when={props.open()}>
      <dialog class="popup reassign-modal" open>
        <h3>Reassign Task</h3>

        <div class="reassign-summary">
          <div>
            <strong>Task:</strong> {props.task()?.item_name}
          </div>
          <div>
            <strong>Current assignee:</strong>{" "}
            {currentAssignee()?.display_name || "Unassigned"}
          </div>
        </div>

        <label for="reassign-search">Find new assignee</label>
        <input
          id="reassign-search"
          type="text"
          placeholder="Search name or email"
          value={query()}
          onInput={(e) => setQuery(e.currentTarget.value)}
        />

        <div class="reassign-user-list">
          <Show
            when={filteredUsers().length > 0}
            fallback={
              <div class="reassign-empty">No matching users found.</div>
            }
          >
            <For each={filteredUsers()}>
              {(u) => (
                <button
                  type="button"
                  class={`reassign-user-option ${
                    newAssigneeId() === u.user_login_id ? "selected" : ""
                  }`}
                  onClick={() => setNewAssigneeId(u.user_login_id)}
                >
                  <div>{u.display_name}</div>
                  <small>
                    {u.email_address} • workload: {u.workload ?? 0}
                  </small>
                </button>
              )}
            </For>
          </Show>
        </div>

        <label for="reassign-reason">Reason (optional)</label>
        <textarea
          id="reassign-reason"
          rows="3"
          value={reason()}
          onInput={(e) => setReason(e.currentTarget.value)}
          placeholder="Context for the new assignee"
        />

        <label>
          <input
            type="checkbox"
            checked={notifyNewAssignee()}
            onChange={(e) => setNotifyNewAssignee(e.currentTarget.checked)}
          />
          Notify new assignee
        </label>

        <label>
          <input
            type="checkbox"
            checked={notifyPreviousAssignee()}
            onChange={(e) => setNotifyPreviousAssignee(e.currentTarget.checked)}
          />
          Notify previous assignee
        </label>

        <div class="buttons">
          <button class="action-button" type="button" onClick={props.onClose}>
            Cancel
          </button>
          <button
            class="action-button"
            type="button"
            onClick={submit}
            disabled={!canSubmit()}
          >
            {saving() ? "Reassigning..." : "Reassign Task"}
          </button>
        </div>
      </dialog>
    </Show>
  );
}
