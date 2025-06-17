import {Platform, View, StyleSheet} from "react-native";
import {PlayerEventType, PresentationMode, THEOplayer, THEOplayerView} from "react-native-theoplayer";
import {useMemo, useState} from "react";
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
    UiContainer,
} from "@theoplayer/react-native-ui";
import {SafeAreaProvider, SafeAreaView, Edges} from 'react-native-safe-area-context';
import {usePresentationMode} from "./hooks/usePresentationMode";
import {StatusBar} from "expo-status-bar";
import {SourceMenuButton, SOURCES} from "@/app/custom/SourceMenuButton";

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
    const presentationMode = usePresentationMode(player);

    // In PiP presentation mode on NewArch Android, there is an issue where SafeAreaView does not update the edges in time,
    // so explicitly disable them here.
    const edges: Edges = useMemo(() =>
        (presentationMode === PresentationMode.pip ? [] : ['left', 'top', 'right', 'bottom']), [presentationMode]);

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

        player.autoplay = true;
        player.source = SOURCES[0].source;

        player.backgroundAudioConfiguration = {enabled: true};
        player.pipConfiguration = {startsAutomatically: true};
        console.log('THEOplayer is ready');
    };

    const needsBorder = Platform.OS === 'ios';

    return (
        <SafeAreaProvider>
            <StatusBar style="light"/>
            <SafeAreaView edges={edges} style={{flex: 1, backgroundColor: 'black'}}>
                <View style={styles.container}>
                    <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
                        {player !== undefined && (
                            <UiContainer
                                theme={{...DEFAULT_THEOPLAYER_THEME}}
                                player={player}
                                behind={<CenteredDelayedActivityIndicator size={50}/>}
                                top={
                                    <ControlBar>
                                        {/*This is a custom menu for source selection.*/}
                                        <SourceMenuButton />
                                        {!Platform.isTV && (
                                            <>
                                                <AirplayButton/>
                                                <ChromecastButton/>
                                            </>
                                        )}
                                        <LanguageMenuButton/>
                                        <SettingsMenuButton>
                                            {/*Note: quality selection is not available on iOS */}
                                            <QualitySubMenu/>
                                            <PlaybackRateSubMenu/>
                                        </SettingsMenuButton>
                                    </ControlBar>
                                }
                                center={<CenteredControlBar left={<SkipButton skip={-10}/>} middle={<PlayButton/>}
                                                            right={<SkipButton skip={30}/>}/>}
                                bottom={
                                    <>
                                        <ControlBar style={{justifyContent: 'flex-start'}}>
                                            <CastMessage/>
                                        </ControlBar>
                                        {
                                            /*Note: RNSlider is not available on tvOS */
                                            !(Platform.isTV && Platform.OS === 'ios') && (
                                                <ControlBar>
                                                    <SeekBar/>
                                                </ControlBar>
                                            )
                                        }
                                        <ControlBar>
                                            <MuteButton/>
                                            <TimeLabel showDuration={true}/>
                                            <Spacer/>
                                            <PipButton/>
                                            <FullscreenButton/>
                                        </ControlBar>
                                    </>
                                }
                            />
                        )}
                    </THEOplayerView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // on iOS we cannot stretch an inline playerView to cover the whole screen, otherwise it assumes fullscreen presentationMode.
        marginHorizontal: Platform.select({ios: 2, default: 0}),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
