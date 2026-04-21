export function getDealerSession() {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;

    return {
      dealerId: user?.dealer_id ?? null,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    };
  } catch (error) {
    console.error("Invalid dealer session in localStorage", error);
    return {
      dealerId: null,
      name: "",
      email: "",
      phone: "",
    };
  }
}
