import {Platform, View, StyleSheet} from "react-native";
import {PlayerEventType, THEOplayer, THEOplayerView} from "react-native-theoplayer";
import {useState} from "react";
import {
    AirplayButton,
    CastMessage,
    CenteredControlBar,
    CenteredDelayedActivityIndicator,
    ChromecastButton,
    ControlBar,
    DEFAULT_THEOPLAYER_THEME,
    FullscreenButton,
    LanguageMenuButton, MuteButton,
    PipButton, PlaybackRateSubMenu, PlayButton, QualitySubMenu, SeekBar, SettingsMenuButton,
    SkipButton,
    Spacer,
    TimeLabel,
    UiContainer
} from "@theoplayer/react-native-ui";
import { StatusBar } from 'expo-status-bar';

const playerConfig = {
    // Get your THEOplayer license from https://portal.theoplayer.com/
    // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
    license: undefined,
    chromeless: true,
    hlsDateRange: true,
    libraryLocation: 'theoplayer',
    mediaControl: {
        mediaSessionEnabled: true,
    },
};

export default function Index() {
    const [player, setPlayer] = useState<THEOplayer | undefined>();
    const onPlayerReady = (player: THEOplayer) => {
        setPlayer(player);
        // optional debug logs
        player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
        player.addEventListener(PlayerEventType.LOADED_DATA, console.log);
        player.addEventListener(PlayerEventType.LOADED_METADATA, console.log);
        player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
        player.addEventListener(PlayerEventType.PLAY, console.log);
        player.addEventListener(PlayerEventType.PLAYING, console.log);
        player.addEventListener(PlayerEventType.PAUSE, console.log);
        player.addEventListener(PlayerEventType.SEEKING, console.log);
        player.addEventListener(PlayerEventType.SEEKED, console.log);
        player.addEventListener(PlayerEventType.ENDED, console.log);
        player.addEventListener(PlayerEventType.ERROR, console.log);
        player.source = {
            "sources": [{
                "src": "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8",
                "type": "application/x-mpegurl"
            }],
            "poster": "https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg",
            "metadata": {
                "title": "The Title",
                "subtitle": "The Subtitle",
                "album": "Album",
                "displayIconUri": "https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg",
                "artist": "Artist"
            }
        };
        player.backgroundAudioConfiguration = {enabled: true};
        player.pipConfiguration = {startsAutomatically: true};
        console.log('THEOplayer is ready');
    };

    const needsBorder = Platform.OS === 'ios';

    return (
        <View style={[StyleSheet.absoluteFill, {backgroundColor: '#000000'}]}>
            <StatusBar style="dark" />
            <View style={{
                position: 'absolute',
                top: needsBorder ? 20 : 0,
                left: needsBorder ? 5 : 0,
                bottom: 0,
                right: needsBorder ? 5 : 0,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#000000',
            }}>
                <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
                    {player !== undefined && (
                        <UiContainer
                            theme={{ ...DEFAULT_THEOPLAYER_THEME }}
                            player={player}
                            behind={<CenteredDelayedActivityIndicator size={50} />}
                            top={
                                <ControlBar>
                                    {!Platform.isTV && (
                                        <>
                                            <AirplayButton />
                                            <ChromecastButton />
                                        </>
                                    )}
                                    <LanguageMenuButton />
                                    <SettingsMenuButton>
                                        {/*Note: quality selection is not available on iOS */}
                                        <QualitySubMenu />
                                        <PlaybackRateSubMenu />
                                    </SettingsMenuButton>
                                </ControlBar>
                            }
                            center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />}
                            bottom={
                                <>
                                    <ControlBar style={{ justifyContent: 'flex-start' }}>
                                        <CastMessage />
                                    </ControlBar>
                                    {
                                        /*Note: RNSlider is not available on tvOS */
                                        !(Platform.isTV && Platform.OS === 'ios') && (
                                            <ControlBar>
                                                <SeekBar />
                                            </ControlBar>
                                        )
                                    }
                                    <ControlBar>
                                        <MuteButton />
                                        <TimeLabel showDuration={true} />
                                        <Spacer />
                                        <PipButton />
                                        <FullscreenButton />
                                    </ControlBar>
                                </>
                            }
                        />
                    )}
                </THEOplayerView>
            </View>
        </View>
    );
}
