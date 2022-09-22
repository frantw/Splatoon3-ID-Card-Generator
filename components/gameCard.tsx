import React, { FC, useState, useLayoutEffect, useMemo, useRef, useEffect, MutableRefObject } from 'react';
import Konva from 'konva';
import { Stage, Layer, Text, Image } from 'react-konva';
import useImage from 'use-image';
import { Box } from '@chakra-ui/react';
import { VOICE_CHAT, PLAY_RULE } from '../typings';

type Props = {
    name: string;
    friendCode: string;
    favoriteWeapon: string;
    level: string;
    rankLevel: string;
    voiceChat: VOICE_CHAT;
    favoritePlayRules: Set<PLAY_RULE>;
    acceptablePlayRules: Set<PLAY_RULE>;
    memo: string;
    exportRef: MutableRefObject<() => void | null>;
};

const sceneWidth = 1920;
const sceneHeight = 1080;
const fontColor = '#5c4c42';

const downloadURI = (uri: string) => {
    const link = document.createElement('a');
    link.download = 'splatoon3-game-card.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const CardImage: FC = () => {
    const [image] = useImage('/img/template/game-card.png');
    return <Image image={image} alt='splatoon3 game card' />;
};

const Circle: FC<{ x: number; y: number; scale?: number; rotation?: number; isShow: boolean }> = ({
    x,
    y,
    scale = 0.2,
    rotation = 0,
    isShow,
}) => {
    const [image] = useImage('/img/hand-drawn/circle.svg');
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
            image={image}
            scale={{ x: scale, y: scale }}
            rotation={rotation}
            x={x}
            y={y}
            opacity={isShow ? 1.0 : 0.0}
        />
    );
};

const Triangle: FC<{ x: number; y: number; scale?: number; rotation?: number; isShow: boolean }> = ({
    x,
    y,
    scale = 0.2,
    rotation = 0,
    isShow,
}) => {
    const [image] = useImage('/img/hand-drawn/triangle.svg');
    return (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
            image={image}
            scale={{ x: scale, y: scale }}
            rotation={rotation}
            x={x}
            y={y}
            opacity={isShow ? 1.0 : 0.0}
        />
    );
};

const GameCard: FC<Props> = ({
    name,
    friendCode,
    favoriteWeapon,
    level,
    rankLevel,
    voiceChat,
    favoritePlayRules,
    acceptablePlayRules,
    memo,
    exportRef,
}) => {
    const stageRef = useRef<Konva.Stage>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    useLayoutEffect(() => {
        setContainerWidth(containerRef.current?.offsetWidth || 0);
        setContainerHeight(containerRef?.current?.offsetHeight || 0);
    }, []);

    // TODO: window resize
    const scale = useMemo(() => containerWidth / sceneWidth, [containerWidth]);

    const date = new Date().toLocaleDateString();

    const handleExport = () => {
        if (!stageRef.current) return;
        const stage = stageRef.current;
        stage.size({ width: sceneWidth, height: sceneHeight });
        stage.scale({ x: 1.0, y: 1.0 });
        const uri = stage.toDataURL();
        stage.size({ width: containerWidth, height: sceneHeight * scale });
        stage.scale({ x: scale, y: scale });
        downloadURI(uri);
    };

    useEffect(() => {
        exportRef.current = handleExport;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box ref={containerRef}>
            <Stage ref={stageRef} width={containerWidth} height={sceneHeight * scale} scale={{ x: scale, y: scale }}>
                <Layer>
                    <CardImage />

                    {/* Name */}
                    <Text
                        x={300}
                        y={130}
                        width={480}
                        height={80}
                        align={'center'}
                        verticalAlign={'middle'}
                        text={name}
                        fontSize={48}
                        fontFamily={'naikaifont'}
                        fill={fontColor}
                    />

                    {/* Friend Code */}
                    <Text x={368} y={253} text={friendCode} fontSize={36} fontFamily={'naikaifont'} fill={fontColor} />

                    {/* Favorite Weapon */}
                    <Text
                        x={320}
                        y={360}
                        width={420}
                        height={80}
                        align={'center'}
                        verticalAlign={'middle'}
                        text={favoriteWeapon}
                        fontSize={36}
                        fontFamily={'naikaifont'}
                        fill={fontColor}
                    />

                    {/* Voice Chat */}
                    <Circle x={310} y={495} isShow={voiceChat === VOICE_CHAT.DISCORD} />
                    <Circle x={410} y={498} isShow={voiceChat === VOICE_CHAT.LINE} />
                    <Circle x={513} y={498} isShow={voiceChat === VOICE_CHAT.NINTENDO_SWITCH_ONLINE} />
                    <Circle x={615} y={500} isShow={voiceChat === VOICE_CHAT.NONE} />

                    {/* Play Rules */}
                    <Circle x={283} y={645} isShow={favoritePlayRules.has(PLAY_RULE.TURF_WAR)} />
                    <Triangle x={305} y={640} rotation={20} isShow={acceptablePlayRules.has(PLAY_RULE.TURF_WAR)} />
                    <Circle x={440} y={643} isShow={favoritePlayRules.has(PLAY_RULE.SALMON_RUN)} />
                    <Triangle x={479} y={634} rotation={30} isShow={acceptablePlayRules.has(PLAY_RULE.SALMON_RUN)} />
                    <Circle x={592} y={644} isShow={favoritePlayRules.has(PLAY_RULE.TABLETURF_BATTLE)} />
                    <Triangle
                        x={690}
                        y={710}
                        rotation={150}
                        isShow={acceptablePlayRules.has(PLAY_RULE.TABLETURF_BATTLE)}
                    />
                    <Circle x={286} y={730} isShow={favoritePlayRules.has(PLAY_RULE.SPLAT_ZONES)} />
                    <Triangle x={325} y={725} rotation={35} isShow={acceptablePlayRules.has(PLAY_RULE.SPLAT_ZONES)} />
                    <Circle x={439} y={732} isShow={favoritePlayRules.has(PLAY_RULE.RAINMAKER)} />
                    <Triangle x={496} y={723} rotation={45} isShow={acceptablePlayRules.has(PLAY_RULE.RAINMAKER)} />
                    <Circle x={592} y={730} isShow={favoritePlayRules.has(PLAY_RULE.TOWER_CONTROL)} />
                    <Triangle
                        x={585}
                        y={805}
                        rotation={-80}
                        isShow={acceptablePlayRules.has(PLAY_RULE.TOWER_CONTROL)}
                    />
                    <Circle x={748} y={728} isShow={favoritePlayRules.has(PLAY_RULE.CLAM_BLITZ)} />
                    <Triangle x={745} y={812} rotation={-90} isShow={acceptablePlayRules.has(PLAY_RULE.CLAM_BLITZ)} />

                    {/* Date */}
                    <Text
                        x={1510}
                        y={518}
                        width={287}
                        height={50}
                        align={'center'}
                        verticalAlign={'middle'}
                        text={date}
                        fontSize={36}
                        fontFamily={'naikaifont'}
                        fill={fontColor}
                    />

                    {/* Level */}
                    <Text
                        x={1218}
                        y={695}
                        width={80}
                        height={80}
                        align={'center'}
                        verticalAlign={'middle'}
                        text={level}
                        fontSize={56}
                        fontFamily={'naikaifont'}
                        fill={fontColor}
                    />

                    {/* Rank Level */}
                    <Text
                        x={1452}
                        y={695}
                        width={80}
                        height={80}
                        align={'center'}
                        verticalAlign={'middle'}
                        text={rankLevel}
                        fontSize={56}
                        fontFamily={'naikaifont'}
                        fill={fontColor}
                    />

                    {/* Memo */}
                    <Text
                        x={300}
                        y={860}
                        width={1480}
                        height={115}
                        align={'left'}
                        verticalAlign={'middle'}
                        text={memo}
                        fontSize={48}
                        fontFamily={'naikaifont'}
                        fill={fontColor}
                    />
                </Layer>
            </Stage>
        </Box>
    );
};

export default GameCard;