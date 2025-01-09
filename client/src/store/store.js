import { create } from "zustand";

export const useClientStore = create((set) => ({
  clientData: [],
  setClientData: (data) => set({ clientData: data }),
  removeClient: (cid) =>
    set((state) => ({
      clientData: state.clientData.filter((client) => client._id !== cid),
    })),
}));

export let useClientDocumentsStore = create((set) => ({
  clientDocs: {
    userId: null,
    document: [],
    info: null,
  },
  setClientDocs: (data) => set({ clientDocs: data }),
}));

export let useEmployeeStore = create((set) => ({
  employeeData: [],
  setEmployeeData: (data) => set({ employeeData: data }),
  removeEmployee: (eid) =>
    set((state) => ({
      employeeData: state.employeeData.filter(
        (employee) => employee._id !== eid
      ),
    })),
}));

export let useEvent = create((set) => ({
  events: [],
  setEvents: (data) => set({ events: data }),
  removeEvents: (id) =>
    set((state) => ({ events: state.events.filter((t) => t._id !== id) })),
}));
