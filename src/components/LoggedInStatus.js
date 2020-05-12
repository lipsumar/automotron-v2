import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

export default function LoggedInStatus({ user, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div
      className="logged-in-status"
      onClick={() => setDropdownOpen(!dropdownOpen)}
    >
      {/* <div className="logged-in-status__username">{user.username}</div> */}
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
