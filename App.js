import * as React from 'react';
import { useState } from 'react';
import {
    CenteredControlBar,
    CenteredDelayedActivityIndicator,
    ControlBar,
    DEFAULT_THEOPLAYER_THEME,
    FullscreenButton,
    LanguageMenuButton,
    MuteButton,
    PipButton,
    PlaybackRateSubMenu,
    PlayButton,
    QualitySubMenu,
    SeekBar,
    SettingsMenuButton,
    SkipButton,
    Spacer,
    TimeLabel,
    UiContainer,
} from '@theoplayer/react-native-ui';
import { PlayerEventType, THEOplayerView } from 'react-native-theoplayer';

import { Platform, StyleSheet, View } from 'react-native';

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

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
    const [player, setPlayer] = useState();
    const chromeless = playerConfig?.chromeless ?? false;
    const onPlayerReady = (player) => {
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

        player.backgroundAudioConfiguration = { enabled: true };
        player.pipConfiguration = { startsAutomatically: true };
        console.log('THEOplayer is ready:', player.version);
    };

    const needsBorder = Platform.OS === 'ios';
    const PLAYER_CONTAINER_STYLE = {
        position: 'absolute',
        top: needsBorder ? 20 : 0,
        left: needsBorder ? 5 : 0,
        bottom: 0,
        right: needsBorder ? 5 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
    };

    return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
            <View style={PLAYER_CONTAINER_STYLE}>
                <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
                    {player !== undefined && chromeless && (
                        <UiContainer
                            theme={{ ...DEFAULT_THEOPLAYER_THEME }}
                            player={player}
                            behind={<CenteredDelayedActivityIndicator size={50} />}
                            top={
                                <ControlBar>
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
                                    <ControlBar>
                                        <SeekBar />
                                    </ControlBar>
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
