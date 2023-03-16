import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./Modal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Modal(props) {
  const {
    trigger,
    title,
    body,
    hideOnClickOutside = true,
    isOpen = false,
    hasCloseButton = true,
    setOpen = () => {},
  } = props;

  const handleCloseModal = () => {
    setOpen(false);
  };
  return (
    <Dialog.Root modal open={isOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.modalOverlay}
          onClick={hideOnClickOutside ? handleCloseModal : undefined}
        />
        <div className={styles.modalContent}>
          {hasCloseButton && (
            <Dialog.Close asChild>
              <button className={styles.closeButton} aria-label="Close">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Dialog.Close>
          )}
          {title && (
            <Dialog.Title className={styles.modalTitle}>{title}</Dialog.Title>
          )}
          {body}
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
