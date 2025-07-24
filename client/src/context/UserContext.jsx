import { createContext, useContext, useEffect, useState } from "react";

// 🔧 Create a new context for user-related data and actions
const UserContext = createContext();

// 🧩 Context Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on initial mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 📡 Fetch the currently logged-in user from server
  const fetchUser = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/me", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user); // ✅ Correctly use the returned user data
        localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Add this

      }
    } catch (error) {
      console.error("❌ Failed to fetch user:", error);
    }
  };

  // ⏱️ Fetch user on mount to keep context in sync
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔐 Log the user out (server + client)
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  // 📝 Update a user address by ID
  const updateAddress = async (id, updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/address/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      // 📦 Handle response safely (even if HTML is returned)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON: " + text);
      }

      if (data.success) await fetchUser(); // ✅ Refresh context after update
      return data;
    } catch (err) {
      console.error("❌ Failed to update address:", err);
      return { success: false, message: "Update failed" };
    }
  };

  // 🗑️ Delete a user address by ID
  const deleteAddress = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/address/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON: " + text);
      }

      if (data.success) 
      await fetchUser(); // ✅ Refresh context after deletion
      return data;
    } catch (err) {
      console.error("❌ Failed to delete address:", err);
      return { success: false, message: "Delete failed" };
    }
  };

  // Provide context value to consuming components
  return (
    <UserContext.Provider
      value={{ user, fetchUser, updateAddress, deleteAddress, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use UserContext easily in components
export const useUser = () => useContext(UserContext);
