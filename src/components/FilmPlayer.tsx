import { useEffect, useState } from 'react';
import { MuteButton } from '@videojs/react';
import { Video, VideoPlayer, VideoSkin } from '@videojs/react/video';
import { HlsJsVideo } from '@videojs/react/media/hlsjs-video';
import { Volume2, VolumeX } from 'lucide-react';
import '@videojs/react/video/skin.css';
import { getFilm, type FilmDevice, type FilmTheme } from '../utils/films';

interface Props {
  lang?: string;
  muteLabel?: string;
  unmuteLabel?: string;
}

const PORTRAIT_QUERY = '(orientation: portrait) and (max-width: 767px)';

function useTheme(): FilmTheme {
  const [theme, setTheme] = useState<FilmTheme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

function useDevice(): FilmDevice {
  const [device, setDevice] = useState<FilmDevice>(() =>
    window.matchMedia(PORTRAIT_QUERY).matches ? 'mobile' : 'desktop',
  );
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_QUERY);
    const update = () => setDevice(mq.matches ? 'mobile' : 'desktop');
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return device;
}

const mediaClass = 'w-full h-full object-contain bg-white dark:bg-primary-950';

export default function FilmPlayer({
  lang = 'en',
  muteLabel = 'Mute',
  unmuteLabel = 'Unmute',
}: Props) {
  const theme = useTheme();
  const device = useDevice();
  const film = getFilm(lang, theme, device);
  const [failedHls, setFailedHls] = useState<string | null>(null);
  const useMp4 = failedHls === film.hls;

  return (
    <div className="w-full h-full bg-white dark:bg-primary-950">
      <VideoPlayer>
        <VideoSkin className="w-full h-full bg-white dark:bg-primary-950">
          {useMp4 ? (
            <Video
              key={film.mp4}
              src={film.mp4}
              autoPlay
              muted
              playsInline
              className={mediaClass}
            />
          ) : (
            <HlsJsVideo
              key={film.hls}
              src={film.hls}
              autoPlay
              muted
              playsInline
              className={mediaClass}
              onError={() => setFailedHls(film.hls)}
            />
          )}
          <MuteButton
            className="absolute top-3 right-3 z-10 p-2 rounded-full cursor-pointer text-white bg-black/50 hover:bg-black/70 backdrop-blur"
            render={(props, state) => (
              <button
                {...props}
                type="button"
                aria-label={state.muted ? unmuteLabel : muteLabel}
              >
                {state.muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          />
        </VideoSkin>
      </VideoPlayer>
    </div>
  );
}
