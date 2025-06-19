// ConfirmationPopup.jsx

import Modal from "./Modal";
import { Button } from "./ui/button";

export default function ConfirmationPopup({
  show,
  onClose,
  onConfirm,
  title,
  message,
}: {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  return (
    <Modal
      title={title}
      show={show}
      handleClose={onClose}
      containerPadding="p-5  "
    >
      <div className="flex flex-col gap-10  md:gap-14 md:min-w-[500px] min-w-[80vw] ">
        <p className="text-gray-500">{message}</p>
        <div className="flex flex-row items-center justify-end gap-2 md:gap-3 px-5">
          <Button
            className="px-5 w-1/2 sm:w-[100px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button className="px-5 w-1/2 sm:w-[100px]" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
