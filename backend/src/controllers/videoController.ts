import { YtDlp } from 'ytdlp-nodejs';
import path from 'path';
import os from 'os';
import fs from 'fs';

// local instance fuck it should change this to have a global instance
const ytdlp = new YtDlp();

export const getVideoInfo = async (req: any, res: any) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const info = await ytdlp.getInfoAsync(url.trim());
    if ('duration' in info && 'thumbnail' in info) {
      res.json({
        success: true,
        info: {
          title: info.title,
          duration: info.duration,
          thumbnail: info.thumbnail,
          uploader: info.uploader,
          formats: info.formats?.length || 0,
        },
      });
    } else {
      res.json({
        success: true,
        info: {
          title: info.title,
          entries: info.entries?.length || 0,
        },
      });
    }
  } catch (error: any) {
    console.error('Error getting video info:', error);
    res.status(500).json({
      error: 'Failed to get video information',
      message: error.message,
    });
  }
};

export const downloadVideo = async (req: any, res: any) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const downloadsDir = path.join(os.homedir(), 'Downloads', 'Tubo');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const outputTemplate = path.join(downloadsDir, '%(title)s.%(ext)s');

    const result = await ytdlp.downloadAsync(url.trim(), {
      onProgress: (progress: any) => {
        console.log('Download progress:', progress);
      },
      output: outputTemplate,
    });

    res.json({
      success: true,
      message: 'Video downloaded successfully',
      path: downloadsDir,
      result,
    });
  } catch (error: any) {
    console.error('Error downloading video:', error);
    res.status(500).json({
      error: 'Failed to download video',
      message: error.message,
    });
  }
};
