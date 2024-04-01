import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

export function ModalComponent({
  children,
  isOpen,
  onClose,
}: {
  children: JSX.Element;
  isOpen: boolean;
  onClose(): void;
}) {
  return (
    <>
      <Modal size={['sm', 'sm', 'sm', 'lg']} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
