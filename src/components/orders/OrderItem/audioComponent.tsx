import { useRef, useState } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import { Icons } from '@/entities/icons';

const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  let audioRef = useRef<HTMLAudioElement>(null);
  const AudioPlay = Icons.play;
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <Flex mt={18} direction="column" align="center">
      <audio ref={audioRef} src={src} />
      <Button size="lg" height="150px" width="200px" isDisabled={!src} onClick={handlePlayPause}>
        <AudioPlay />
      </Button>
    </Flex>
  );
};

export default AudioPlayer;
