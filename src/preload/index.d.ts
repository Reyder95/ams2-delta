import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      file: {
        read: (filename: string) => Promise<any>
        write: (filename: string, data: unknown) => Promise<boolean>
        list: () => Promise<string[]>
      },
      image: {
        select: () => Promise<string | null>
        import: (sourcePath: string, profileId: string) => Promise<string>
      }
    }
  }
}
