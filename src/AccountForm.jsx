import { useGlobalState } from "./GlobalStateProvider";
import { reformatMySQLDate } from "./JS/helperFunctions";

export function AccountForm() {
  var { user } = useGlobalState();

  return (
    <>
      <h1>Account</h1>
      <div class="account">
        <div class="account_item">
          <label for="name">Full Name</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={user().full_name}
          />
        </div>
        <div class="account_item">
          <label for="name">Display Name</label>
          <input
            type="text"
            name="display_name"
            id="display_name"
            value={user().display_name}
          />
        </div>
        <div class="account_item">
          <label for="email_address">Email Address</label>
          <input
            type="text"
            name="email_address"
            id="email_address"
            value={user().email_address}
          />
        </div>
        <div class="account_item">
          <label for="joined">Joined</label>
          <input
            type="text"
            name="joined"
            id="joined"
            value={reformatMySQLDate(user().created_dtm)}
          />
        </div>
      </div>
    </>
  );
}
