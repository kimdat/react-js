import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import styles from './HamburgerMenu.module.scss';

export default function HamburgerMenu({ trigger, body }) {
    return (
        <Dialog.Root modal>
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.modalOverlay} />
                <Dialog.Content className={styles.modalContent}>
                    {body}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}