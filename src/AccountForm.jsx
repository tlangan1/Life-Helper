export function AccountForm() {
  return (
    <div>
      <h1>Account</h1>
      <div class="account">
        <div class="account_item">
          <label for="name">Name</label>
          <input type="text" name="name" id="name" />
        </div>
        <div class="account_item">
          <label for="phone">Phone Number</label>
          <input type="text" name="phone" id="phone" />
        </div>
      </div>
    </div>
  );
}
