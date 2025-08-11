import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      isModalOpen: false, // Initial state: modal is closed
};

const modalSlice = createSlice({
      name: "modal",
      initialState,
      reducers: {
            toggleModal: (state) => {
                  state.isModalOpen = !state.isModalOpen; // Toggle state
            },
            openModal: (state) => {
                  state.isModalOpen = true; // Open modal
            },
            closeModal: (state) => {
                  state.isModalOpen = false; // Close modal
            },
      },
});

// Export actions
export const { toggleModal, openModal, closeModal } = modalSlice.actions;

// Export reducer
export default modalSlice.reducer;
