import { Howl } from 'howler'

const soundMap: Record<string, Howl> = {}

export function loadSound(name: string, path: string): void {
  soundMap[name] = new Howl({
    src: [path],
    volume: 1
  })
}

export function play(name: string): void {
  soundMap[name]?.play()
}
