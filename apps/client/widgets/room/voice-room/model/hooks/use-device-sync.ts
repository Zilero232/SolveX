'use client';

import { useRoomContext } from '@livekit/components-react';
import { type Room, RoomEvent } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { keys } from 'remeda';
import { type DeviceSettings, KIND_TO_SLOT, useAppSettings } from '@/widgets/app/app-settings';

const applyDevices = (room: Room, devices: DeviceSettings) => {
  for (const kind of keys(KIND_TO_SLOT)) {
    const deviceId = devices[KIND_TO_SLOT[kind]];

    if (deviceId) room.switchActiveDevice(kind, deviceId);
  }
};

const useApplyDevices = (room: Room, devices: DeviceSettings) => {
  useEffect(() => {
    if (room.state === 'connected') applyDevices(room, devices);

    const onConnected = () => {
      return applyDevices(room, devices);
    };
    room.on(RoomEvent.Connected, onConnected);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
    };
  }, [room, devices]);
};

const useMirrorActiveDevice = (room: Room) => {
  const { settings, setGroup } = useAppSettings();

  const devicesRef = useRef(settings.devices);
  devicesRef.current = settings.devices;

  const setGroupRef = useRef(setGroup);
  setGroupRef.current = setGroup;

  useEffect(() => {
    const onActiveDeviceChanged = (kind: MediaDeviceKind, deviceId: string) => {
      const slot = KIND_TO_SLOT[kind];
      if (devicesRef.current[slot] === deviceId) return;

      setGroupRef.current('devices', { [slot]: deviceId });
    };

    room.on(RoomEvent.ActiveDeviceChanged, onActiveDeviceChanged);

    return () => {
      room.off(RoomEvent.ActiveDeviceChanged, onActiveDeviceChanged);
    };
  }, [room]);
};

const useApplyAudioFlags = (room: Room) => {
  const { settings } = useAppSettings();
  const { audio } = settings;

  useEffect(() => {
    if (room.localParticipant.isMicrophoneEnabled) {
      room.localParticipant.setMicrophoneEnabled(true, audio);
    }
  }, [room, audio]);
};

export const useDeviceSync = () => {
  const room = useRoomContext();

  const { settings } = useAppSettings();

  useApplyAudioFlags(room);
  useMirrorActiveDevice(room);
  useApplyDevices(room, settings.devices);
};
