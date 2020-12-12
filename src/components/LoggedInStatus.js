import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import client from '../client';

export default function LoggedInStatus({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  function onLogout() {
    client.logout().then(() => {
      window.location.href = '/';
    });
  }
  return (
    <div
      className="logged-in-status"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      {/* <div className="logged-in-status__username">{user.email}</div> */}
      <div className="logged-in-status__icon">
        <FiUser />
      </div>

      {dropdownOpen && (
        <div className="logged-in-status__dropdown">
          <div className="logged-in-status-dropdown" onClick={onLogout}>
            Log out
          </div>
        </div>
      )}
    </div>
  );
}
