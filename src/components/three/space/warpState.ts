/**
 * Module-level scroll-velocity store shared rig -> starfield.
 *
 * Only ONE camera rig (CameraRig or ShellCameraRig) is ever mounted per page, so a
 * plain module store is race-free and avoids React state churn per frame. The rig
 * calls updateWarp(easedT, delta) each frame; Starfield's warp-streak layer reads
 * warp.intensity as a single material-opacity write.
 */
export const warp = { velocity: 0, intensity: 0 };

let lastT = 0;
let smoothed = 0;

export function updateWarp(t: number, delta: number): void {
  // Frameloop resumed after a pause (tab hidden / off-screen): resync, never spike.
  if (delta > 0.5) {
    lastT = t;
    return;
  }
  const raw = Math.abs(t - lastT) / Math.max(delta, 1 / 240);
  smoothed += (raw - smoothed) * Math.min(1, delta * 8);
  warp.velocity = smoothed;
  // Deadzone 0.05 so normal slow scrolling never triggers streaks; only genuinely
  // fast scroll ramps intensity toward 1.
  warp.intensity = Math.min(1, Math.max(0, (smoothed - 0.05) * 12));
  lastT = t;
}
