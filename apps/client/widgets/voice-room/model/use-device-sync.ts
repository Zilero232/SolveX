'use client';

import { useRoomContext } from '@livekit/components-react';
import { type Room, RoomEvent } from 'livekit-client';
import { useEffect, useRef } from 'react';
import { keys } from 'remeda';
import { type DeviceSettings, KIND_TO_SLOT, useAppSettings } from '@/widgets/app-settings';

// Pushes the saved device selection onto the room. An empty id is skipped —
// that slot then follows the system default.
const applyDevices = (room: Room, devices: DeviceSettings) => {
  for (const kind of keys(KIND_TO_SLOT)) {
    const deviceId = devices[KIND_TO_SLOT[kind]];

    if (deviceId) void room.switchActiveDevice(kind, deviceId);
  }
};

// Store -> room: applies the saved devices on connect and on every change.
// The settings dialog lives outside LiveKitRoom and can only write the store,
// so this is what actually moves the selection onto the live room.
const useApplyDevices = (room: Room, devices: DeviceSettings) => {
  useEffect(() => {
    if (room.state === 'connected') applyDevices(room, devices);

    const onConnected = () => applyDevices(room, devices);
    room.on(RoomEvent.Connected, onConnected);

    return () => {
      room.off(RoomEvent.Connected, onConnected);
    };
  }, [room, devices]);
};

// Room -> store: a device switch from anywhere (the ControlBar menu, the OS,
// or applyDevices above) emits ActiveDeviceChanged; mirror it back so the
// dialog and the next session reflect the real choice. The equality guard
// stops the store -> room -> store round-trip from looping.
const useMirrorActiveDevice = (room: Room) => {
  const { settings, setGroup } = useAppSettings();

  // The listener is attached once per room; the latest store value and setter
  // are read through refs so it need not re-subscribe on every change.
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

// Store -> room: re-captures the mic track when the audio processing flags
// change. Only acts while the mic is live; otherwise the next unmute picks the
// flags up. Keyed on the serialized flags so it fires only on a real change;
// the flags themselves are read fresh through a ref.
const useApplyAudioFlags = (room: Room) => {
  const { settings } = useAppSettings();

  const audioRef = useRef(settings.audio);
  audioRef.current = settings.audio;

  const audioKey = JSON.stringify(settings.audio);

  useEffect(() => {
    if (room.localParticipant.isMicrophoneEnabled) {
      void room.localParticipant.setMicrophoneEnabled(true, audioRef.current);
    }
  }, [room, audioKey]);
};

// Bridges the persisted app settings and the live room. The settings dialog
// opens from the sidebar, outside LiveKitRoom, so it can only write to the
// store — this hook runs inside the room and applies what the dialog cannot.
export const useDeviceSync = () => {
  const room = useRoomContext();

  const { settings } = useAppSettings();

  useApplyAudioFlags(room);
  useMirrorActiveDevice(room);
  useApplyDevices(room, settings.devices);
};
