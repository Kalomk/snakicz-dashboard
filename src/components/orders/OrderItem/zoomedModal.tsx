import FileSaver from 'file-saver';
import { ModalComponent } from '@/components/modal';
import { Box, Text, Flex, Button, HStack, useToast } from '@chakra-ui/react';

import { Icons } from '@/entities/icons';

export const ModalZoomedItem = ({
  isOpen,
  onClose,
  children,
  fileUrl,
  type = 'img',
}: {
  isOpen: boolean;
  onClose(): void;
  children: JSX.Element;
  fileUrl: string;
  type?: 'img' | 'audio';
}) => {
  const DownloadIcon = Icons.download;
  const ShareIcon = Icons.share;
  const toast = useToast();
  // Function to handle file download
  const handleDownload = async () => {
    try {
      const whatType = type === 'img' ? 'image.jpg' : 'audio.mp3';
      FileSaver.saveAs(fileUrl, whatType);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard:', text);
      // Optionally, show a success message to the user
      toast({
        title: 'Успішно скопійовано!',
        description: 'Скопійовано',
        position: 'top-right',
        status: 'success',
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Optionally, show an error message to the user
      toast({
        title: 'Не скопійовано!',
        description: 'Не вдалось скопіювати',
        position: 'top-right',
        status: 'error',
      });
    }
  };
  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <Flex justifyContent={'center'} alignContent={'center'} flexDirection={'column'}>
        <Box>{children}</Box>
        <HStack marginTop={5} justifyContent={'space-around'} alignContent={'center'}>
          <Button onClick={handleDownload} size={['sm', 'sm', 'sm', 'lg']}>
            <DownloadIcon />
            <Text marginLeft={2}>Завантажити</Text>
          </Button>
          <Button onClick={() => handleCopyToClipboard(fileUrl)} size={['sm', 'sm', 'sm', 'lg']}>
            <ShareIcon />
            <Text marginLeft={2}> Скопіювати посилання</Text>
          </Button>
        </HStack>
      </Flex>
    </ModalComponent>
  );
};
