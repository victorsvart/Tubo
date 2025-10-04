import { contextBridge } from 'electron';

//this file does nothing, may be useful in the future
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
});
