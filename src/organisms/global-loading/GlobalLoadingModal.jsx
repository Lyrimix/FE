import React from "react";
import { FadeLoader } from "react-spinners";
import { PROJECT_MAIN_THEME } from "../../utils/constant";
import { useLoadingStore } from "../../store/useLoadingStore";

export const GlobalLoadingModal = ({ loadingColor = PROJECT_MAIN_THEME }) => {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="modal position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center">
      <FadeLoader color={loadingColor} size={150} />
    </div>
  );
};
